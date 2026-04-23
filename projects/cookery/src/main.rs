use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use deadpool_postgres::{Manager, Pool};
use serde::Deserialize;
use std::{
    collections::{BTreeMap, HashMap, HashSet},
    env,
    net::SocketAddr,
    sync::Arc,
};
use tokio_postgres::{Config, NoTls, Row};

#[derive(Clone)]
struct AppState {
    db: Pool,
    schema: RecipeSchema,
    ingredient_table: Option<String>,
    keyword_table: Option<String>,
    category_table: Option<String>,
}

#[derive(Clone)]
struct RecipeSchema {
    table: String,
    id_col: String,
    title_col: String,
    summary_col: Option<String>,
    instructions_col: String,
}

#[derive(Debug, Clone)]
struct RecipeSummary {
    id: i32,
    title: String,
}

#[derive(Debug, Clone)]
struct RecipeDetail {
    id: i32,
    title: String,
    instructions: String,
    ingredients: Vec<Ingredient>,
    keywords: Vec<String>,
}

#[derive(Debug, Clone)]
struct Ingredient {
    name: String,
    qty: String,
    prepared: String,
}

#[derive(Deserialize)]
struct SearchParams {
    q: Option<String>,
    mode: Option<String>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum NavMode {
    Alphabetical,
    Category,
}

impl NavMode {
    fn from_query(value: Option<&str>) -> Self {
        match value.map(|v| v.trim().to_ascii_lowercase()) {
            Some(v) if v == "alpha" || v == "alphabetical" => Self::Alphabetical,
            _ => Self::Category,
        }
    }

    fn as_query(self) -> &'static str {
        match self {
            Self::Alphabetical => "alpha",
            Self::Category => "category",
        }
    }
}

#[tokio::main]
async fn main() {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is required");
    let recipe_table = env::var("COOKERY_RECIPE_TABLE").unwrap_or_else(|_| "recipes".to_string());

    let db_config: Config = database_url.parse().expect("invalid DATABASE_URL");
    let manager = Manager::new(db_config, NoTls);
    let db = Pool::builder(manager).max_size(16).build().expect("pool");

    let schema = discover_schema(&db, &recipe_table)
        .await
        .expect("could not find recipe table columns");

    let ingredient_table = discover_table(&db, "fingredient").await.ok();
    let keyword_table = discover_table(&db, "fkeyword").await.ok();
    let category_table = discover_table(&db, "fcategory").await.ok();
    let state = Arc::new(AppState {
        db,
        schema,
        ingredient_table,
        keyword_table,
        category_table,
    });

    let app = Router::new()
        .route("/", get(list_recipes))
        .route("/recipe/{id}", get(get_recipe))
        .route("/health", get(health))
        .with_state(state);

    let port = env::var("PORT").unwrap_or_else(|_| "8081".to_string());
    let addr: SocketAddr = format!("0.0.0.0:{port}").parse().expect("invalid port");
    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind");

    println!("Cookery server listening on {addr}");
    axum::serve(listener, app).await.expect("server failed");
}

async fn health() -> impl IntoResponse {
    (StatusCode::OK, "ok")
}

async fn list_recipes(
    State(state): State<Arc<AppState>>,
    Query(params): Query<SearchParams>,
) -> impl IntoResponse {
    let mode = NavMode::from_query(params.mode.as_deref());
    match fetch_recipe_summaries(&state, params.q).await {
        Ok(recipes) => {
            let categories = fetch_recipe_categories(&state, &recipes)
                .await
                .unwrap_or_default();
            Html(render_index(&recipes, mode, &categories)).into_response()
        }
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Database error: {err}"),
        )
            .into_response(),
    }
}

async fn get_recipe(
    State(state): State<Arc<AppState>>,
    Path(id): Path<i32>,
    Query(params): Query<SearchParams>,
) -> impl IntoResponse {
    let mode = NavMode::from_query(params.mode.as_deref());
    match fetch_recipe_detail(&state, id).await {
        Ok(Some(recipe)) => {
            let all_recipes = fetch_recipe_summaries(&state, None)
                .await
                .unwrap_or_default();
            let categories = fetch_recipe_categories(&state, &all_recipes)
                .await
                .unwrap_or_default();
            Html(render_recipe(&recipe, &all_recipes, mode, &categories)).into_response()
        }
        Ok(None) => (StatusCode::NOT_FOUND, "Recipe not found").into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Database error: {err}"),
        )
            .into_response(),
    }
}

async fn discover_schema(db: &Pool, table: &str) -> Result<RecipeSchema, String> {
    if !is_safe_identifier(table) {
        return Err("invalid COOKERY_RECIPE_TABLE".to_string());
    }

    let mut client = db.get().await.map_err(|e| e.to_string())?;
    let tx = client
        .build_transaction()
        .read_only(true)
        .start()
        .await
        .map_err(|e| e.to_string())?;
    let rows = tx
        .query(
            "SELECT column_name
             FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = $1",
            &[&table],
        )
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    let mut cols = rows
        .iter()
        .map(|r| r.get::<_, String>("column_name"))
        .collect::<Vec<_>>();
    cols.sort();

    let id_col = pick_column(&cols, &["id", "recipe_id"]).ok_or("missing id column")?;
    let title_col =
        pick_column(&cols, &["title", "name", "recipename"]).ok_or("missing title column")?;
    let summary_col = pick_column(&cols, &["summary", "description", "notes", "comment"]);
    let instructions_col = pick_column(&cols, &["instructions", "method", "steps", "directions"])
        .ok_or("missing instructions column")?;

    Ok(RecipeSchema {
        table: table.to_string(),
        id_col,
        title_col,
        summary_col,
        instructions_col,
    })
}

fn pick_column(columns: &[String], candidates: &[&str]) -> Option<String> {
    for candidate in candidates {
        if columns.iter().any(|c| c == candidate) {
            return Some((*candidate).to_string());
        }
    }
    None
}

async fn discover_table(db: &Pool, table_name: &str) -> Result<String, String> {
    let mut client = db.get().await.map_err(|e| e.to_string())?;
    let tx = client
        .build_transaction()
        .read_only(true)
        .start()
        .await
        .map_err(|e| e.to_string())?;
    let row = tx
        .query_opt(
            "SELECT table_name
             FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = $1
             LIMIT 1",
            &[&table_name],
        )
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;
    row.map(|r| r.get::<_, String>("table_name"))
        .ok_or(format!("missing {table_name} table"))
}

async fn fetch_recipe_summaries(
    state: &AppState,
    query: Option<String>,
) -> Result<Vec<RecipeSummary>, String> {
    let mut client = state.db.get().await.map_err(|e| e.to_string())?;
    let tx = client
        .build_transaction()
        .read_only(true)
        .start()
        .await
        .map_err(|e| e.to_string())?;
    let select_summary = state
        .schema
        .summary_col
        .as_ref()
        .map(|c| format!("COALESCE({c}, '')"))
        .unwrap_or_else(|| "''::text".to_string());

    let sql = format!(
        "SELECT {id}::int4 AS id, {title}::text AS title, {summary}::text AS summary
         FROM {table}
         WHERE ($1 = '' OR {title} ILIKE $2 OR {summary} ILIKE $2)
         ORDER BY {title} ASC
         LIMIT 200",
        id = state.schema.id_col,
        title = state.schema.title_col,
        summary = select_summary,
        table = state.schema.table
    );

    let q = query.unwrap_or_default().trim().to_string();
    let pattern = format!("%{q}%");
    let rows = tx
        .query(&sql, &[&q, &pattern])
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    Ok(rows.iter().map(row_to_summary).collect())
}

fn row_to_summary(row: &Row) -> RecipeSummary {
    RecipeSummary {
        id: row.get("id"),
        title: row.get("title"),
    }
}

async fn fetch_recipe_detail(state: &AppState, id: i32) -> Result<Option<RecipeDetail>, String> {
    let mut client = state.db.get().await.map_err(|e| e.to_string())?;
    let tx = client
        .build_transaction()
        .read_only(true)
        .start()
        .await
        .map_err(|e| e.to_string())?;
    let select_summary = state
        .schema
        .summary_col
        .as_ref()
        .map(|c| format!("COALESCE({c}, '')"))
        .unwrap_or_else(|| "''::text".to_string());

    let sql = format!(
        "SELECT {id}::int4 AS id, {title}::text AS title, {summary}::text AS summary, {instructions}::text AS instructions
         FROM {table}
         WHERE {id} = $1
         LIMIT 1",
        id = state.schema.id_col,
        title = state.schema.title_col,
        summary = select_summary,
        instructions = state.schema.instructions_col,
        table = state.schema.table
    );

    let row = tx
        .query_opt(&sql, &[&id])
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;
    if let Some(r) = row {
        let ingredients = fetch_ingredients(state, id).await.unwrap_or_default();
        let keywords = fetch_keywords(state, id).await.unwrap_or_default();
        Ok(Some(RecipeDetail {
            id: r.get("id"),
            title: r.get("title"),
            instructions: r.get("instructions"),
            ingredients,
            keywords,
        }))
    } else {
        Ok(None)
    }
}

async fn fetch_ingredients(state: &AppState, recipe_id: i32) -> Result<Vec<Ingredient>, String> {
    let Some(table) = &state.ingredient_table else {
        return Ok(Vec::new());
    };

    let mut client = state.db.get().await.map_err(|e| e.to_string())?;
    let tx = client
        .build_transaction()
        .read_only(true)
        .start()
        .await
        .map_err(|e| e.to_string())?;

    let sql = format!(
        "SELECT COALESCE(ingname, '')::text AS ingname,
                COALESCE(qty, '')::text AS qty,
                COALESCE(prepared, '')::text AS prepared
         FROM {table}
         WHERE recipe_id = $1
         ORDER BY id ASC",
        table = table
    );

    let rows = tx
        .query(&sql, &[&recipe_id])
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    let ingredients = rows
        .iter()
        .map(|row| Ingredient {
            name: row.get("ingname"),
            qty: row.get("qty"),
            prepared: row.get("prepared"),
        })
        .filter(|item| !item.name.trim().is_empty() || !item.qty.trim().is_empty())
        .collect();

    Ok(ingredients)
}

async fn fetch_keywords(state: &AppState, recipe_id: i32) -> Result<Vec<String>, String> {
    let Some(table) = &state.keyword_table else {
        return Ok(Vec::new());
    };

    let mut client = state.db.get().await.map_err(|e| e.to_string())?;
    let tx = client
        .build_transaction()
        .read_only(true)
        .start()
        .await
        .map_err(|e| e.to_string())?;

    let sql = format!(
        "SELECT COALESCE(keyword, '')::text AS keyword
         FROM {table}
         WHERE recipe_id = $1
         ORDER BY id ASC",
        table = table
    );

    let rows = tx
        .query(&sql, &[&recipe_id])
        .await
        .map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    Ok(rows
        .iter()
        .map(|r| r.get::<_, String>("keyword"))
        .map(|k| k.trim().to_string())
        .filter(|k| !k.is_empty())
        .collect())
}

async fn fetch_recipe_categories(
    state: &AppState,
    recipes: &[RecipeSummary],
) -> Result<HashMap<i32, String>, String> {
    let Some(table) = &state.category_table else {
        return Ok(HashMap::new());
    };
    if recipes.is_empty() {
        return Ok(HashMap::new());
    }

    let ids: HashSet<i32> = recipes.iter().map(|r| r.id).collect();
    let mut categories: HashMap<i32, String> = HashMap::new();

    let mut client = state.db.get().await.map_err(|e| e.to_string())?;
    let tx = client
        .build_transaction()
        .read_only(true)
        .start()
        .await
        .map_err(|e| e.to_string())?;

    let sql = format!(
        "SELECT recipe_id::int4 AS recipe_id, COALESCE(category, 'Entree')::text AS category
         FROM {table}
         ORDER BY id ASC",
        table = table
    );
    let rows = tx.query(&sql, &[]).await.map_err(|e| e.to_string())?;
    tx.commit().await.map_err(|e| e.to_string())?;

    for row in rows {
        let recipe_id: i32 = row.get("recipe_id");
        if !ids.contains(&recipe_id) {
            continue;
        }
        let category: String = row.get("category");
        let category = category.trim().to_string();
        if !category.is_empty() {
            categories.insert(recipe_id, category);
        }
    }

    for recipe in recipes {
        if !categories.contains_key(&recipe.id) {
            categories.insert(recipe.id, "Entree".to_string());
        }
    }
    Ok(categories)
}

fn render_index(
    recipes: &[RecipeSummary],
    mode: NavMode,
    categories: &HashMap<i32, String>,
) -> String {
    let grouped = render_toc(recipes, None, mode, categories);
    let mode_controls = render_mode_controls(mode, "/projects/cookery/");

    format!(
        r#"<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cookery</title>
  <style>
    :root {{
      --cream: #fff9f0;
      --paper: #fffdf8;
      --ink: #3b2f2a;
      --muted: #7c665c;
      --accent: #b4482a;
      --accent-soft: #f8e2d7;
      --border: #ead9cb;
      --radius: 16px;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      color: var(--ink);
      font-family: "Avenir Next", "Inter", system-ui, sans-serif;
      background: radial-gradient(circle at top left, #fff4e7, #fff9f2 55%, #fffdf9);
    }}
    .nav {{
      position: sticky;
      top: 0;
      background: rgba(255, 249, 240, 0.9);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }}
    .nav-inner {{
      max-width: 980px;
      margin: 0 auto;
      padding: 0.9rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }}
    .nav a {{
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }}
    .app {{ max-width: 1120px; margin: 0 auto; padding: 1rem; }}
    .hero {{
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.2rem;
      margin-bottom: 1rem;
      box-shadow: 0 10px 30px rgba(104, 63, 34, 0.06);
    }}
    .hero h1 {{ margin: 0 0 0.35rem; font-size: clamp(1.8rem, 4vw, 2.6rem); }}
    .hero p {{ margin: 0; color: var(--muted); }}
    .search {{ margin: 1rem 0 0.3rem; }}
    .search input {{
      width: 100%;
      padding: 0.85rem 0.95rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--ink);
      font-size: 1rem;
    }}
    .layout {{
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }}
    .toc {{
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 0.75rem;
      max-height: 70vh;
      overflow: auto;
    }}
    .toc h2 {{ margin: 0.25rem 0 0.75rem; font-size: 1rem; color: var(--accent); text-transform: uppercase; }}
    .toc-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.4rem;
    }}
    .toc-header-mobile {{
      justify-content: flex-end;
    }}
    .mode-menu {{ position: relative; }}
    .mode-menu summary {{
      list-style: none;
      cursor: pointer;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.2rem 0.45rem;
      background: #fff;
      color: var(--accent);
      font-weight: 700;
      user-select: none;
    }}
    .mode-menu[open] summary {{ background: var(--accent-soft); }}
    .mode-menu .menu {{
      position: absolute;
      right: 0;
      top: 2rem;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: 0 10px 24px rgba(82, 50, 30, 0.14);
      min-width: 190px;
      overflow: hidden;
      z-index: 2;
    }}
    .mode-menu .menu a {{
      display: block;
      padding: 0.5rem 0.65rem;
      color: var(--ink);
      text-decoration: none;
      font-size: 0.9rem;
    }}
    .mode-menu .menu a:hover {{ background: var(--accent-soft); }}
    .group {{ border-top: 1px solid var(--border); padding-top: 0.35rem; margin-top: 0.35rem; }}
    .group summary {{ cursor: pointer; font-weight: 700; color: var(--muted); }}
    .group ul {{ list-style: none; margin: 0.3rem 0 0; padding: 0; }}
    .group li a {{
      display: block;
      text-decoration: none;
      color: var(--ink);
      padding: 0.35rem 0.4rem;
      border-radius: 8px;
      font-size: 0.95rem;
    }}
    .group li a:hover {{ background: var(--accent-soft); }}
    .empty {{
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1rem;
      color: var(--muted);
    }}
    @media (min-width: 768px) {{
      .app {{ padding: 1.5rem; }}
      .layout {{ grid-template-columns: 320px 1fr; align-items: start; }}
      .toc {{ position: sticky; top: 4.5rem; }}
    }}
  </style>
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a href="/">Ryan Houlberg</a>
      <a href="/projects">Back to projects</a>
    </div>
  </nav>
  <main class="app">
    <section class="hero">
      <h1>Cookery</h1>
      <p>Based on my dad's app, (<a href="http://houlberg.tplinkdns.com:5914/jschtml/CookLogin_form.htm">the original Cookery</a>)</p>
      <form class="search" method="get" action="./">
        <input type="hidden" name="mode" value="{mode_query}" />
        <input name="q" placeholder="Search recipes by title or description" />
      </form>
    </section>
    <section class="layout">
      <aside class="toc">
        <div class="toc-header">
          <h2>Recipes</h2>
          {mode_controls}
        </div>
        {grouped}
      </aside>
      <section class="empty">
        Pick any recipe from the left to view ingredients and instructions.
      </section>
    </section>
  </main>
  <script>
    (function () {{
      const groups = Array.from(document.querySelectorAll('details[data-accordion-group]'));
      groups.forEach((group) => {{
        const summary = group.querySelector('summary');
        if (!summary) return;
        summary.addEventListener('click', (event) => {{
          event.preventDefault();
          const willOpen = !group.open;
          groups.forEach((other) => {{
            other.open = false;
          }});
          if (willOpen) {{
            group.open = true;
          }}
        }});
      }});
    }})();
  </script>
</body>
</html>"#,
        mode_query = mode.as_query(),
        mode_controls = mode_controls,
    )
}

fn render_recipe(
    recipe: &RecipeDetail,
    recipes: &[RecipeSummary],
    mode: NavMode,
    categories: &HashMap<i32, String>,
) -> String {
    let grouped = render_toc(recipes, Some(recipe.id), mode, categories);
    let mode_controls =
        render_mode_controls(mode, &format!("/projects/cookery/recipe/{}", recipe.id));
    let ingredient_items = if recipe.ingredients.is_empty() {
        "<li>No ingredients listed for this recipe yet.</li>".to_string()
    } else {
        recipe
            .ingredients
            .iter()
            .map(|item| {
                let qty = if item.qty.trim().is_empty() {
                    "".to_string()
                } else {
                    format!(
                        r#"<span class="qty">{}</span>"#,
                        escape_html(item.qty.trim())
                    )
                };

                let prep = if item.prepared.trim().is_empty() {
                    "".to_string()
                } else {
                    format!(
                        r#"<span class="prep">{}</span>"#,
                        escape_html(item.prepared.trim())
                    )
                };

                format!(
                    r#"<li>{qty}<span class="name">{name}</span>{prep}</li>"#,
                    qty = qty,
                    name = escape_html(item.name.trim()),
                    prep = prep
                )
            })
            .collect::<Vec<_>>()
            .join("")
    };
    let keyword_badges = if recipe.keywords.is_empty() {
        "<span class=\"keyword muted\">No keywords</span>".to_string()
    } else {
        recipe
            .keywords
            .iter()
            .map(|k| format!(r#"<span class="keyword">{}</span>"#, escape_html(k)))
            .collect::<Vec<_>>()
            .join("")
    };

    format!(
        r#"<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <style>
    :root {{
      --cream: #fff9f0;
      --paper: #fffdf8;
      --ink: #3b2f2a;
      --muted: #7c665c;
      --accent: #b4482a;
      --accent-soft: #f8e2d7;
      --border: #ead9cb;
      --radius: 16px;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      color: var(--ink);
      font-family: "Avenir Next", "Inter", system-ui, sans-serif;
      background: radial-gradient(circle at top left, #fff4e7, #fff9f2 55%, #fffdf9);
    }}
    .nav {{
      position: sticky;
      top: 0;
      background: rgba(255, 249, 240, 0.9);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }}
    .nav-inner {{
      max-width: 980px;
      margin: 0 auto;
      padding: 0.9rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }}
    .nav a {{
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }}
    .app {{ max-width: 1120px; margin: 0 auto; padding: 1rem; }}
    .layout {{
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }}
    .toc-shell {{
      min-width: 0;
    }}
    .toc-mobile {{
      margin: 0;
    }}
    .toc-desktop {{
      display: none;
    }}
    @media (max-width: 767px) {{
      .toc-mobile {{ display: block; }}
      .toc-desktop {{ display: none !important; }}
    }}
    .toc-mobile summary {{
      list-style: none;
      cursor: pointer;
      user-select: none;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.7rem 0.85rem;
      color: var(--accent);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.01em;
      margin-bottom: 0.6rem;
    }}
    .toc-mobile summary::-webkit-details-marker {{ display: none; }}
    .toc-mobile summary::after {{
      content: "▾";
      float: right;
      color: var(--muted);
      font-weight: 700;
    }}
    .toc-mobile:not([open]) summary::after {{ content: "▸"; }}
    .toc {{
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 0.75rem;
      max-height: 78vh;
      overflow: auto;
    }}
    .toc h2 {{ margin: 0.25rem 0 0.75rem; font-size: 1rem; color: var(--accent); text-transform: uppercase; }}
    .toc-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.4rem;
    }}
    .mode-menu {{ position: relative; }}
    .mode-menu summary {{
      list-style: none;
      cursor: pointer;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.2rem 0.45rem;
      background: #fff;
      color: var(--accent);
      font-weight: 700;
      user-select: none;
    }}
    .mode-menu[open] summary {{ background: var(--accent-soft); }}
    .mode-menu .menu {{
      position: absolute;
      right: 0;
      top: 2rem;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: 0 10px 24px rgba(82, 50, 30, 0.14);
      min-width: 190px;
      overflow: hidden;
      z-index: 2;
    }}
    .mode-menu .menu a {{
      display: block;
      padding: 0.5rem 0.65rem;
      color: var(--ink);
      text-decoration: none;
      font-size: 0.9rem;
    }}
    .mode-menu .menu a:hover {{ background: var(--accent-soft); }}
    .group {{ border-top: 1px solid var(--border); padding-top: 0.35rem; margin-top: 0.35rem; }}
    .group summary {{ cursor: pointer; font-weight: 700; color: var(--muted); }}
    .group ul {{ list-style: none; margin: 0.3rem 0 0; padding: 0; }}
    .group li a {{
      display: block;
      text-decoration: none;
      color: var(--ink);
      padding: 0.35rem 0.4rem;
      border-radius: 8px;
      font-size: 0.95rem;
    }}
    .group li a:hover {{ background: var(--accent-soft); }}
    .group li a.active {{ background: var(--accent); color: #fff; }}
    .card {{
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: 0 10px 30px rgba(104, 63, 34, 0.06);
      padding: 1rem;
    }}
    .sections {{
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }}
    .top-row {{
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }}
    .keywords {{
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.75rem;
    }}
    .keyword {{
      display: inline-block;
      margin: 0.2rem 0.25rem 0.2rem 0;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-size: 0.82rem;
      font-weight: 600;
    }}
    .keyword.muted {{ background: #f1ece6; color: var(--muted); }}
    .ingredients h2,
    .method h2 {{
      margin: 0 0 0.6rem;
      font-size: 1.05rem;
      color: var(--accent);
      letter-spacing: 0.01em;
      text-transform: uppercase;
    }}
    .ingredients ul {{
      margin: 0;
      padding-left: 1rem;
      display: grid;
      gap: 0.5rem;
    }}
    .ingredients li {{
      line-height: 1.4;
      color: var(--ink);
    }}
    .qty {{
      display: inline-block;
      margin-right: 0.4rem;
      padding: 0.05rem 0.4rem;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-size: 0.84rem;
      font-weight: 600;
    }}
    .name {{ font-weight: 550; }}
    .prep {{
      margin-left: 0.45rem;
      color: var(--muted);
      font-size: 0.92rem;
      font-style: italic;
    }}
    .instructions {{
      white-space: pre-wrap;
      line-height: 1.7;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
    }}
    .actions {{ margin-bottom: 0.9rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }}
    .btn {{
      display: inline-block;
      text-decoration: none;
      background: var(--accent);
      color: #fff;
      border-radius: 10px;
      padding: 0.55rem 0.85rem;
      font-weight: 600;
    }}
    @media (min-width: 768px) {{
      .app {{ padding: 1.5rem; }}
      .layout {{ grid-template-columns: 320px 1fr; align-items: start; }}
      .toc-shell {{ position: sticky; top: 4.5rem; }}
      .toc-mobile {{ display: none; }}
      .toc-desktop {{ display: block; }}
      .top-row {{ grid-template-columns: 1.4fr 0.7fr; }}
      .sections {{ grid-template-columns: 0.9fr 1.2fr; }}
    }}
  </style>
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a href="/">Ryan Houlberg</a>
      <a href="/projects/cookery/">Back to cookery</a>
    </div>
  </nav>
  <main class="app">
    <section class="layout">
      <aside class="toc-shell">
        <details class="toc-mobile">
          <summary>Recipes</summary>
          <div class="toc">
            <div class="toc-header toc-header-mobile">
              {mode_controls}
            </div>
            {grouped}
          </div>
        </details>
        <div class="toc toc-desktop">
          <div class="toc-header">
            <h2>Recipes</h2>
            {mode_controls}
          </div>
          {grouped}
        </div>
      </aside>
      <section class="card">
        <h1>{title}</h1>
        <div class="actions">
          <a class="btn" href="/projects/cookery/">Recipe list</a>
        </div>
        <section class="top-row">
          <section class="ingredients">
            <h2>Ingredients</h2>
            <ul>{ingredient_items}</ul>
          </section>
          <section class="keywords">
            <h2>Keywords</h2>
            {keyword_badges}
          </section>
        </section>
        <section class="method">
          <h2>Instructions</h2>
          <article class="instructions">{instructions}</article>
        </section>
      </section>
    </section>
  </main>
  <script>
    (function () {{
      const mobileToc = document.querySelector('.toc-mobile');
      const syncTocForViewport = () => {{
        if (!mobileToc) return;
        const summary = mobileToc.querySelector('summary');
        const panel = mobileToc.querySelector('.toc');
        if (window.matchMedia('(min-width: 768px)').matches) {{
          mobileToc.setAttribute('open', 'open');
          if (summary) summary.style.display = 'none';
          if (panel) panel.style.display = 'block';
        }} else {{
          mobileToc.removeAttribute('open');
          if (summary) summary.style.display = '';
          if (panel) panel.style.display = '';
        }}
      }};
      syncTocForViewport();
      window.addEventListener('resize', syncTocForViewport);

      const desktopMode = window.matchMedia('(min-width: 768px)').matches;
      const groupRoot = desktopMode
        ? document.querySelector('.toc-desktop')
        : document.querySelector('.toc-mobile .toc');
      const groups = groupRoot
        ? Array.from(groupRoot.querySelectorAll('details[data-accordion-group]'))
        : [];
      const tocScrollKey = 'cookery.toc.scrollTop';
      const saveTocScroll = () => {{
        if (!groupRoot) return;
        sessionStorage.setItem(tocScrollKey, String(groupRoot.scrollTop));
      }};
      const restoreTocScroll = () => {{
        if (!groupRoot) return;
        const savedTop = Number(sessionStorage.getItem(tocScrollKey));
        if (!Number.isNaN(savedTop) && savedTop >= 0) {{
          groupRoot.scrollTop = savedTop;
        }}
      }};
      if (groupRoot) {{
        restoreTocScroll();
        requestAnimationFrame(restoreTocScroll);
        setTimeout(restoreTocScroll, 50);
        setTimeout(restoreTocScroll, 180);
        groupRoot.addEventListener('scroll', saveTocScroll);
        window.addEventListener('beforeunload', saveTocScroll);
        window.addEventListener('pagehide', saveTocScroll);
        document.addEventListener('visibilitychange', () => {{
          if (document.visibilityState === 'hidden') saveTocScroll();
        }});
        groupRoot.querySelectorAll('a.toc-link').forEach((link) => {{
          // Save before navigation starts to avoid timing races on click.
          link.addEventListener('pointerdown', saveTocScroll);
          link.addEventListener('click', saveTocScroll);
        }});
      }}
      const activeLink = groupRoot ? groupRoot.querySelector('a.active') : null;
      const activeGroup = activeLink ? activeLink.closest('details[data-accordion-group]') : null;
      if (activeGroup) {{
        groups.forEach((group) => {{
          group.open = group === activeGroup;
        }});
        // Opening the active group can shift layout; restore again afterwards.
        restoreTocScroll();
        requestAnimationFrame(restoreTocScroll);
      }}
      groups.forEach((group) => {{
        const summary = group.querySelector('summary');
        if (!summary) return;
        summary.addEventListener('click', (event) => {{
          event.preventDefault();
          const willOpen = !group.open;
          groups.forEach((other) => {{
            if (other !== group) other.open = false;
          }});
          if (willOpen) {{
            group.open = true;
          }}
        }});
      }});
    }})();
  </script>
</body>
</html>"#,
        title = escape_html(&recipe.title),
        mode_controls = mode_controls,
        grouped = grouped,
        ingredient_items = ingredient_items,
        keyword_badges = keyword_badges,
        instructions = escape_html(&recipe.instructions),
    )
}

fn render_mode_controls(mode: NavMode, base_path: &str) -> String {
    let alpha_marker = if mode == NavMode::Alphabetical {
        " ✓"
    } else {
        ""
    };
    let category_marker = if mode == NavMode::Category {
        " ✓"
    } else {
        ""
    };
    format!(
        r#"<details class="mode-menu">
  <summary title="Sort and filter options">⚙</summary>
  <div class="menu">
    <a href="{base}?mode=alpha">Alphabetical{alpha_marker}</a>
    <a href="{base}?mode=category">Category{category_marker}</a>
  </div>
</details>"#,
        base = base_path,
        alpha_marker = alpha_marker,
        category_marker = category_marker
    )
}

fn render_toc(
    recipes: &[RecipeSummary],
    active_id: Option<i32>,
    mode: NavMode,
    categories: &HashMap<i32, String>,
) -> String {
    match mode {
        NavMode::Alphabetical => render_alpha_toc(recipes, active_id, mode),
        NavMode::Category => render_category_toc(recipes, active_id, mode, categories),
    }
}

fn render_alpha_toc(recipes: &[RecipeSummary], active_id: Option<i32>, mode: NavMode) -> String {
    let mut buckets: Vec<(char, Vec<&RecipeSummary>)> =
        ('A'..='Z').map(|c| (c, Vec::new())).collect();
    let mut other: Vec<&RecipeSummary> = Vec::new();

    for recipe in recipes {
        let first = recipe
            .title
            .chars()
            .find(|c| c.is_ascii_alphabetic())
            .map(|c| c.to_ascii_uppercase());
        if let Some(letter) = first {
            if let Some((_, group)) = buckets.iter_mut().find(|(k, _)| *k == letter) {
                group.push(recipe);
            } else {
                other.push(recipe);
            }
        } else {
            other.push(recipe);
        }
    }

    let mut sections = buckets
        .into_iter()
        .filter(|(_, items)| !items.is_empty())
        .map(|(letter, items)| {
            let list = items
                .iter()
                .map(|r| {
                    let active = if active_id == Some(r.id) { "active" } else { "" };
                    format!(
                        r#"<li><a class="toc-link {active}" href="/projects/cookery/recipe/{id}?mode={mode}">{title}</a></li>"#,
                        active = active,
                        id = r.id,
                        mode = mode.as_query(),
                        title = escape_html(&r.title)
                    )
                })
                .collect::<Vec<_>>()
                .join("");
            let open = if items.iter().any(|r| Some(r.id) == active_id) {
                "open"
            } else {
                ""
            };
            format!(
                r#"<details class="group" name="toc-group" data-accordion-group {open}><summary>{letter}</summary><ul>{list}</ul></details>"#,
                open = open,
                letter = letter,
                list = list
            )
        })
        .collect::<Vec<_>>();

    if !other.is_empty() {
        let list = other
            .iter()
            .map(|r| {
                let active = if active_id == Some(r.id) { "active" } else { "" };
                format!(
                    r#"<li><a class="toc-link {active}" href="/projects/cookery/recipe/{id}?mode={mode}">{title}</a></li>"#,
                    active = active,
                    id = r.id,
                    mode = mode.as_query(),
                    title = escape_html(&r.title)
                )
            })
            .collect::<Vec<_>>()
            .join("");
        let open = if other.iter().any(|r| Some(r.id) == active_id) {
            "open"
        } else {
            ""
        };
        sections.push(format!(
            r#"<details class="group" name="toc-group" data-accordion-group {open}><summary>#</summary><ul>{list}</ul></details>"#,
            open = open,
            list = list
        ));
    }

    sections.join("")
}

fn render_category_toc(
    recipes: &[RecipeSummary],
    active_id: Option<i32>,
    mode: NavMode,
    categories: &HashMap<i32, String>,
) -> String {
    let mut buckets: BTreeMap<String, Vec<&RecipeSummary>> = BTreeMap::new();
    for recipe in recipes {
        let category = categories
            .get(&recipe.id)
            .cloned()
            .unwrap_or_else(|| "Entree".to_string());
        buckets.entry(category).or_default().push(recipe);
    }

    buckets
        .into_iter()
        .map(|(category, mut items)| {
            items.sort_by(|a, b| a.title.to_lowercase().cmp(&b.title.to_lowercase()));
            let open = if items.iter().any(|r| Some(r.id) == active_id) {
                "open"
            } else {
                ""
            };
            let list = items
                .iter()
                .map(|r| {
                    let active = if active_id == Some(r.id) { "active" } else { "" };
                    format!(
                        r#"<li><a class="toc-link {active}" href="/projects/cookery/recipe/{id}?mode={mode}">{title}</a></li>"#,
                        active = active,
                        id = r.id,
                        mode = mode.as_query(),
                        title = escape_html(&r.title)
                    )
                })
                .collect::<Vec<_>>()
                .join("");
            format!(
                r#"<details class="group" name="toc-group" data-accordion-group {open}><summary>{category}</summary><ul>{list}</ul></details>"#,
                open = open,
                category = escape_html(&category),
                list = list
            )
        })
        .collect::<Vec<_>>()
        .join("")
}

fn escape_html(value: &str) -> String {
    value
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#39;")
}

fn is_safe_identifier(name: &str) -> bool {
    let mut chars = name.chars();
    match chars.next() {
        Some(c) if c.is_ascii_alphabetic() || c == '_' => {}
        _ => return false,
    }
    chars.all(|c| c.is_ascii_alphanumeric() || c == '_')
}

# Cookery (Rust + Axum)

Containerized cookery app that reads recipes from Postgres and intentionally excludes authentication features.

## Required env vars

- `DATABASE_URL` - PostgreSQL URL
- `COOKERY_RECIPE_TABLE` - Recipe table name (defaults to `recipes`)
- `PORT` - Service port (defaults to `8081`)

## Run locally

```bash
cargo run
```

## Notes

- App only discovers and queries recipe-oriented columns (`id`, `title`, optional `summary`, `instructions`).
- No login or password handling is implemented.
- All recipe reads run inside explicit read-only database transactions.


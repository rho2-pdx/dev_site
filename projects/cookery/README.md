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
- `CookeryData.sql` is the recipe source of truth. Postgres only loads
  `/docker-entrypoint-initdb.d` scripts when the `cookery-db-data` volume is
  empty, so production deploy removes that volume and reseeds from the dump.


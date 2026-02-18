# Portfolio Site

Personal developer portfolio built with Next.js, served behind Nginx as a reverse proxy. Containerized projects (Flask, Java, etc.) run alongside the main site and are proxied through Nginx under `/projects/`.

## Local Development

```bash
npm install
npm run dev
```

Site runs at `http://localhost:3000`.

## Docker Deployment

```bash
docker compose up --build -d
```

Site runs at `http://localhost:80` via Nginx.

## Adding a Project

1. Place the project in `./projects/<name>/` with its own `Dockerfile`
2. Add the service to `docker-compose.yml`
3. Uncomment / add the `location` block in `nginx.conf`
4. Add `<link rel="stylesheet" href="/shared/styles.css">` to the project's HTML for shared styling

## Architecture

```
Nginx (port 80)
├── /shared/*              → shared-assets/ (CSS design tokens)
├── /projects/flask-app/*  → Flask container (5000)
├── /projects/java-app/*   → Java container (8080)
└── /*                     → Next.js container (3000)
```

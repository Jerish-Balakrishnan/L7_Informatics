# Frontend - Movie Explorer Platform

React + Vite frontend for browsing movies, filtering from backend APIs, and viewing movie/person detail pages.

## Tech Stack

- React (TypeScript)
- Vite
- React Router
- Tailwind CSS
- Lucide icons
- Vitest + React Testing Library

## Pages

- `/` Movies page (filters + paginated listing)
- `/watch-later` Watch Later page (localStorage-based)
- `/movies/:id` Movie detail page
- `/actors/:id` Actor profile page
- `/directors/:id` Director profile page

## Setup

```bash
cd frontend
npm install
```

## Run

```bash
npm run dev
```

By default, frontend uses `http://localhost:8000` for backend API.

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

`npm run build` runs lint + tests + type-check + Vite build.

## Docker

```bash
cd frontend
docker build -t movie-explorer-frontend .
docker run --rm -p 5173:5173 -e VITE_API_BASE_URL=http://localhost:8000 movie-explorer-frontend
```

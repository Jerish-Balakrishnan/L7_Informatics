# Backend - Movie Explorer Platform

Flask backend for movies, actors, directors, genres, and movie reviews.

## Tech Stack

- Flask
- Flask-SQLAlchemy
- flask-smorest (OpenAPI + Swagger UI)
- Marshmallow
- SQLite (default local DB)

## Setup

```bash
cd backend
make install
```

## Run

```bash
make run
```

API base: `http://localhost:8000`  
Swagger UI: `http://localhost:8000/swagger-ui`

## Seed sample data

```bash
make seed
```

## Quality checks

```bash
make lint
make test
make build
```

`make build` runs lint + unit tests.

## Docker

```bash
cd backend
docker build -t movie-explorer-backend .
docker run --rm -p 8000:8000 movie-explorer-backend
```

To run backend with seeded demo data in Docker, use root compose:

```bash
cd ..
docker compose up --build
```

## Implemented API resources

- `GET /movies`
  - Filters: `genre_id`, `director_id`, `release_year`, `actor_id`, `search`
  - Pagination: `page` (default `1`), `page_size` (default `12`, max `50`)
- `GET /movies/{movie_id}`
- `GET /actors`
  - Filters: `movie_id`, `genre_id`, `search`
- `GET /actors/{actor_id}` (includes movies)
- `GET /directors`
- `GET /directors/{director_id}` (includes movies)
- `GET /genres`
- `GET /genres/{genre_id}`
- `GET /movies/{movie_id}/reviews`
- `POST /movies/{movie_id}/reviews`

## Edge case behavior

- Invalid filter types return `422`.
- Missing entities return `404`.
- Empty result sets return `200` with empty paginated payload.

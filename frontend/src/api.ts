import type {
  Actor,
  Director,
  Genre,
  Movie,
  PaginatedMovies,
  Review,
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function fetchMovies(
  query: URLSearchParams,
): Promise<PaginatedMovies | Movie[]> {
  const queryString = query.toString()
  return getJson<PaginatedMovies | Movie[]>(
    `/movies${queryString ? `?${queryString}` : ''}`,
  )
}

export function fetchMovie(movieId: string): Promise<Movie> {
  return getJson<Movie>(`/movies/${movieId}`)
}

export function fetchMovieReviews(movieId: string): Promise<Review[]> {
  return getJson<Review[]>(`/movies/${movieId}/reviews`)
}

export function fetchActors(query: URLSearchParams): Promise<Actor[]> {
  const queryString = query.toString()
  return getJson<Actor[]>(`/actors${queryString ? `?${queryString}` : ''}`)
}

export function fetchActor(actorId: string): Promise<Actor> {
  return getJson<Actor>(`/actors/${actorId}`)
}

export function fetchDirectors(): Promise<Director[]> {
  return getJson<Director[]>('/directors')
}

export function fetchDirector(directorId: string): Promise<Director> {
  return getJson<Director>(`/directors/${directorId}`)
}

export function fetchGenres(): Promise<Genre[]> {
  return getJson<Genre[]>('/genres')
}

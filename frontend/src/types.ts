export type Genre = {
  id: number
  name: string
  description?: string | null
}

export type Actor = {
  id: number
  name: string
  bio?: string | null
  birth_date?: string | null
  movies?: MovieBrief[]
}

export type Director = {
  id: number
  name: string
  bio?: string | null
  birth_date?: string | null
  movies?: MovieBrief[]
}

export type MovieBrief = {
  id: number
  title: string
  release_year: number
}

export type Movie = {
  id: number
  title: string
  release_year: number
  duration_minutes?: number | null
  synopsis?: string | null
  poster_url?: string | null
  director: Director
  actors: Actor[]
  genres: Genre[]
  average_rating?: number
}

export type Review = {
  id: number
  movie_id: number
  reviewer_name?: string | null
  rating: number
  comment?: string | null
  created_at: string
}

export type PaginatedMovies = {
  items: Movie[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

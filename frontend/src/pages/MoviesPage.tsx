import { useEffect, useMemo, useState } from 'react'
import { Film } from 'lucide-react'

import { fetchActors, fetchDirectors, fetchGenres, fetchMovies } from '../api'
import MovieCard from '../components/MovieCard'
import MovieFilters from '../components/MovieFilters'
import SideMenu from '../components/SideMenu'
import type { Actor, Director, Genre, Movie } from '../types'

export default function MoviesPage() {
  const [pageSize, setPageSize] = useState(12)
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [genres, setGenres] = useState<Genre[]>([])
  const [directors, setDirectors] = useState<Director[]>([])
  const [actors, setActors] = useState<Actor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    genre_id: '',
    director_id: '',
    actor_id: '',
    release_year: '',
    search: '',
  })

  useEffect(() => {
    Promise.all([
      fetchGenres(),
      fetchDirectors(),
      fetchActors(new URLSearchParams()),
    ])
      .then(([genresData, directorsData, actorsData]) => {
        setGenres(genresData)
        setDirectors(directorsData)
        setActors(actorsData)
      })
      .catch(() => setError('Failed to load filter options.'))
  }, [])

  const query = useMemo(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    params.set('page', String(page))
    params.set('page_size', String(pageSize))
    return params
  }, [filters, page, pageSize])

  useEffect(() => {
    fetchMovies(query)
      .then((data) => {
        setError('')
        if (Array.isArray(data)) {
          // Backward compatibility: paginate locally if backend returns plain list.
          const calculatedTotalPages = Math.max(
            1,
            Math.ceil(data.length / pageSize),
          )
          const start = (page - 1) * pageSize
          setMovies(data.slice(start, start + pageSize))
          setTotalPages(calculatedTotalPages)
          return
        }
        setMovies(data.items)
        setTotalPages(data.total_pages)
      })
      .catch(() => setError('Failed to load movies. Check backend connection.'))
      .finally(() => setLoading(false))
  }, [page, pageSize, query])

  return (
    <div className="min-h-screen bg-slate-50">
      <SideMenu />

      <main className="w-full px-4 py-6 lg:pl-64 lg:pr-6">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Movies</h1>
          <p className="text-sm text-slate-500">
            Browse, filter, and save movies to watch later.
          </p>
        </header>

        <section id="filters">
          <MovieFilters
            genres={genres}
            directors={directors}
            actors={actors}
            filters={filters}
            onChange={(name, value) => {
              setPage(1)
              setFilters((previous) => ({ ...previous, [name]: value }))
            }}
          />
        </section>

        <section id="movies-list">
            {loading && <p className="text-sm text-slate-500">Loading movies...</p>}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {!loading && !error && movies.length === 0 && (
              <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
                <div className="flex items-center gap-2">
                  <Film size={14} />
                  No movies available for this filter.
                </div>
              </div>
            )}

            <div className="mt-1 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {movies.map((movie) => (
                <div key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <label className="text-sm text-slate-600" htmlFor="page-size">
                  Movies per page
                </label>
                <select
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700"
                  id="page-size"
                  onChange={(event) => {
                    setPage(1)
                    setPageSize(Number(event.target.value))
                  }}
                  value={pageSize}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={36}>36</option>
                </select>
                <button
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((previous) => previous - 1)}
                  type="button"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((previous) => previous + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            )}
        </section>
      </main>
    </div>
  )
}

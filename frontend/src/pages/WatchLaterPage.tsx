import { useEffect, useState } from 'react'
import { BookmarkCheck } from 'lucide-react'

import { fetchMovie } from '../api'
import MovieCard from '../components/MovieCard'
import SideMenu from '../components/SideMenu'
import type { Movie } from '../types'
import {
  WATCH_LATER_UPDATED_EVENT,
  getWatchLaterIds,
} from '../watchLater'

export default function WatchLaterPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWatchLater = async () => {
      setLoading(true)
      const ids = getWatchLaterIds()
      const fetched = await Promise.all(
        ids.map(async (movieId) => {
          try {
            return await fetchMovie(String(movieId))
          } catch {
            return null
          }
        }),
      )
      setMovies(fetched.filter((movie): movie is Movie => movie !== null))
      setLoading(false)
    }

    void loadWatchLater()
    window.addEventListener(WATCH_LATER_UPDATED_EVENT, loadWatchLater)
    window.addEventListener('storage', loadWatchLater)
    return () => {
      window.removeEventListener(WATCH_LATER_UPDATED_EVENT, loadWatchLater)
      window.removeEventListener('storage', loadWatchLater)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <SideMenu />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:pl-64">
        <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900">
          <BookmarkCheck size={22} className="text-indigo-600" />
          Watch Later
        </h1>

        {loading && <p className="text-sm text-slate-500">Loading saved movies...</p>}
        {!loading && movies.length === 0 && (
          <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
            No movies saved yet. Add from Movies page.
          </div>
        )}

        <div className="mt-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

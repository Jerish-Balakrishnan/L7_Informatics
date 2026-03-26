import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, CalendarDays, Camera, Eye, Film, Star, Tags } from 'lucide-react'

import type { Movie } from '../types'
import { isInWatchLater, toggleWatchLater } from '../watchLater'

type Props = {
  movie: Movie
}

export default function MovieCard({ movie }: Props) {
  const [saved, setSaved] = useState<boolean>(() => isInWatchLater(movie.id))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <img
        alt={`${movie.title} poster`}
        className="mb-3 h-56 w-full rounded-lg object-cover"
        onError={(event) => {
          event.currentTarget.src = 'https://placehold.co/400x600?text=No+Image'
        }}
        src={
          movie.poster_url ??
          `https://picsum.photos/seed/movie-${movie.id}/400/600`
        }
      />
      <div>
        <h5 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Film size={18} className="text-indigo-600" />
          {movie.title}
        </h5>
        <p className="mb-1 text-sm text-slate-700">
          <CalendarDays size={14} className="mr-2 inline text-slate-500" />
          <strong>Year:</strong> {movie.release_year}
        </p>
        <p className="mb-1 text-sm text-slate-700">
          <Camera size={14} className="mr-2 inline text-slate-500" />
          <strong>Director:</strong>{' '}
          <Link className="text-indigo-600 hover:underline" to={`/directors/${movie.director.id}`}>
            {movie.director.name}
          </Link>
        </p>
        <p className="mb-2 text-sm text-slate-700">
          <Tags size={14} className="mr-2 inline text-slate-500" />
          <strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}
        </p>
        <p className="mb-0 text-sm text-slate-700">
          <Star size={14} className="mr-2 inline text-amber-500" />
          <strong>Average rating:</strong> {movie.average_rating ?? 0}
        </p>
      </div>
      <div className="pt-3">
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            to={`/movies/${movie.id}`}
          >
            <Eye size={14} />
            View details
          </Link>
          <button
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setSaved(toggleWatchLater(movie.id))}
            type="button"
          >
            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {saved ? 'Saved' : 'Watch later'}
          </button>
        </div>
      </div>
    </div>
  )
}

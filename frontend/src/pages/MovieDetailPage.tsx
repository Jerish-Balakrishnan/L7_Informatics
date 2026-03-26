import { useEffect, useState } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Camera,
  FileText,
  Film,
  MessageSquareText,
  Star,
  Tags,
  Users,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { fetchMovie, fetchMovieReviews } from '../api'
import type { Movie, Review } from '../types'
import { isInWatchLater, toggleWatchLater } from '../watchLater'

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }
    Promise.all([fetchMovie(id), fetchMovieReviews(id)])
      .then(([movieData, reviewData]) => {
        setMovie(movieData)
        setReviews(reviewData)
        setSaved(isInWatchLater(movieData.id))
      })
      .catch(() => setError('Movie not found or backend is unavailable.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="mx-auto w-full max-w-4xl px-4 py-6">Loading movie details...</div>
  }

  if (error || !movie) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error || 'Movie not found.'}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <button
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        onClick={() => navigate(-1)}
        type="button"
      >
        Go Back
      </button>
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900">
        <Film size={22} className="text-indigo-600" />
        {movie.title}
      </h1>
      <button
        className="mb-4 inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        onClick={() => setSaved(toggleWatchLater(movie.id))}
        type="button"
      >
        {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        {saved ? 'Saved to Watch Later' : 'Add to Watch Later'}
      </button>
      <img
        alt={`${movie.title} poster`}
        className="mb-4 h-80 w-full max-w-sm rounded-lg object-cover"
        onError={(event) => {
          event.currentTarget.src = 'https://placehold.co/400x600?text=No+Image'
        }}
        src={movie.poster_url ?? `https://picsum.photos/seed/movie-${movie.id}/400/600`}
      />
      <p className="mb-2 text-slate-700">
        <CalendarDays size={14} className="mr-2 inline text-slate-500" />
        <strong>Release year:</strong> {movie.release_year}
      </p>
      <p className="mb-2 text-slate-700">
        <Camera size={14} className="mr-2 inline text-slate-500" />
        <strong>Director:</strong>{' '}
        <Link className="text-indigo-600 hover:underline" to={`/directors/${movie.director.id}`}>
          {movie.director.name}
        </Link>
      </p>
      <p className="mb-2 text-slate-700">
        <Tags size={14} className="mr-2 inline text-slate-500" />
        <strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}
      </p>
      <p className="mb-2 text-slate-700">
        <Users size={14} className="mr-2 inline text-slate-500" />
        <strong>Cast:</strong>{' '}
        {movie.actors.map((actor, index) => (
          <span key={actor.id}>
            <Link className="text-indigo-600 hover:underline" to={`/actors/${actor.id}`}>
              {actor.name}
            </Link>
            {index < movie.actors.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
      {movie.synopsis && (
        <p className="mb-2 text-slate-700">
          <FileText size={14} className="mr-2 inline text-slate-500" />
          <strong>Synopsis:</strong> {movie.synopsis}
        </p>
      )}

      <h2 className="mt-6 mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <MessageSquareText size={18} className="text-indigo-600" />
        Reviews
      </h2>
      {reviews.length === 0 ? (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
          No reviews available.
        </div>
      ) : (
        <ul className="space-y-2">
          {reviews.map((review) => (
            <li className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" key={review.id}>
              <Star size={14} className="mr-2 inline text-amber-500" />
              <strong>{review.reviewer_name || 'Anonymous'}</strong> rated{' '}
              <strong>{review.rating}/10</strong>
              {review.comment ? <div className="mt-1 text-slate-700">{review.comment}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Film, PersonStanding } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { fetchActor } from '../api'
import type { Actor } from '../types'

export default function ActorPage() {
  const { id } = useParams()
  const [actor, setActor] = useState<Actor | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }
    fetchActor(id)
      .then((data) => setActor(data))
      .catch(() => setError('Actor not found.'))
  }, [id])

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!actor) {
    return <div className="mx-auto w-full max-w-4xl px-4 py-6">Loading actor...</div>
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
        <PersonStanding size={22} className="text-indigo-600" />
        {actor.name}
      </h1>
      {actor.bio && <p className="mb-4 text-slate-700">{actor.bio}</p>}
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Film size={18} className="text-indigo-600" />
        Movies
      </h2>
      {!actor.movies || actor.movies.length === 0 ? (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
          No movies found for this actor.
        </div>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          {actor.movies.map((movie) => (
            <li key={movie.id}>
              <Link className="text-indigo-600 hover:underline" to={`/movies/${movie.id}`}>
                {movie.title} ({movie.release_year})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

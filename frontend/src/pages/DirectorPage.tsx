import { useEffect, useState } from 'react'
import { Camera, Film } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { fetchDirector } from '../api'
import type { Director } from '../types'

export default function DirectorPage() {
  const { id } = useParams()
  const [director, setDirector] = useState<Director | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      return
    }
    fetchDirector(id)
      .then((data) => setDirector(data))
      .catch(() => setError('Director not found.'))
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

  if (!director) {
    return <div className="mx-auto w-full max-w-4xl px-4 py-6">Loading director...</div>
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
        <Camera size={22} className="text-indigo-600" />
        {director.name}
      </h1>
      {director.bio && <p className="mb-4 text-slate-700">{director.bio}</p>}
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Film size={18} className="text-indigo-600" />
        Movies
      </h2>
      {!director.movies || director.movies.length === 0 ? (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
          No movies found for this director.
        </div>
      ) : (
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          {director.movies.map((movie) => (
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

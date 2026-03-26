import type { Actor, Director, Genre } from '../types'
import { CalendarDays, Camera, Search, Tags, Users } from 'lucide-react'

type Props = {
  genres: Genre[]
  directors: Director[]
  actors: Actor[]
  filters: {
    genre_id: string
    director_id: string
    actor_id: string
    release_year: string
    search: string
  }
  onChange: (name: string, value: string) => void
}

export default function MovieFilters({
  genres,
  directors,
  actors,
  filters,
  onChange,
}: Props) {
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Tags size={16} className="text-indigo-600" />
        <h2 className="text-sm font-semibold">Filter movies</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs text-slate-500">
            <Search size={14} />
            Search
          </label>
          <div className="flex items-center rounded-lg border border-slate-200 px-2">
            <input
              className="w-full rounded-lg border-0 px-2 py-2 text-sm outline-none"
              placeholder="Search by title"
              value={filters.search}
              onChange={(e) => onChange('search', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs text-slate-500">
            <CalendarDays size={14} />
            Release year
          </label>
          <div className="flex items-center rounded-lg border border-slate-200 px-2">
            <input
              className="w-full rounded-lg border-0 px-2 py-2 text-sm outline-none"
              placeholder="e.g. 2021"
              value={filters.release_year}
              onChange={(e) => onChange('release_year', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs text-slate-500">
            <Tags size={14} />
            Genre
          </label>
          <div className="rounded-lg border border-slate-200 px-2">
            <select
              className="w-full bg-white py-2 text-sm outline-none"
              value={filters.genre_id}
              onChange={(e) => onChange('genre_id', e.target.value)}
            >
              <option value="">All genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs text-slate-500">
            <Camera size={14} />
            Director
          </label>
          <div className="rounded-lg border border-slate-200 px-2">
            <select
              className="w-full bg-white py-2 text-sm outline-none"
              value={filters.director_id}
              onChange={(e) => onChange('director_id', e.target.value)}
            >
              <option value="">All directors</option>
              {directors.map((director) => (
                <option key={director.id} value={director.id}>
                  {director.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs text-slate-500">
            <Users size={14} />
            Actor
          </label>
          <div className="rounded-lg border border-slate-200 px-2">
            <select
              className="w-full bg-white py-2 text-sm outline-none"
              value={filters.actor_id}
              onChange={(e) => onChange('actor_id', e.target.value)}
            >
              <option value="">All actors</option>
              {actors.map((actor) => (
                <option key={actor.id} value={actor.id}>
                  {actor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

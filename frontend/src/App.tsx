import { Navigate, Route, Routes } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'

import ActorPage from './pages/ActorPage'
import DirectorPage from './pages/DirectorPage'
import MovieDetailPage from './pages/MovieDetailPage'
import MoviesPage from './pages/MoviesPage'
import WatchLaterPage from './pages/WatchLaterPage'

export default function App() {
  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-slate-900 text-white">
        <div className="flex w-full items-center px-4 py-3">
          <span className="mb-0 flex items-center gap-2 text-lg font-semibold">
            <Clapperboard size={18} />
            Movie Explorer
          </span>
        </div>
      </nav>
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<MoviesPage />} />
          <Route path="/watch-later" element={<WatchLaterPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/actors/:id" element={<ActorPage />} />
          <Route path="/directors/:id" element={<DirectorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

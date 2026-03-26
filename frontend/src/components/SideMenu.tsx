import { BookmarkCheck, Clapperboard, Film } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function SideMenu() {
  const baseClass =
    'flex items-center gap-2 rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50'
  const activeClass = 'bg-indigo-50 font-medium text-indigo-700'

  return (
    <aside className="fixed top-16 bottom-0 left-0 hidden w-60 overflow-y-auto border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4">
        <Clapperboard size={18} className="text-indigo-600" />
        <span className="text-sm font-semibold text-slate-900">Movie Explorer</span>
      </div>
      <nav className="space-y-1 p-3 text-sm">
        <NavLink
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : ''}`.trim()
          }
          to="/"
        >
          <Film size={15} />
          Movies
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : ''}`.trim()
          }
          to="/watch-later"
        >
          <BookmarkCheck size={15} />
          Watch Later
        </NavLink>
      </nav>
    </aside>
  )
}

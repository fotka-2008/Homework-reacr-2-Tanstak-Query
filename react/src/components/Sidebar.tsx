import { Link, NavLink } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'

function getLinkClassName({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return 'flex items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white shadow-md shadow-indigo-200'
  }
  return 'flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-100'
}

export default function Sidebar() {
  const { data: categories = [], isLoading, isError } = useCategories()
  const firstCategories = categories.slice(0, 6)

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-5 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
          ✓
        </div>
        <span className="text-xl font-bold text-slate-800">To-Do App</span>
      </div>

      <nav className="flex gap-2 md:flex-col">
        <NavLink to="/" end className={getLinkClassName}>
          <span>📋</span>
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/categories" className={getLinkClassName}>
          <span>🏷️</span>
          <span>Categories</span>
        </NavLink>
      </nav>

      <div className="mt-8 hidden md:block">
        <div className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{categories.length}</span>
        </div>

        {isLoading && <p className="px-1 text-sm text-slate-400">Loading...</p>}
        {isError && <p className="px-1 text-sm text-red-500">Failed to load</p>}

        <ul className="space-y-1">
          {firstCategories.map((category) => (
            <li key={category.id} className="flex items-center gap-2 truncate rounded-lg px-2 py-1.5 text-sm text-slate-600">
              <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
              <span className="truncate">{category.name || 'No name'}</span>
            </li>
          ))}
        </ul>

        {categories.length > firstCategories.length && (
          <Link to="/categories" className="mt-2 block px-2 text-sm font-medium text-indigo-600 hover:underline">
            View all
          </Link>
        )}
      </div>
    </aside>
  )
}

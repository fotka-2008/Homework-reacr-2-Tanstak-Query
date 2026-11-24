import { useState } from 'react'
import Header from '../components/Header'
import Search from '../components/Search'
import TodoList from '../components/TodoList'
import TodoModal from '../components/TodoModal'
import TodoInfoModal from '../components/TodoInfoModal'
import { useTodos } from '../hooks/useTodos'
import { getErrorMessage } from '../services/api'
import type { Todo } from '../types/todo.types'

type StatusFilter = 'all' | 'completed' | 'notCompleted'

export default function Home() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [infoTodoId, setInfoTodoId] = useState<number | null>(null)

  const { data: todos = [], isLoading, isError, error, refetch, isFetching } = useTodos(search.trim())

  const completedCount = todos.filter((todo) => todo.isCompleted).length
  const notCompletedCount = todos.length - completedCount

  const filteredTodos = todos.filter((todo) => {
    if (statusFilter === 'completed') {
      return todo.isCompleted
    }
    if (statusFilter === 'notCompleted') {
      return !todo.isCompleted
    }
    return true
  })

  const filterButtons: { value: StatusFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: todos.length },
    { value: 'completed', label: 'Completed', count: completedCount },
    { value: 'notCompleted', label: 'Not Completed', count: notCompletedCount },
  ]

  return (
    <div>
      <Header title="To-Do" subtitle="Manage your tasks easily">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
        >
          + Add Task
        </button>
      </Header>

      <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-400">Total</p>
          <p className="text-2xl font-bold text-slate-800">{todos.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-400">Not Completed</p>
          <p className="text-2xl font-bold text-amber-600">{notCompletedCount}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <Search value={search} onChange={setSearch} placeholder="Search tasks..." />
        <div className="flex shrink-0 gap-2 overflow-x-auto">
          {filterButtons.map((filterButton) => (
            <button
              key={filterButton.value}
              onClick={() => setStatusFilter(filterButton.value)}
              className={
                statusFilter === filterButton.value
                  ? 'whitespace-nowrap rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white'
                  : 'whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100'
              }
            >
              {filterButton.label} ({filterButton.count})
            </button>
          ))}
        </div>
      </div>

      {isFetching && !isLoading && <p className="mb-3 text-sm text-slate-400">Updating...</p>}

      {isLoading && (
        <div className="py-16 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="mt-4 text-slate-500">Loading tasks...</p>
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">Failed to load tasks</p>
          <p className="mt-1 text-sm text-red-600">{getErrorMessage(error)}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <TodoList todos={filteredTodos} onEdit={setEditingTodo} onInfo={setInfoTodoId} />
      )}

      {isAddModalOpen && <TodoModal todo={null} onClose={() => setIsAddModalOpen(false)} />}

      {editingTodo && <TodoModal todo={editingTodo} onClose={() => setEditingTodo(null)} />}

      {infoTodoId !== null && <TodoInfoModal todoId={infoTodoId} onClose={() => setInfoTodoId(null)} />}
    </div>
  )
}

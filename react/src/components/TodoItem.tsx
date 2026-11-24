import { useDeleteTodo, useToggleCompleted } from '../hooks/useTodos'
import { getErrorMessage, getImageUrl } from '../services/api'
import type { Todo } from '../types/todo.types'

interface TodoItemProps {
  todo: Todo
  onEdit: (todo: Todo) => void
  onInfo: (todoId: number) => void
}

export default function TodoItem({ todo, onEdit, onInfo }: TodoItemProps) {
  const deleteTodoMutation = useDeleteTodo()
  const toggleCompletedMutation = useToggleCompleted()

  const firstImage = todo.images.length > 0 ? todo.images[0] : null

  function handleDelete() {
    const isConfirmed = window.confirm(`Delete task "${todo.name}"?`)
    if (!isConfirmed) {
      return
    }
    deleteTodoMutation.mutate(todo.id, {
      onError: (error) => alert(getErrorMessage(error)),
    })
  }

  function handleToggleCompleted() {
    toggleCompletedMutation.mutate(todo.id, {
      onError: (error) => alert(getErrorMessage(error)),
    })
  }

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <button
          onClick={handleToggleCompleted}
          disabled={toggleCompletedMutation.isPending}
          title="Change status"
          className={
            todo.isCompleted
              ? 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm text-white transition hover:bg-emerald-600 disabled:opacity-50'
              : 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 transition hover:border-emerald-500 disabled:opacity-50'
          }
        >
          {todo.isCompleted && '✓'}
        </button>

        {firstImage && (
          <img
            src={getImageUrl(firstImage.imageName)}
            alt={todo.name}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={
                todo.isCompleted
                  ? 'truncate font-semibold text-slate-400 line-through'
                  : 'truncate font-semibold text-slate-800'
              }
            >
              {todo.name}
            </h3>
            {todo.isCompleted ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Completed
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Not Completed
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 break-words text-sm text-slate-500">{todo.description}</p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onInfo(todo.id)}
          className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
        >
          Info
        </button>
        <button
          onClick={() => onEdit(todo)}
          className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteTodoMutation.isPending}
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
        >
          {deleteTodoMutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  )
}

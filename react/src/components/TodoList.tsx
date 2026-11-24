import TodoItem from './TodoItem'
import type { Todo } from '../types/todo.types'

interface TodoListProps {
  todos: Todo[]
  onEdit: (todo: Todo) => void
  onInfo: (todoId: number) => void
}

export default function TodoList({ todos, onEdit, onInfo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-4xl">📭</p>
        <p className="mt-3 font-medium text-slate-600">No tasks found</p>
        <p className="mt-1 text-sm text-slate-400">Add a new task or change the search</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEdit} onInfo={onInfo} />
      ))}
    </ul>
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addTodo,
  addTodoImages,
  deleteTodo,
  deleteTodoImage,
  getTodoById,
  getTodos,
  toggleTodoCompleted,
  updateTodo,
} from '../services/todoApi'

export function useTodos(search: string) {
  return useQuery({
    queryKey: ['todos', search],
    queryFn: () => getTodos(search),
    placeholderData: (previousData) => previousData,
  })
}

export function useTodo(todoId: number) {
  return useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => getTodoById(todoId),
  })
}

function useRefreshTodos() {
  const queryClient = useQueryClient()

  return function refreshTodos() {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    queryClient.invalidateQueries({ queryKey: ['todo'] })
  }
}

export function useAddTodo() {
  const refreshTodos = useRefreshTodos()
  return useMutation({
    mutationFn: addTodo,
    onSuccess: refreshTodos,
  })
}

export function useUpdateTodo() {
  const refreshTodos = useRefreshTodos()
  return useMutation({
    mutationFn: updateTodo,
    onSuccess: refreshTodos,
  })
}

export function useDeleteTodo() {
  const refreshTodos = useRefreshTodos()
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: refreshTodos,
  })
}

export function useToggleCompleted() {
  const refreshTodos = useRefreshTodos()
  return useMutation({
    mutationFn: toggleTodoCompleted,
    onSuccess: refreshTodos,
  })
}

export function useAddTodoImages() {
  const refreshTodos = useRefreshTodos()
  return useMutation({
    mutationFn: addTodoImages,
    onSuccess: refreshTodos,
  })
}

export function useDeleteTodoImage() {
  const refreshTodos = useRefreshTodos()
  return useMutation({
    mutationFn: deleteTodoImage,
    onSuccess: refreshTodos,
  })
}

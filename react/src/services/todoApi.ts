import api from './api'
import type { ApiResponse } from './api'
import type { AddTodoData, AddTodoImagesData, Todo, UpdateTodoDto } from '../types/todo.types'

export async function getTodos(search: string) {
  const response = await api.get<ApiResponse<Todo[]>>('/api/to-dos', {
    params: { query: search || undefined },
  })
  return response.data.data
}

export async function getTodoById(todoId: number) {
  const response = await api.get<ApiResponse<Todo | null>>(`/api/to-dos/${todoId}`)
  return response.data.data
}

export async function addTodo(newTodo: AddTodoData) {
  const formData = new FormData()
  formData.append('Name', newTodo.name)
  formData.append('Description', newTodo.description)
  newTodo.images.forEach((image) => {
    formData.append('Images', image)
  })

  const response = await api.post<ApiResponse<number>>('/api/to-dos', formData)
  return response.data.data
}

export async function updateTodo(todo: UpdateTodoDto) {
  const response = await api.put<ApiResponse<number>>('/api/to-dos', todo)
  return response.data.data
}

export async function deleteTodo(todoId: number) {
  const response = await api.delete<ApiResponse<boolean>>('/api/to-dos', {
    params: { id: todoId },
  })
  return response.data.data
}

export async function toggleTodoCompleted(todoId: number) {
  const response = await api.put<ApiResponse<boolean>>('/completed', null, {
    params: { id: todoId },
  })
  return response.data.data
}

export async function addTodoImages(data: AddTodoImagesData) {
  const formData = new FormData()
  data.images.forEach((image) => {
    formData.append('Images', image)
  })

  const response = await api.post<ApiResponse<string>>(`/api/to-dos/${data.todoId}/images`, formData)
  return response.data.data
}

export async function deleteTodoImage(imageId: number) {
  const response = await api.delete<ApiResponse<string>>(`/api/to-dos/images/${imageId}`)
  return response.data.data
}

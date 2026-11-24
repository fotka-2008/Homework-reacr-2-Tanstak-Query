export interface TodoImage {
  id: number
  imageName: string
}

export interface Todo {
  id: number
  name: string
  description: string
  isCompleted: boolean
  images: TodoImage[]
}

export interface AddTodoData {
  name: string
  description: string
  images: File[]
}

export interface UpdateTodoDto {
  id: number
  name: string
  description: string
}

export interface AddTodoImagesData {
  todoId: number
  images: File[]
}

import api from './api'
import type { ApiResponse } from './api'
import type { AddCategoryDto, Category, UpdateCategoryDto } from '../types/category.types'

export async function getCategories() {
  const response = await api.get<ApiResponse<Category[]>>('/api/categories')
  return response.data.data
}

export async function getCategoryById(categoryId: number) {
  const response = await api.get<ApiResponse<Category | null>>(`/api/categories/${categoryId}`)
  return response.data.data
}

export async function addCategory(newCategory: AddCategoryDto) {
  const response = await api.post<ApiResponse<number>>('/api/categories', newCategory)
  return response.data.data
}

export async function updateCategory(category: UpdateCategoryDto) {
  const response = await api.put<ApiResponse<number>>('/api/categories', category)
  return response.data.data
}

export async function deleteCategory(categoryId: number) {
  const response = await api.delete<ApiResponse<boolean>>('/api/categories', {
    params: { id: categoryId },
  })
  return response.data.data
}

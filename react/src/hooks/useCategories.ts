import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '../services/categoryApi'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
}

export function useCategory(categoryId: number) {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategoryById(categoryId),
  })
}

function useRefreshCategories() {
  const queryClient = useQueryClient()

  return function refreshCategories() {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    queryClient.invalidateQueries({ queryKey: ['category'] })
  }
}

export function useAddCategory() {
  const refreshCategories = useRefreshCategories()
  return useMutation({
    mutationFn: addCategory,
    onSuccess: refreshCategories,
  })
}

export function useUpdateCategory() {
  const refreshCategories = useRefreshCategories()
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: refreshCategories,
  })
}

export function useDeleteCategory() {
  const refreshCategories = useRefreshCategories()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: refreshCategories,
  })
}

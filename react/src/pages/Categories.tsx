import { useState } from 'react'
import type { FormEvent } from 'react'
import Header from '../components/Header'
import Search from '../components/Search'
import Modal from '../components/Modal'
import {
  useAddCategory,
  useCategories,
  useCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks/useCategories'
import { getErrorMessage } from '../services/api'
import type { Category } from '../types/category.types'

interface CategoryInfoModalProps {
  categoryId: number
  onClose: () => void
}

function CategoryInfoModal({ categoryId, onClose }: CategoryInfoModalProps) {
  const { data: category, isLoading, isError, error } = useCategory(categoryId)

  return (
    <Modal title="Category Info" onClose={onClose}>
      {isLoading && <p className="py-6 text-center text-slate-500">Loading...</p>}
      {isError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{getErrorMessage(error)}</p>}
      {!isLoading && !isError && !category && <p className="py-6 text-center text-slate-500">Category not found</p>}
      {category && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-400">ID</p>
            <p className="font-semibold text-slate-800">{category.id}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-400">Name</p>
            <p className="break-words font-semibold text-slate-800">{category.name || 'No name'}</p>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default function Categories() {
  const [search, setSearch] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [infoCategoryId, setInfoCategoryId] = useState<number | null>(null)

  const { data: categories = [], isLoading, isError, error, refetch } = useCategories()
  const addCategoryMutation = useAddCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  const filteredCategories = categories.filter((category) => {
    const categoryName = category.name || ''
    return categoryName.toLowerCase().includes(search.trim().toLowerCase())
  })

  function handleAddCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (newCategoryName.trim() === '') {
      return
    }
    addCategoryMutation.mutate(
      { name: newCategoryName.trim() },
      { onSuccess: () => setNewCategoryName('') },
    )
  }

  function startEditing(category: Category) {
    setEditingCategoryId(category.id)
    setEditingName(category.name || '')
  }

  function cancelEditing() {
    setEditingCategoryId(null)
    setEditingName('')
  }

  function handleSaveCategory(categoryId: number) {
    if (editingName.trim() === '') {
      return
    }
    updateCategoryMutation.mutate(
      { id: categoryId, name: editingName.trim() },
      { onSuccess: cancelEditing },
    )
  }

  function handleDeleteCategory(category: Category) {
    const isConfirmed = window.confirm(`Delete category "${category.name || 'No name'}"?`)
    if (isConfirmed) {
      deleteCategoryMutation.mutate(category.id)
    }
  }

  const mutationError = addCategoryMutation.error || updateCategoryMutation.error || deleteCategoryMutation.error

  return (
    <div>
      <Header title="Categories" subtitle="Add, edit and delete categories" />

      <form onSubmit={handleAddCategory} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newCategoryName}
          onChange={(event) => setNewCategoryName(event.target.value)}
          placeholder="New category name"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />
        <button
          type="submit"
          disabled={addCategoryMutation.isPending}
          className="shrink-0 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {addCategoryMutation.isPending ? 'Adding...' : '+ Add Category'}
        </button>
      </form>

      <div className="mb-6">
        <Search value={search} onChange={setSearch} placeholder="Search categories..." />
      </div>

      {mutationError && (
        <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{getErrorMessage(mutationError)}</p>
      )}

      {isLoading && <p className="py-10 text-center text-slate-500">Loading categories...</p>}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">Failed to load categories</p>
          <p className="mt-1 text-sm text-red-600">{getErrorMessage(error)}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredCategories.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-14 text-center text-slate-500">
          No categories found
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCategories.map((category) => (
          <li key={category.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {editingCategoryId === category.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveCategory(category.id)}
                    disabled={updateCategoryMutation.isPending}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg">🏷️</div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{category.name || 'No name'}</p>
                    <p className="text-xs text-slate-400">ID: {category.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setInfoCategoryId(category.id)}
                    className="rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                  >
                    Info
                  </button>
                  <button
                    onClick={() => startEditing(category)}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    disabled={deleteCategoryMutation.isPending}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {infoCategoryId !== null && (
        <CategoryInfoModal categoryId={infoCategoryId} onClose={() => setInfoCategoryId(null)} />
      )}
    </div>
  )
}

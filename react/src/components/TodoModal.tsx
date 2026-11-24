import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import Modal from './Modal'
import { useAddTodo, useUpdateTodo } from '../hooks/useTodos'
import { getErrorMessage } from '../services/api'
import type { Todo } from '../types/todo.types'

interface TodoModalProps {
  todo: Todo | null
  onClose: () => void
}

export default function TodoModal({ todo, onClose }: TodoModalProps) {
  const [name, setName] = useState(todo ? todo.name : '')
  const [description, setDescription] = useState(todo ? todo.description : '')
  const [images, setImages] = useState<File[]>([])
  const [formError, setFormError] = useState('')

  const addTodoMutation = useAddTodo()
  const updateTodoMutation = useUpdateTodo()

  const isEditMode = todo !== null
  const isSaving = addTodoMutation.isPending || updateTodoMutation.isPending
  const mutationError = addTodoMutation.error || updateTodoMutation.error

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setImages(Array.from(event.target.files))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (name.trim() === '' || description.trim() === '') {
      setFormError('Name and description are required')
      return
    }

    if (todo === null && images.length === 0) {
      setFormError('Please choose at least one image')
      return
    }

    setFormError('')

    if (todo !== null) {
      updateTodoMutation.mutate(
        { id: todo.id, name: name.trim(), description: description.trim() },
        { onSuccess: onClose },
      )
    } else {
      addTodoMutation.mutate(
        { name: name.trim(), description: description.trim(), images: images },
        { onSuccess: onClose },
      )
    }
  }

  return (
    <Modal title={isEditMode ? 'Edit Task' : 'Add Task'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            placeholder="Task name"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Task description"
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {!isEditMode && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="w-full rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:font-medium file:text-indigo-700"
            />
            {images.length > 0 && <p className="mt-1.5 text-sm text-slate-500">Selected: {images.length}</p>}
          </div>
        )}

        {isEditMode && (
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
            To add or delete images, open the task Info.
          </p>
        )}

        {formError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{formError}</p>}
        {mutationError && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{getErrorMessage(mutationError)}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

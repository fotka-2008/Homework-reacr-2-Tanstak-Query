import type { ChangeEvent } from 'react'
import Modal from './Modal'
import { useAddTodoImages, useDeleteTodoImage, useTodo, useToggleCompleted } from '../hooks/useTodos'
import { getErrorMessage, getImageUrl } from '../services/api'

interface TodoInfoModalProps {
  todoId: number
  onClose: () => void
}

export default function TodoInfoModal({ todoId, onClose }: TodoInfoModalProps) {
  const { data: todo, isLoading, isError, error } = useTodo(todoId)
  const toggleCompletedMutation = useToggleCompleted()
  const addImagesMutation = useAddTodoImages()
  const deleteImageMutation = useDeleteTodoImage()

  function handleAddImages(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length === 0) {
      return
    }
    addImagesMutation.mutate({ todoId: todoId, images: Array.from(files) })
    event.target.value = ''
  }

  function handleDeleteImage(imageId: number) {
    const isConfirmed = window.confirm('Delete this image?')
    if (isConfirmed) {
      deleteImageMutation.mutate(imageId)
    }
  }

  const imageError = addImagesMutation.error || deleteImageMutation.error

  return (
    <Modal title="Task Info" onClose={onClose}>
      {isLoading && <p className="py-8 text-center text-slate-500">Loading...</p>}

      {isError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{getErrorMessage(error)}</p>}

      {!isLoading && !isError && !todo && <p className="py-8 text-center text-slate-500">Task not found</p>}

      {todo && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-slate-400">ID</p>
              <p className="font-semibold text-slate-800">{todo.id}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-slate-400">Status</p>
              <p className={todo.isCompleted ? 'font-semibold text-emerald-600' : 'font-semibold text-amber-600'}>
                {todo.isCompleted ? 'Completed' : 'Not Completed'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400">Name</p>
            <p className="break-words text-lg font-semibold text-slate-800">{todo.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-400">Description</p>
            <p className="whitespace-pre-wrap break-words text-slate-700">{todo.description}</p>
          </div>

          <button
            onClick={() => toggleCompletedMutation.mutate(todo.id)}
            disabled={toggleCompletedMutation.isPending}
            className={
              todo.isCompleted
                ? 'w-full rounded-xl bg-amber-100 py-2.5 font-medium text-amber-700 transition hover:bg-amber-200 disabled:opacity-50'
                : 'w-full rounded-xl bg-emerald-100 py-2.5 font-medium text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-50'
            }
          >
            {todo.isCompleted ? 'Mark as Not Completed' : 'Mark as Completed'}
          </button>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-slate-400">Images ({todo.images.length})</p>
              <label className="cursor-pointer rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100">
                {addImagesMutation.isPending ? 'Uploading...' : '+ Add Images'}
                <input type="file" accept="image/*" multiple onChange={handleAddImages} className="hidden" />
              </label>
            </div>

            {todo.images.length === 0 && <p className="text-sm text-slate-400">No images</p>}

            <div className="grid grid-cols-3 gap-3">
              {todo.images.map((image) => (
                <div key={image.id} className="group relative">
                  <img
                    src={getImageUrl(image.imageName)}
                    alt={todo.name}
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={deleteImageMutation.isPending}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm text-red-600 shadow transition hover:bg-red-600 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {imageError && (
              <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">{getErrorMessage(imageError)}</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

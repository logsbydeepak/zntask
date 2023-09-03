import { ulid } from 'ulidx'
import { create, type StateCreator } from 'zustand'

export interface Toast {
  id: string
  title: string
  description: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface State {
  toasts: Toast[]
}

interface Actions {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const toastStore: StateCreator<State & Actions> = (set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: ulid() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
})

export const useToastStore = create(toastStore)

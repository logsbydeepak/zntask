import { create, type StateCreator } from 'zustand'

import { genID } from '@/shared/id'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
  action?: {
    label: string
    onClick: () => void
  }
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
      toasts: [...state.toasts, { ...toast, id: genID() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
})

export const useToastStore = create(toastStore)

interface Action {
  label: string
  onClick: () => void
}

export const toast = {
  success: (message: string, action?: Action) =>
    useToastStore.getState().addToast({ message, type: 'success', action }),
  error: (message = 'Something went wrong', action?: Action) =>
    useToastStore.getState().addToast({ message, type: 'error', action }),
}

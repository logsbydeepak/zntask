import { create, StateCreator } from 'zustand'

const dialogState = {
  resetPassword: false,
  logout: false,
}

interface State {
  dialog: typeof dialogState
}

interface Actions {
  setDialog: <KEY extends keyof typeof dialogState>(
    key: keyof typeof dialogState,
    value: (typeof dialogState)[KEY]
  ) => void
}

const appStore: StateCreator<State & Actions> = (set) => ({
  dialog: dialogState,
  setDialog(key, value) {
    set((state) => ({
      dialog: {
        ...dialogState,
        [key]: value,
      },
    }))
  },
})

export const useAppStore = create(appStore)

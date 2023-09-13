import { create, StateCreator } from 'zustand'

const dialogState = {
  resetPassword: false,
  logout: false,
}

const initialState = {
  dialog: dialogState,
}

type State = typeof initialState

interface Actions {
  setDialog: <KEY extends keyof typeof dialogState>(
    key: keyof typeof dialogState,
    value: (typeof dialogState)[KEY]
  ) => void
  resetAppState: () => void
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
  resetAppState() {
    set(initialState)
  },
})

export const useAppStore = create(appStore)

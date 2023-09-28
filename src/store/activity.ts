import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'

type Activity =
  | {
      id: string
      type: 'category'
      action: 'CREATE' | 'DELETE' | 'EDIT'
      categoryId: string
      isSynced: boolean
    }
  | {
      id: string
      type: 'task'
      action: 'CREATE' | 'DELETE' | 'EDIT'
      taskId: string
      isSynced: boolean
    }

const initialState = {
  activities: [] as Activity[],
}

type State = typeof initialState

type AddTaskType =
  | {
      type: 'task'
      taskId: string
      action: 'CREATE' | 'DELETE' | 'EDIT'
    }
  | {
      type: 'category'
      categoryId: string
      action: 'CREATE' | 'DELETE' | 'EDIT'
    }

interface Action {
  addActivity: (activity: AddTaskType) => void
  removeActivity: (id: string) => void
  setActivitySynced: (id: string) => void
}

const activityStore: StateCreator<State & Action> = (set, get) => ({
  ...initialState,

  addActivity: (activity) => {
    if (activity.type === 'category') {
      set((state) => ({
        activities: [
          {
            ...activity,
            isSynced: false,
            id: ulid(),
          },
          ...state.activities,
        ],
      }))
    }

    if (activity.type === 'task') {
      set((state) => ({
        activities: [
          {
            ...activity,
            isSynced: false,
            id: ulid(),
          },
          ...state.activities,
        ],
      }))
    }
  },

  removeActivity: (id) => {
    set((state) => ({
      activities: state.activities.filter((item) => item.id !== id),
    }))
  },

  setActivitySynced: (id) => {
    set((state) => ({
      activities: state.activities.map((item) => {
        if (item.id === id) return { ...item, isSynced: true }
        return item
      }),
    }))
  },
})

export const useActivityStore = create(activityStore)

import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'

export interface Task {
  id: string
  title: string
  categoryId: string | null
}

const initialState = {
  tasks: [] as Task[],
}
type State = typeof initialState

interface Actions {
  addTask: (task: Omit<Task, 'id'>) => void
  editTask: (task: Task) => void
  deleteTask: (task: Task) => void
}

const taskStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,

  addTask: async (task) => {
    const id = ulid()
    const newTask: Task = {
      id: id,
      ...task,
    }

    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }))
  },

  editTask(task) {
    set((state) => ({
      tasks: state.tasks.map((item) => {
        if (item.id === task.id) return task
        return item
      }),
    }))
  },

  deleteTask(task) {
    set((state) => ({
      tasks: state.tasks.filter((item) => item.id !== task.id),
    }))
  },
})

export const useTaskStore = create(taskStore)

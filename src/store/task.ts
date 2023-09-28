import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'

import { useActivityStore } from './activity'

export interface Task {
  id: string
  title: string
  isCompleted: boolean
  categoryId: string | null
  orderId: string
}

const initialState = {
  tasks: [] as Task[],
}
type State = typeof initialState

interface Actions {
  addTask: (task: Omit<Omit<Task, 'id'>, 'orderId'>) => void
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
      orderId: ulid(),
    }

    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }))

    useActivityStore.getState().addActivity({
      type: 'task',
      taskId: id,
      action: 'CREATE',
    })
  },

  editTask(task) {
    set((state) => ({
      tasks: state.tasks.map((item) => {
        if (item.id === task.id) return task
        return item
      }),
    }))

    useActivityStore.getState().addActivity({
      type: 'task',
      taskId: task.id,
      action: 'EDIT',
    })
  },

  deleteTask(task) {
    set((state) => ({
      tasks: state.tasks.filter((item) => item.id !== task.id),
    }))

    useActivityStore.getState().addActivity({
      type: 'task',
      taskId: task.id,
      action: 'DELETE',
    })
  },
})

export const useTaskStore = create(taskStore)

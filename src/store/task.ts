import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'

interface Task {
  id: string
  title: string
  isCompleted: boolean
  orderId: string
  date: string | null
  time: string | null
  details: string | null
}

export interface ParentTask extends Task {
  categoryId: string | null
}

export interface ChildTask extends Task {
  parentId: string
}

const initialState = {
  parentTasks: [] as ParentTask[],
  childTasks: [] as ChildTask[],
}
type State = typeof initialState

interface Actions {
  addParentTask: (parentTask: Omit<ParentTask, 'id' | 'orderId'>) => {
    id: string
  }
  addChildTask: (childTask: Omit<ChildTask, 'id'>) => void
  editParentTask: (parentTask: ParentTask) => void
  editChildTask: (childTask: ChildTask) => void

  removeChildTask: (id: string) => void
}

const taskStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  addParentTask: (parentTask) => {
    const id = ulid()

    const newParentTask: ParentTask = {
      id: id,
      orderId: ulid(),
      ...parentTask,
    }

    set((state) => ({
      parentTasks: [newParentTask, ...state.parentTasks],
    }))

    return { id }
  },

  addChildTask(childTask) {
    const id = ulid()

    const newChildTask: ChildTask = {
      ...childTask,
      id,
    }

    set((state) => ({
      childTasks: [...state.childTasks, newChildTask],
    }))
  },

  editParentTask(parentTask) {
    set((state) => ({
      parentTasks: state.parentTasks.map((item) => {
        if (item.id === parentTask.id) return parentTask
        return item
      }),
    }))
  },

  editChildTask(childTask) {
    set((state) => ({
      childTasks: state.childTasks.map((item) => {
        if (item.id === childTask.id) return childTask
        return item
      }),
    }))
  },

  removeChildTask(id) {
    set((state) => ({
      childTasks: state.childTasks.filter((item) => item.id !== id),
    }))
  },
})

export const useTaskStore = create(taskStore)

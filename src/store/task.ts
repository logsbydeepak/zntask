import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'

import { useActivityStore } from './activity'

export interface Task {
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
  removeParentTask: (id: string) => void
  getParentTask: (id: string) => ParentTask | undefined
  getChildTask: (id: string) => ChildTask | undefined
  setNewParentTask: (parentTask: ParentTask[]) => void
  setNewChildTask: (childTask: ChildTask[]) => void
}

const taskStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,

  setNewParentTask(parentTask) {
    set({ parentTasks: parentTask })
  },
  setNewChildTask(childTask) {
    set({ childTasks: childTask })
  },

  getParentTask(id) {
    return get().parentTasks.find((item) => item.id === id)
  },

  getChildTask(id) {
    return get().childTasks.find((item) => item.id === id)
  },

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

    useActivityStore.getState().addActivity({
      type: 'parentTask',
      action: 'CREATE',
      taskId: id,
    })

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

    useActivityStore.getState().addActivity({
      type: 'childTask',
      action: 'CREATE',
      taskId: id,
    })
  },

  editParentTask(parentTask) {
    set((state) => ({
      parentTasks: state.parentTasks.map((item) => {
        if (item.id === parentTask.id) return parentTask
        return item
      }),
    }))

    useActivityStore.getState().addActivity({
      type: 'parentTask',
      action: 'EDIT',
      taskId: parentTask.id,
    })
  },

  editChildTask(childTask) {
    set((state) => ({
      childTasks: state.childTasks.map((item) => {
        if (item.id === childTask.id) return childTask
        return item
      }),
    }))

    useActivityStore.getState().addActivity({
      type: 'childTask',
      action: 'EDIT',
      taskId: childTask.id,
    })
  },

  removeChildTask(id) {
    set((state) => ({
      childTasks: state.childTasks.filter((item) => item.id !== id),
    }))

    useActivityStore.getState().addActivity({
      type: 'childTask',
      action: 'DELETE',
      taskId: id,
    })
  },

  removeParentTask(id) {
    set((state) => ({
      parentTasks: state.parentTasks.filter((item) => item.id !== id),
      childTasks: state.childTasks.filter((item) => item.parentId !== id),
    }))

    useActivityStore.getState().addActivity({
      type: 'parentTask',
      action: 'DELETE',
      taskId: id,
    })
  },
})

export const useTaskStore = create(taskStore)

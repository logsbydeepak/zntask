import { StateCreator } from "zustand"

import { genID } from "#/shared/id"

import { AppStore } from "./app"

interface Task {
  id: string
  title: string
  orderId: string
  date: string | null
  time: string | null
  details: string | null
  completedAt: string | null
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
  addParentTask: (parentTask: Omit<ParentTask, "id" | "orderId">) => {
    id: string
  }
  addChildTask: (childTask: Omit<ChildTask, "id">) => void
  editParentTask: (parentTask: ParentTask) => void
  editChildTask: (childTask: ChildTask) => void

  removeChildTask: (id: string) => void
  removeParentTask: (id: string) => void
  getParentTask: (id: string) => ParentTask | undefined
  getChildTask: (id: string) => ChildTask | undefined
  setNewParentTask: (parentTask: ParentTask[]) => void
  setNewChildTask: (childTask: ChildTask[]) => void
}

export type TaskSlice = State & Actions

export const taskSlice: StateCreator<AppStore, [], [], TaskSlice> = (
  set,
  get
) => ({
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
    const id = genID()

    const newParentTask: ParentTask = {
      id: id,
      orderId: genID(),
      ...parentTask,
    }

    set((state) => ({
      parentTasks: [newParentTask, ...state.parentTasks],
    }))

    return { id }
  },

  addChildTask(childTask) {
    const id = genID()

    const newChildTask: ChildTask = {
      ...childTask,
      id,
    }

    set((state) => ({
      childTasks: [...state.childTasks, newChildTask],
    }))
  },

  editParentTask(parentTask) {
    if (!!parentTask.completedAt) {
      set((state) => ({
        parentTasks: state.parentTasks.map((item) => {
          if (item.id === parentTask.id)
            return {
              ...parentTask,
            }
          return item
        }),
        childTasks: state.childTasks.map((i) =>
          i.parentId === parentTask.id
            ? { ...i, completedAt: parentTask.completedAt }
            : i
        ),
      }))
    } else {
      set((state) => ({
        parentTasks: state.parentTasks.map((item) => {
          if (item.id === parentTask.id)
            return {
              ...parentTask,
              completedAt: null,
            }
          return item
        }),
      }))
    }
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

  removeParentTask(id) {
    set((state) => ({
      parentTasks: state.parentTasks.filter((item) => item.id !== id),
      childTasks: state.childTasks.filter((item) => item.parentId !== id),
    }))
  },
})

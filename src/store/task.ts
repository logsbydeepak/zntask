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
  addTask: (
    parentTask: Omit<ParentTask, 'id' | 'orderId'>,
    childTasks: Omit<ChildTask, 'id' | 'orderId' | 'parentId'>[]
  ) => void
  editTask: (parentTask: ParentTask, childTasks: ChildTask[]) => void
  deleteTask: (id: string) => void
}

const taskStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,

  addTask: async (parentTask, childTasks) => {
    const id = ulid()

    const newParentTask: ParentTask = {
      id: id,
      orderId: ulid(),
      ...parentTask,
    }

    const newChildTasks = childTasks.map((item) => ({
      id: ulid(),
      orderId: ulid(),
      parentId: id,
      ...item,
    }))

    set((state) => ({
      parentTasks: [newParentTask, ...state.parentTasks],
      childTasks: [...newChildTasks, ...state.childTasks],
    }))

    // useActivityStore.getState().addActivity({
    //   type: 'task',
    //   taskId: id,
    //   action: 'CREATE',
    // })
  },

  editTask(parentTask, childTasks) {
    set((state) => ({
      parentTasks: state.parentTasks.map((item) => {
        if (item.id === parentTask.id) return parentTask
        return item
      }),
      childTasks: state.childTasks.map((item) => {
        childTasks.map((childTask) => {
          if (item.id === childTask.id) return childTask
        })

        return item
      }),
    }))

    // set((state) => ({
    //   tasks: state.tasks.map((item) => {
    //     if (item.id === task.id) return task
    //     return item
    //   }),
    // }))
    // useActivityStore.getState().addActivity({
    //   type: 'task',
    //   taskId: task.id,
    //   action: 'EDIT',
    // })
  },

  deleteTask(id) {
    set((state) => ({
      parentTasks: state.parentTasks.filter((item) => item.id !== id),
      childTasks: state.childTasks.filter((item) => item.parentId !== id),
    }))

    // useActivityStore.getState().addActivity({
    //   type: 'task',
    //   taskId: task.id,
    //   action: 'DELETE',
    // })
  },
})

export const useTaskStore = create(taskStore)

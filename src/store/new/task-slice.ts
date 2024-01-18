import { StateCreator } from 'zustand'

interface State {
  task: string
}

interface Actions {}

export type TaskSlice = State & Actions
export const taskSlice: StateCreator<State & Actions> = (set) => ({
  task: 'task',
})

import React, { createContext } from 'react'
import { createUseGesture, dragAction } from '@use-gesture/react'
import { ulid } from 'ulidx'
import { createStore, StateCreator, useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface Rec {
  left: number
  top: number
  width: number
  height: number
}

function centerOfRectangle(rect: Rec) {
  return {
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5,
  }
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

interface Container {
  id: string
  ref: React.RefObject<HTMLElement>
  data?: { [key: string]: string | undefined }
}

const initialState = {
  dropContainers: [] as Container[],
  dragPosition: null as { x: number; y: number } | null,
  DNDId: null as string | null,
  dragContainer: null as Container | null,
  dropData: null as {
    id: string
    place: 'top' | 'bottom'
  } | null,
}

type State = typeof initialState
interface Actions {
  setDragPosition: (position: { x: number; y: number } | null) => void
  setDropData: (data: { id: string; place: 'top' | 'bottom' } | null) => void
  setDragContainer: (container: Container | null) => void
  setDropContainers: (containers: Container) => void
  removeDropContainers: (id: string) => void
}

type CategoryDndStore = State & Actions
const categoryDnDStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  setDragPosition: (position) => set({ dragPosition: position }),
  setDropData: (data) => set({ dropData: data }),
  setDragContainer: (container) => set({ dragContainer: container }),
  setDropContainers: (containers) =>
    set((s) => ({ dropContainers: [...s.dropContainers, containers] })),
  removeDropContainers: (id) =>
    set((s) => ({
      dropContainers: s.dropContainers.filter((i) => i.id !== id),
    })),
})

const createCategoryDnDStore = (initialProps?: Partial<CategoryDndStore>) => {
  return createStore<State & Actions>()((...args) => ({
    ...categoryDnDStore(...args),
    ...initialProps,
  }))
}

type CreateCategoryDnDStoreType = ReturnType<typeof createCategoryDnDStore>
const Context = createContext<CreateCategoryDnDStoreType | null>(null)

export function DNDProvider({
  children,
  initialProps,
  onDrop,
}: {
  children: React.ReactNode
  initialProps?: Partial<CategoryDndStore>
  onDrop: OnDropType
}) {
  const store = React.useRef(
    createCategoryDnDStore({
      ...initialProps,
      DNDId: ulid(),
    })
  )
  return (
    <Context.Provider value={store.current}>
      <DNDManager onDrop={onDrop} />
      {children}
    </Context.Provider>
  )
}

function useCategoryDnD<T>(selector: (state: CategoryDndStore) => T) {
  const store = React.useContext(Context)
  if (!store) {
    throw new Error('useCategoryDnD must be used within a CategoryDnDProvider')
  }
  return useStore(store, useShallow(selector))
}

const useGesture = createUseGesture([dragAction])

export function useDrag({ id }: { id: string }) {
  const ref = React.useRef<HTMLElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const [position, setPosition] = React.useState<{
    x: number
    y: number
  } | null>({ x: 0, y: 0 })

  const DNDId = useCategoryDnD((state) => state.DNDId)
  const dropData = useCategoryDnD((s) => s.dropData)
  const setDropData = useCategoryDnD((s) => s.setDropData)
  const setDragPosition = useCategoryDnD((s) => s.setDragPosition)
  const setDragContainer = useCategoryDnD((s) => s.setDragContainer)
  const dropContainers = useCategoryDnD((s) => s.dropContainers)

  const bind = useGesture(
    {
      onDragStart: () => {
        setDragContainer({ id, ref })
        setIsDragging(true)
      },
      onDrag: ({ xy }) => {
        setDragPosition({ x: xy[0], y: xy[1] })
        setPosition({ x: xy[0], y: xy[1] })
      },
      onDragEnd: () => {
        if (!dropData) return
        const overData = dropContainers.find((i) => i.id === dropData.id)

        window.dispatchEvent(
          new CustomEvent(`custom:drop${DNDId}`, {
            detail: {
              start: id,
              over: dropData.id,
              position: dropData.place,
              data: overData?.data,
            },
          })
        )

        setPosition(null)
        setDragPosition(null)
        setDragContainer(null)
        setDropData(null)
      },
    },
    {
      drag: {
        preventDefault: true,
        filterTaps: true,
      },
    }
  )

  return { position, bind, isDragging, ref }
}

export function useDrop({
  id,
  data,
}: {
  id: string
  data?: { [key: string]: string | undefined }
}) {
  const ref = React.useRef<HTMLElement | null>(null)
  const dataRef = React.useRef(data).current

  const setDropContainers = useCategoryDnD((s) => s.setDropContainers)
  const removeDropContainers = useCategoryDnD((s) => s.removeDropContainers)
  const dropData = useCategoryDnD((s) => s.dropData)

  const isOver = dropData?.id === id
  const place = dropData?.place

  React.useEffect(() => {
    setDropContainers({ id, ref, data: dataRef })
    return () => removeDropContainers(id)
  }, [id, setDropContainers, removeDropContainers, dataRef])

  return { ref, isOver, place }
}

type OnDropType = ({
  start,
  over,
  position,
  data,
}: {
  start: string
  over?: string
  position?: string
  data?: { [key: string]: string | undefined }
}) => void

type DNDEvent = CustomEvent<{
  start: string
  over: string
  position: string
  data?: { [key: string]: string | undefined }
}>

function DNDManager({ onDrop }: { onDrop: OnDropType }) {
  const DNDId = useCategoryDnD((s) => s.DNDId)

  const dropContainers = useCategoryDnD((s) => s.dropContainers)
  const dragContainerId = useCategoryDnD((s) => s.dragContainer)

  const dragPosition = useCategoryDnD((s) => s.dragPosition)
  const setDropData = useCategoryDnD((s) => s.setDropData)

  const [centerOfDrops, setCenterOfDrops] = React.useState<
    { id: string; center: { x: number; y: number } }[]
  >([])

  React.useEffect(() => {
    const handleDrop = (e: Event) => {
      const event = e as DNDEvent
      if (!event.detail) return
      if (!event.detail.start) return
      if (!event.detail.over) return
      if (!event.detail.position) return
      onDrop(event.detail)
    }

    window.addEventListener(`custom:drop${DNDId}`, handleDrop)
    return () => window.removeEventListener(`custom:drop${DNDId}`, handleDrop)
  }, [DNDId, onDrop])

  React.useEffect(() => {
    if (!Object.keys(dropContainers).length) return

    if (dragContainerId) {
      const centerOfDrops: { id: string; center: { x: number; y: number } }[] =
        []

      dropContainers.forEach((i) => {
        const dropRect = i.ref.current?.getBoundingClientRect()
        if (!dropRect) return
        const center = centerOfRectangle(dropRect)
        centerOfDrops.push({ id: i.id, center })
      })

      setCenterOfDrops(centerOfDrops)
    } else {
      setCenterOfDrops([])
    }
  }, [dragContainerId, dropContainers])

  React.useEffect(() => {
    if (!dragPosition) return
    if (!dragContainerId) return
    if (!centerOfDrops.length) return

    const dragRect = dragContainerId.ref.current?.getBoundingClientRect()
    if (!dragRect) return
    const dragCenter = centerOfRectangle(dragRect)

    const distanceBetween = centerOfDrops.map((i) => ({
      id: i.id,
      distance: distance(dragCenter, i.center),
    }))

    const over = distanceBetween.reduce((prev, curr) =>
      prev.distance < curr.distance ? prev : curr
    )

    const dropRect = dropContainers
      .find((i) => i.id === over.id)
      ?.ref.current?.getBoundingClientRect()
    if (!dropRect) return
    const dropCenter = centerOfRectangle(dropRect)
    const dropPlace = dragCenter.y < dropCenter.y ? 'top' : 'bottom'
    setDropData({ id: over.id, place: dropPlace })
  }, [
    dragPosition,
    dragContainerId,
    centerOfDrops,
    dropContainers,
    setDropData,
  ])

  return null
}

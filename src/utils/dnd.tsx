import React from 'react'
import { createUseGesture, dragAction } from '@use-gesture/react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithReducer, useHydrateAtoms } from 'jotai/utils'
import { ulid } from 'ulidx'
import { shallow } from 'zustand/shallow'

import { JotaiProvider } from '@/components/client-providers'

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
}

function atomWithCompare<Value>(
  initialValue: Value,
  areEqual: (prev: Value, next: Value) => boolean
) {
  return atomWithReducer(initialValue, (prev: Value, next: Value) => {
    if (areEqual(prev, next)) {
      return prev
    }

    return next
  })
}

const dropContainersAtom = atom<Container[]>([])
const dragPositionAtom = atom<{ x: number; y: number } | null>(null)
const DNDIdAtom = atom<string | null>(null)
const dragContainerAtom = atom<Container | null>(null)
const dropDataAtom = atomWithCompare<{
  id: string
  place: 'top' | 'bottom'
} | null>(null, shallow)

const useGesture = createUseGesture([dragAction])

export function useDrag({ id }: { id: string }) {
  const ref = React.useRef<HTMLElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const [position, setPosition] = React.useState<{
    x: number
    y: number
  } | null>({ x: 0, y: 0 })

  const DNDId = useAtomValue(DNDIdAtom)
  const [dropData, setDropData] = useAtom(dropDataAtom)
  const setDragPosition = useSetAtom(dragPositionAtom)
  const setDragContainer = useSetAtom(dragContainerAtom)

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
        window.dispatchEvent(
          new CustomEvent(`custom:drop${DNDId}`, {
            detail: { start: id, over: dropData.id, position: dropData.place },
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

export function useDrop({ id }: { id: string }) {
  const setDropContainers = useSetAtom(dropContainersAtom)
  const ref = React.useRef<HTMLElement | null>(null)
  const dropData = useAtomValue(dropDataAtom)

  const isOver = dropData?.id === id
  const place = dropData?.place

  React.useEffect(() => {
    setDropContainers((prev) => [...prev, { id, ref }])
    return () => setDropContainers((prev) => prev.filter((i) => i.id !== id))
  }, [id, setDropContainers])

  return { ref, isOver, place }
}

type OnDropType = ({
  start,
  over,
  position,
}: {
  start: string
  over?: string
  position?: string
}) => void
export function DNDProvider({
  children,
  onDrop,
}: {
  children: React.ReactNode
  onDrop: OnDropType
}) {
  return (
    <JotaiProvider>
      <DNDManager onDrop={onDrop} />
      {children}
    </JotaiProvider>
  )
}

type DNDEvent = CustomEvent<{ start: string; over: string; position: string }>

function DNDManager({ onDrop }: { onDrop: OnDropType }) {
  useHydrateAtoms([[DNDIdAtom, ulid()]])
  const DNDId = useAtomValue(DNDIdAtom)

  const dropContainers = useAtomValue(dropContainersAtom)
  const dragContainerId = useAtomValue(dragContainerAtom)

  const dragPosition = useAtomValue(dragPositionAtom)
  const setDropData = useSetAtom(dropDataAtom)

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
    const dropPlace = dragCenter.y > dropCenter.y ? 'top' : 'bottom'
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

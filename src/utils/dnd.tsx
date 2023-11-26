import React from 'react'
import { createUseGesture, dragAction } from '@use-gesture/react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { ulid } from 'ulidx'
import { useDebounce } from 'use-debounce'

import { JotaiProvider } from '@/components/client-providers'

interface Rec {
  left: number
  top: number
  width: number
  height: number
}

export function getIntersectionRatio(entry: Rec, target: Rec): number {
  const top = Math.max(target.top, entry.top)
  const left = Math.max(target.left, entry.left)
  const right = Math.min(target.left + target.width, entry.left + entry.width)
  const bottom = Math.min(target.top + target.height, entry.top + entry.height)
  const width = right - left
  const height = bottom - top

  if (left < right && top < bottom) {
    const targetArea = target.width * target.height
    const entryArea = entry.width * entry.height
    const intersectionArea = width * height
    const intersectionRatio =
      intersectionArea / (targetArea + entryArea - intersectionArea)

    return Number(intersectionRatio.toFixed(4))
  }

  return 0
}

interface Container {
  id: string
  ref: React.RefObject<HTMLElement>
}

const dropContainersAtom = atom<Container[]>([])
const dragPositionAtom = atom<{ x: number; y: number } | null>(null)
const overIdAtom = atom<string | null>(null)
const DNDIdAtom = atom<string | null>(null)
const dragContainerAtom = atom<Container | null>(null)

const useGesture = createUseGesture([dragAction])

export function useDrag({ id }: { id: string }) {
  const [position, setPosition] = React.useState<{
    x: number
    y: number
  } | null>({ x: 0, y: 0 })

  const DNDId = useAtomValue(DNDIdAtom)
  const [overId, setOverId] = useAtom(overIdAtom)
  const setDragPosition = useSetAtom(dragPositionAtom)
  const ref = React.useRef<HTMLElement | null>(null)
  const [dragContainer, setDragContainer] = useAtom(dragContainerAtom)
  const isDragging = dragContainer?.id === id

  const bind = useGesture(
    {
      onDragStart: () => {
        setDragContainer({ id, ref })
      },
      onDrag: ({ movement: [mx, my], xy }) => {
        setDragPosition({ x: mx, y: my })
        setPosition({ x: xy[0], y: xy[1] })
      },
      onDragEnd: () => {
        window.dispatchEvent(
          new CustomEvent(`custom:drop${DNDId}`, {
            detail: { start: dragContainer?.id, over: overId },
          })
        )

        setPosition(null)
        setDragPosition(null)

        setDragContainer(null)
        setOverId(null)
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
  const overId = useAtomValue(overIdAtom)
  const isOver = overId === id

  React.useEffect(() => {
    setDropContainers((prev) => [...prev, { id, ref, isHovering: false }])

    return () => setDropContainers((prev) => prev.filter((c) => c.id !== id))
  }, [id, setDropContainers])

  return { ref, isOver }
}

export function useDNDState() {
  const dragPosition = useAtomValue(dragPositionAtom)

  return { dragPosition }
}

type OnDropType = ({ start, over }: { start: string; over?: string }) => void

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

type DNDEvent = CustomEvent<{ start: string; over: string }>

function DNDManager({ onDrop }: { onDrop: OnDropType }) {
  useHydrateAtoms([[DNDIdAtom, ulid()]])

  const DNDId = useAtomValue(DNDIdAtom)
  const dropContainers = useAtomValue(dropContainersAtom)
  const dragContainer = useAtomValue(dragContainerAtom)
  const dragPosition = useAtomValue(dragPositionAtom)
  const setOverId = useSetAtom(overIdAtom)

  const deferredPosition = React.useDeferredValue(dragPosition)

  React.useEffect(() => {
    const handleDrop = (e: Event) => {
      const event = e as DNDEvent
      if (!event.detail) return
      if (!event.detail.start) return
      if (!event.detail.over) return
      onDrop(event.detail)
    }

    window.addEventListener(`custom:drop${DNDId}`, handleDrop)
    return () => window.removeEventListener(`custom:drop${DNDId}`, handleDrop)
  }, [DNDId, onDrop])

  React.useEffect(() => {
    if (!deferredPosition) return
    if (!!!dropContainers.length) return

    const startRect = dragContainer?.ref.current?.getBoundingClientRect()
    if (!startRect) return

    const intersection = dropContainers
      .map((c) => ({
        id: c.id,
        intersection: getIntersectionRatio(
          startRect,
          c.ref.current?.getBoundingClientRect()!
        ),
      }))
      .reduce((prev, curr) =>
        prev.intersection > curr.intersection ? prev : curr
      )

    setOverId(intersection.id)
  }, [deferredPosition, dropContainers, setOverId, dragContainer])

  return null
}

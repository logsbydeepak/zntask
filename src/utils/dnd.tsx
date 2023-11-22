import React from 'react'
import { useDrag as _useDrag } from '@use-gesture/react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'

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

interface DropContainer {
  id: string
  ref: React.RefObject<HTMLElement>
  initialRect: Rec
}

const dropContainersAtom = atom<DropContainer[]>([])
const dragPositionAtom = atom<{ x: number; y: number } | null>(null)
const overIdAtom = atom<string | null>(null)
const startIdAtom = atom<string | null>(null)

export function useDrag({ id }: { id: string }) {
  const [position, setPosition] = React.useState<{
    x: number
    y: number
  } | null>({ x: 0, y: 0 })

  const [startId, setStartId] = useAtom(startIdAtom)
  const setOverId = useSetAtom(overIdAtom)
  const isDragging = startId === id
  const setDragPosition = useSetAtom(dragPositionAtom)

  const bind = _useDrag(
    ({ movement: [mx, my], active }) => {
      if (active) {
        setStartId(id)
        setPosition({ x: mx, y: my })
        setDragPosition({ x: mx, y: my })
      } else {
        setPosition(null)
        setDragPosition(null)
        setOverId(null)
        setStartId(null)
      }
    },
    { preventDefault: true, filterTaps: true }
  )

  return { position, bind, isDragging }
}

export function useDrop({ id }: { id: string }) {
  const setDropContainers = useSetAtom(dropContainersAtom)
  const ref = React.useRef<HTMLElement>(null)
  const overId = useAtomValue(overIdAtom)
  const isOver = overId === id

  React.useEffect(() => {
    const el = ref.current?.getBoundingClientRect()
    if (!el) return

    const rec: Rec = {
      left: el.left,
      top: el.top,
      width: el.width,
      height: el.height,
    }

    setDropContainers((prev) => [
      ...prev,
      { id, ref, initialRect: rec, isHovering: false },
    ])

    return () => setDropContainers((prev) => prev.filter((c) => c.id !== id))
  }, [id, setDropContainers])

  return { ref, isOver }
}

export function useDNDState() {
  const dragPosition = useAtomValue(dragPositionAtom)

  return { dragPosition }
}

export function DNDProvider({
  children,
  onDrop,
}: {
  children: React.ReactNode
  onDrop: ({ start, over }: { start: string; over?: string }) => void
}) {
  return (
    <JotaiProvider>
      <DNDManager />
      {children}
    </JotaiProvider>
  )
}

function DNDManager() {
  const dropContainers = useAtomValue(dropContainersAtom)
  const startId = useAtomValue(startIdAtom)

  const dragPosition = useAtomValue(dragPositionAtom)
  const deferredPosition = React.useDeferredValue(dragPosition)
  const setOverId = useSetAtom(overIdAtom)

  React.useEffect(() => {
    if (!startId) return
    if (!deferredPosition) return
    if (!!!dropContainers.length) return

    const startRect = dropContainers
      .find((c) => c.id === startId)
      ?.ref.current?.getBoundingClientRect()
    if (!startRect) return

    const startCenter = centerOfRectangle(startRect)

    const centerOfDrops: { id: string; center: { x: number; y: number } }[] = []
    dropContainers.forEach((c) => {
      if (c.id === startId) {
        const center = centerOfRectangle(c.initialRect)
        centerOfDrops.push({ id: c.id, center })
        return
      }

      const center = centerOfRectangle(c.ref.current?.getBoundingClientRect()!)
      centerOfDrops.push({ id: c.id, center })
    })

    const distanceBetween = centerOfDrops.map((c) => ({
      id: c.id,
      distance: distance(startCenter, c.center),
    }))

    const over = distanceBetween.reduce((prev, curr) =>
      prev.distance < curr.distance ? prev : curr
    )

    setOverId(over.id)
  }, [deferredPosition, dropContainers, setOverId, startId])

  return null
}

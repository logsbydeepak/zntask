'use client'

import React from 'react'

import { useAppStore } from '@/store/app'
import { cn } from '@/utils/style'

export function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="max-w-[90%] truncate text-lg font-medium">{children}</h1>
  )
}

export function Root({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function Header({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function Content({ children }: { children?: React.ReactNode }) {
  return <div className="pt-4">{children}</div>
}

export function NotFound() {
  return <h1>Not Found</h1>
}

function EmptyContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-[calc(100vh-200px)] flex-col items-center justify-center',
        className
      )}
    >
      <div className="flex size-32 items-center justify-center rounded-lg border border-newGray-4 bg-newGray-1 shadow-sm">
        <span className="flex flex-col items-center space-y-1 text-center text-newGray-10">
          {children}
        </span>
      </div>
    </div>
  )
}

function EmptyIcon({ children }: { children: React.ReactNode }) {
  return <div className="size-5">{children}</div>
}

function EmptyLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>
}

export const Empty = {
  Container: EmptyContainer,
  Icon: EmptyIcon,
  Label: EmptyLabel,
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)

  return (
    <main data-sidebar={isSidebarOpen} className="group/sidebar">
      <div className="pt-16 transition-all duration-150 ease-in-out sm:group-data-[sidebar=true]/sidebar:pl-56">
        <div className="mx-auto max-w-2xl px-4 py-2 md:py-4 group-data-[sidebar=false]/sidebar:md:px-5 group-data-[sidebar=true]/sidebar:md:px-8">
          {children}
        </div>
      </div>
    </main>
  )
}

'use client'

import { Provider, useAtomValue } from 'jotai'

import { isSidebarOpenAtom } from '@/store/app'

export function JotaiProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)

  return (
    <main data-sidebar={isSidebarOpen} className="group/sidebar">
      <div className="pt-14 group-data-[sidebar=true]/sidebar:pl-56">
        <div className="mx-auto max-w-7xl px-4 py-2 md:py-4 group-data-[sidebar=false]/sidebar:md:px-5 group-data-[sidebar=true]/sidebar:md:px-8">
          {children}
        </div>
      </div>
    </main>
  )
}

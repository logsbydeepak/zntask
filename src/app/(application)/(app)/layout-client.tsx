'use client'

import { Provider, useAtomValue } from 'jotai'

import { isSidebarOpenAtom } from '@/store/app'

export function JotaiProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)

  return (
    <main data-sidebar={isSidebarOpen} className="group">
      <div className="pt-14 group-data-[sidebar=true]:pl-56">
        <div className="group/sidebar mx-auto max-w-7xl px-10 py-4">
          {children}
        </div>
      </div>
    </main>
  )
}

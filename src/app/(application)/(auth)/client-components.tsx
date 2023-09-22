'use client'

import React from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/utils/style'

export function Navbar() {
  const {
    theme: themeProvider,
    setTheme: setThemeProvider,
    resolvedTheme,
  } = useTheme()
  const [theme, setCurrentTheme] = React.useState<string>('')

  React.useEffect(() => {
    setCurrentTheme(themeProvider || '')
  }, [themeProvider])

  const setTheme = (currentTheme: string) => {
    setThemeProvider(currentTheme)
  }

  return (
    <nav className="m-2 md:m-4">
      <div className="flex justify-end">
        <div className="flex space-x-2 rounded-full border px-1 py-1">
          <Icon isActive={theme === 'light'} onClick={() => setTheme('light')}>
            <MoonIcon className="h-full w-full" strokeWidth={2} />
          </Icon>
          <Icon isActive={theme === 'dark'} onClick={() => setTheme('dark')}>
            <SunIcon className="h-full w-full" strokeWidth={2} />
          </Icon>
          <Icon
            isActive={theme === 'system'}
            onClick={() => setTheme('system')}
          >
            <MonitorIcon className="h-full w-full" strokeWidth={2} />
          </Icon>
        </div>
      </div>
    </nav>
  )
}

function Icon({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}) {
  return (
    <button
      className={cn(
        'p-1',
        isActive ? 'rounded-full bg-gray-950 text-white' : 'text-gray-800'
      )}
      onClick={onClick}
    >
      <div className="h-3 w-3">{children}</div>
    </button>
  )
}

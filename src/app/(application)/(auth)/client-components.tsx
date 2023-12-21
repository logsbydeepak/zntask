'use client'

import React from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/utils/style'

export function Theme() {
  const { theme: themeProvider, setTheme: setThemeProvider } = useTheme()
  const [theme, setCurrentTheme] = React.useState<string>('')

  React.useEffect(() => {
    setCurrentTheme(themeProvider || '')
  }, [themeProvider])

  const setTheme = (currentTheme: string) => {
    setThemeProvider(currentTheme)
  }

  return (
    <div className="inline-flex space-x-2 self-center rounded-full border px-1 py-1">
      <Icon isActive={theme === 'light'} onClick={() => setTheme('light')}>
        <MoonIcon />
      </Icon>
      <Icon isActive={theme === 'dark'} onClick={() => setTheme('dark')}>
        <SunIcon />
      </Icon>
      <Icon isActive={theme === 'system'} onClick={() => setTheme('system')}>
        <MonitorIcon />
      </Icon>
    </div>
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
      <div className="size-3.5">{children}</div>
    </button>
  )
}

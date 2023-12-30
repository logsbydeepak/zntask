'use client'

import React from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import * as Tooltip from '@/components/ui/tooltip'
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
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Icon
              isActive={theme === 'light'}
              onClick={() => setTheme('light')}
            >
              <SunIcon />
            </Icon>
          </Tooltip.Trigger>
          <Tooltip.Content>light theme</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Icon isActive={theme === 'dark'} onClick={() => setTheme('dark')}>
              <MoonIcon />
            </Icon>
          </Tooltip.Trigger>
          <Tooltip.Content>dark theme</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Icon
              isActive={theme === 'system'}
              onClick={() => setTheme('system')}
            >
              <MonitorIcon />
            </Icon>
          </Tooltip.Trigger>
          <Tooltip.Content>system theme</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}

const Icon = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & {
    isActive: boolean
  }
>(({ children, isActive, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        'rounded-full p-1',
        isActive ? 'bg-gray-950 text-white' : 'text-gray-800'
      )}
    >
      <div className="size-3.5">{children}</div>
    </button>
  )
})
Icon.displayName = 'Icon'

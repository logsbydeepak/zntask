'use client'

import React from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'
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

  const themeOptions = [
    {
      icon: <SunIcon />,
      label: 'light theme',
      value: 'light',
    },
    {
      icon: <MoonIcon />,
      label: 'dark theme',
      value: 'dark',
    },
    {
      icon: <MonitorIcon />,
      label: 'system theme',
      value: 'system',
    },
  ]

  return (
    <Tooltip.Provider>
      <RadioGroup.Root
        value={theme}
        onValueChange={setTheme}
        className="flex space-x-1 self-center rounded-full border border-newGray-4 p-1"
      >
        {themeOptions.map((i) => (
          <Tooltip.Root key={i.value}>
            <Tooltip.Trigger asChild>
              <RadioGroup.Item
                value={i.value}
                className={cn(
                  'flex size-5 items-center justify-center rounded-full text-newGray-11',
                  'outline-2 outline-offset-[3px] outline-newGray-12 hover:text-newGray-12',
                  'focus-visible:outline aria-[checked=true]:bg-newGray-12 aria-[checked=true]:text-newGray-1'
                )}
              >
                <div className="size-3">{i.icon}</div>
              </RadioGroup.Item>
            </Tooltip.Trigger>
            <Tooltip.Content sideOffset={8}>{i.label}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </RadioGroup.Root>
    </Tooltip.Provider>
  )
}

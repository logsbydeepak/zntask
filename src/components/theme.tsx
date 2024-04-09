'use client'

import React from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { ThemeProvider as Theme, useTheme } from 'next-themes'

import { cn } from '@/utils/style'

import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from './ui/tooltip'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <Theme attribute="class">{children}</Theme>
}

export function ThemeSwitch() {
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
      Icon: SunIcon,
      label: 'light theme',
      value: 'light',
    },
    {
      Icon: MoonStarIcon,
      label: 'dark theme',
      value: 'dark',
    },
    {
      Icon: MonitorIcon,
      label: 'system theme',
      value: 'system',
    },
  ]

  return (
    <TooltipProvider>
      <RadioGroup.Root
        value={theme}
        onValueChange={setTheme}
        className="flex space-x-1 self-center rounded-full border border-gray-4 p-1"
      >
        {themeOptions.map(({ Icon, ...i }) => (
          <TooltipRoot key={i.value}>
            <TooltipTrigger asChild>
              <RadioGroup.Item
                value={i.value}
                className={cn(
                  'rounded-full text-gray-11',
                  'outline-2 outline-offset-2 outline-gray-12 hover:text-gray-12',
                  'focus-visible:outline aria-[checked=true]:bg-gray-12 aria-[checked=true]:text-gray-1'
                )}
              >
                <Icon className="size-5 p-1" />
              </RadioGroup.Item>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>{i.label}</TooltipContent>
          </TooltipRoot>
        ))}
      </RadioGroup.Root>
    </TooltipProvider>
  )
}

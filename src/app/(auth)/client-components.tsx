'use client'

import React from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import * as Tooltip from '@/components/ui/tooltip'

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
    <Tooltip.Provider>
      <RadioGroup.Root
        value={theme}
        onValueChange={setTheme}
        className="flex space-x-1 self-center rounded-full border border-gray-200 p-1"
      >
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <RadioGroup.Item value="light" asChild>
              <Icon>
                <SunIcon />
              </Icon>
            </RadioGroup.Item>
          </Tooltip.Trigger>
          <Tooltip.Content sideOffset={8}>light theme</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <RadioGroup.Item value="dark" asChild>
              <Icon>
                <MoonIcon />
              </Icon>
            </RadioGroup.Item>
          </Tooltip.Trigger>
          <Tooltip.Content sideOffset={8}>dark theme</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <RadioGroup.Item value="system" asChild>
              <Icon>
                <MonitorIcon />
              </Icon>
            </RadioGroup.Item>
          </Tooltip.Trigger>
          <Tooltip.Content sideOffset={8}>system theme</Tooltip.Content>
        </Tooltip.Root>
      </RadioGroup.Root>
    </Tooltip.Provider>
  )
}

const Icon = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="flex size-5 items-center justify-center rounded-full text-gray-600 outline-2 outline-offset-2 outline-gray-950 hover:text-gray-950 focus-visible:outline aria-[checked=true]:bg-gray-950 aria-[checked=true]:text-gray-50"
    >
      <div className="size-3">{children}</div>
    </button>
  )
})
Icon.displayName = 'Icon'

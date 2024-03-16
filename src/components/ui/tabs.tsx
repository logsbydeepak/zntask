import React from 'react'
import * as TabsPrimitives from '@radix-ui/react-tabs'

import { cn } from '@/utils/style'

export const Root = TabsPrimitives.Root
export const Content = TabsPrimitives.Content

export const List = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.List>,
  React.ComponentProps<typeof TabsPrimitives.List>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitives.List
      ref={ref}
      {...props}
      className={cn(
        'inline-flex space-x-2 rounded-lg bg-newGray-3 p-1.5',
        className
      )}
    />
  )
})
List.displayName = TabsPrimitives.List.displayName

export const Trigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Trigger>,
  React.ComponentProps<typeof TabsPrimitives.Trigger>
>((props, ref) => (
  <TabsPrimitives.Trigger
    {...props}
    ref={ref}
    className="rounded-md px-3 py-1 text-xs text-newGray-11 hover:text-newGray-12 aria-[selected=true]:bg-newGray-1 aria-[selected=true]:text-newGray-12 aria-[selected=true]:shadow-sm aria-[selected=true]:drop-shadow-sm"
  />
))

Trigger.displayName = TabsPrimitives.Trigger.displayName

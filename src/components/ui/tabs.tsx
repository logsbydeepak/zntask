import React from 'react'
import {
  Content as TabsContentPrimitive,
  List as TabsListPrimitive,
  Root as TabsRootPrimitive,
  Trigger as TabsTriggerPrimitive,
} from '@radix-ui/react-tabs'

import { cn } from '@/utils/style'

const TabsRoot = TabsRootPrimitive
const TabsContent = TabsContentPrimitive

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsListPrimitive>,
  React.ComponentProps<typeof TabsListPrimitive>
>(({ className, ...props }, ref) => {
  return (
    <TabsListPrimitive
      ref={ref}
      {...props}
      className={cn(
        'inline-flex space-x-2 rounded-lg bg-gray-3 p-1.5',
        className
      )}
    />
  )
})
TabsList.displayName = TabsListPrimitive.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTriggerPrimitive>,
  React.ComponentProps<typeof TabsTriggerPrimitive>
>((props, ref) => (
  <TabsTriggerPrimitive
    {...props}
    ref={ref}
    className="rounded-md px-3 py-1 text-xs text-gray-11 hover:text-gray-12 aria-[selected=true]:bg-gray-1 aria-[selected=true]:text-gray-12 aria-[selected=true]:shadow-sm aria-[selected=true]:drop-shadow-sm"
  />
))

TabsTrigger.displayName = TabsTriggerPrimitive.displayName

export { TabsRoot, TabsContent, TabsList, TabsTrigger }

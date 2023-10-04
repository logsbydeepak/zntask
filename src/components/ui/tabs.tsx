import React from 'react'
import {
  Content as ContentPrimitives,
  List as ListPrimitives,
  Root as RootPrimitives,
  Tabs as TabsPrimitives,
  Trigger as TriggerPrimitives,
} from '@radix-ui/react-tabs'

export const TabsRoot = RootPrimitives
export const TabsContent = ContentPrimitives

export const TabsList = React.forwardRef<
  React.ElementRef<typeof ListPrimitives>,
  React.ComponentProps<typeof ListPrimitives>
>((props, ref) => {
  return (
    <ListPrimitives
      {...props}
      ref={ref}
      className="inline-flex space-x-2 rounded-lg bg-gray-100 p-1.5"
    />
  )
})
TabsList.displayName = ListPrimitives.displayName

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TriggerPrimitives>,
  React.ComponentProps<typeof TriggerPrimitives>
>((props, ref) => (
  <TriggerPrimitives
    {...props}
    ref={ref}
    className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:text-gray-950 aria-[selected=true]:bg-white aria-[selected=true]:text-gray-950 aria-[selected=true]:shadow-sm aria-[selected=true]:drop-shadow-sm"
  />
))

TabsTrigger.displayName = TabsPrimitives.displayName

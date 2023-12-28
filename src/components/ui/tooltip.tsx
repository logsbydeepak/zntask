import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/utils/style'

export const Provider = TooltipPrimitive.Provider
export const Root = TooltipPrimitive.Root
export const Trigger = TooltipPrimitive.Trigger
export const Portal = TooltipPrimitive.Portal

export const Content = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Content
    {...props}
    ref={ref}
    className={cn(
      'z-50 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-500 drop-shadow-sm',
      className
    )}
  />
))
Content.displayName = TooltipPrimitive.Content.displayName

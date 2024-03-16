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
      'z-50 rounded-lg border border-newGray-5 bg-newGray-2 px-2 py-1 text-xs',
      'font-medium text-newGray-11 drop-shadow-sm animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      'data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      className
    )}
  />
))
Content.displayName = TooltipPrimitive.Content.displayName

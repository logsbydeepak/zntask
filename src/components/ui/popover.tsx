import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/utils/style'

export const Root = PopoverPrimitive.Root
export const Trigger = PopoverPrimitive.Trigger
export const Portal = PopoverPrimitive.Portal

export const Content = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    {...props}
    className={cn(
      'bg-popover text-popover-foreground z-50 w-72 rounded-lg border p-2',
      'bg-white outline-none drop-shadow-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
  />
))
Content.displayName = PopoverPrimitive.Content.displayName

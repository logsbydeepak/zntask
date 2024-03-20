import * as React from 'react'
import {
  Content as PopoverContentPrimitive,
  Portal as PopoverPortalPrimitive,
  Root as PopoverRootPrimitive,
  Trigger as PopoverTriggerPrimitive,
} from '@radix-ui/react-popover'

import { cn } from '@/utils/style'

const PopoverRoot = PopoverRootPrimitive
const PopoverTrigger = PopoverTriggerPrimitive

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverContentPrimitive>,
  React.ComponentPropsWithoutRef<typeof PopoverContentPrimitive>
>(({ className, ...props }, ref) => (
  <PopoverPortalPrimitive>
    <PopoverContentPrimitive
      ref={ref}
      {...props}
      className={cn(
        'z-50 w-72 rounded-lg border border-gray-3 p-2',
        'bg-gray-1 outline-none drop-shadow-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
    />
  </PopoverPortalPrimitive>
))
PopoverContent.displayName = PopoverContentPrimitive.displayName

export { PopoverRoot, PopoverTrigger, PopoverContent }

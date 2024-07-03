import React from "react"
import {
  Content as TooltipContentPrimitive,
  Portal as TooltipPortalPrimitive,
  Provider as TooltipProviderPrimitive,
  Root as TooltipRootPrimitive,
  Trigger as TooltipTriggerPrimitive,
} from "@radix-ui/react-tooltip"

import { cn } from "#/utils/style"

const TooltipProvider = TooltipProviderPrimitive
const TooltipRoot = TooltipRootPrimitive
const TooltipTrigger = TooltipTriggerPrimitive

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContentPrimitive>,
  React.ComponentPropsWithoutRef<typeof TooltipContentPrimitive>
>(({ className, ...props }, ref) => (
  <TooltipPortalPrimitive>
    <TooltipContentPrimitive
      {...props}
      ref={ref}
      className={cn(
        "z-50 rounded-lg border border-gray-5 bg-gray-2 px-2 py-1 text-xs",
        "font-medium text-gray-11 drop-shadow-sm animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
    />
  </TooltipPortalPrimitive>
))
TooltipContent.displayName = TooltipContentPrimitive.displayName

export { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger }

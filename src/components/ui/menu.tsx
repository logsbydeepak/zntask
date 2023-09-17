import React from 'react'
import {
  Content as ContextMenuContentPrimitives,
  Item as ContextMenuItemPrimitives,
  Root as ContextMenuRootPrimitives,
  Trigger as ContextMenuTriggerPrimitives,
} from '@radix-ui/react-context-menu'
import {
  Content as DropdownMenuContentPrimitives,
  Item as DropdownMenuItemPrimitives,
  Portal as DropdownMenuPortalPrimitives,
  RadioGroup as DropdownMenuRadioGroupPrimitives,
  RadioItem as DropdownMenuRadioItemPrimitives,
  Root as DropdownMenuRootPrimitives,
  Trigger as DropdownMenuTriggerPrimitives,
} from '@radix-ui/react-dropdown-menu'

import { cn } from '@/utils/style'

export const ContextMenuRoot = ContextMenuRootPrimitives
export const ContextMenuTrigger = ContextMenuTriggerPrimitives

export const DropdownMenuRoot = DropdownMenuRootPrimitives
export const DropdownMenuPortal = DropdownMenuPortalPrimitives
export const DropdownMenuTrigger = DropdownMenuTriggerPrimitives
export const DropdownMenuRadioGroup = DropdownMenuRadioGroupPrimitives
export const DropdownMenuRadioItem = DropdownMenuRadioItemPrimitives

const menuContentStyle =
  'bg-white rounded-md border border-gray-200 py-1.5 shadow-md drop-shadow-sm'
const menuItemStyle =
  'bg-white text-xs text-gray-600 focus:outline-none py-2 px-4 data-[highlighted]:bg-gray-100 data-[highlighted]:cursor-pointer flex space-x-3 font-medium'

export function MenuIcon({ children }: { children: React.ReactNode }) {
  return <span className="h-4 w-4 text-gray-950">{children}</span>
}

export const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuContentPrimitives>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuContentPrimitives>,
    'className'
  >
>(({ ...props }, ref) => (
  <ContextMenuContentPrimitives
    {...props}
    ref={ref}
    className={menuContentStyle}
  />
))
ContextMenuContent.displayName = ContextMenuContentPrimitives.displayName

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContentPrimitives>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContentPrimitives>
>(({ className, ...props }, ref) => (
  <DropdownMenuContentPrimitives
    {...props}
    ref={ref}
    className={cn(menuContentStyle, className)}
  />
))
DropdownMenuContent.displayName = DropdownMenuContentPrimitives.displayName

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuItemPrimitives>,
  React.ComponentPropsWithoutRef<typeof ContextMenuItemPrimitives>
>(({ className, ...props }, ref) => (
  <ContextMenuItemPrimitives
    {...props}
    ref={ref}
    className={cn(menuItemStyle, className)}
  />
))
ContextMenuItem.displayName = ContextMenuItemPrimitives.displayName

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItemPrimitives>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItemPrimitives>
>(({ className, ...props }, ref) => (
  <DropdownMenuItemPrimitives
    {...props}
    ref={ref}
    className={cn(menuItemStyle, className)}
  />
))
DropdownMenuItem.displayName = DropdownMenuItemPrimitives.displayName

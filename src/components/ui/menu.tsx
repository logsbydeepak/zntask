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
  'bg-white text-xs text-gray-600 focus:outline-none py-2 px-4 data-[highlighted]:bg-gray-100 data-[highlighted]:cursor-pointer '

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
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuContentPrimitives>,
    'className'
  >
>(({ ...props }, ref) => (
  <DropdownMenuContentPrimitives
    {...props}
    ref={ref}
    className={menuContentStyle}
  />
))
DropdownMenuContent.displayName = DropdownMenuContentPrimitives.displayName

export const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuItemPrimitives>,
  Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuItemPrimitives>,
    'className'
  >
>(({ ...props }, ref) => (
  <ContextMenuItemPrimitives {...props} ref={ref} className={menuItemStyle} />
))
ContextMenuItem.displayName = ContextMenuItemPrimitives.displayName

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItemPrimitives>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuItemPrimitives>,
    'className'
  >
>(({ ...props }, ref) => (
  <DropdownMenuItemPrimitives {...props} ref={ref} className={menuItemStyle} />
))
DropdownMenuItem.displayName = DropdownMenuItemPrimitives.displayName

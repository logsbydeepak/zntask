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
  SubContent as DropdownMenuSubContentPrimitives,
  Sub as DropdownMenuSubPrimitives,
  SubTrigger as DropdownMenuSubTriggerPrimitives,
  Trigger as DropdownMenuTriggerPrimitives,
} from '@radix-ui/react-dropdown-menu'

export const ContextMenuRoot = ContextMenuRootPrimitives
export const ContextMenuTrigger = ContextMenuTriggerPrimitives

export const DropdownMenuRoot = DropdownMenuRootPrimitives
export const DropdownMenuPortal = DropdownMenuPortalPrimitives
export const DropdownMenuTrigger = DropdownMenuTriggerPrimitives
export const DropdownMenuSubTrigger = DropdownMenuSubTriggerPrimitives
export const DropdownMenuSub = DropdownMenuSubPrimitives
export const DropdownMenuRadioGroup = DropdownMenuRadioGroupPrimitives

const menuContentStyle = ''

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

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSubContentPrimitives>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuSubContentPrimitives>,
    'className'
  >
>(({ ...props }, ref) => (
  <DropdownMenuSubContentPrimitives
    {...props}
    ref={ref}
    className={menuContentStyle}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuSubContentPrimitives.displayName

const menuItemStyle = ''
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

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuRadioItemPrimitives>,
  Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItemPrimitives>,
    'className'
  >
>(({ ...props }, ref) => (
  <DropdownMenuRadioItemPrimitives
    {...props}
    ref={ref}
    className={menuItemStyle}
  />
))
DropdownMenuRadioItem.displayName = DropdownMenuRadioItemPrimitives.displayName

import React from 'react'
import {
  Content as ContextMenuContentPrimitives,
  Item as ContextMenuItemPrimitives,
  Portal as ContextMenuPortalPrimitives,
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
import { cva } from 'cva'

import { cn } from '@/utils/style'

export const ContextMenuRoot = ContextMenuRootPrimitives
export const ContextMenuTrigger = ContextMenuTriggerPrimitives
export const ContextMenuPortal = ContextMenuPortalPrimitives

export const DropdownMenuRoot = DropdownMenuRootPrimitives
export const DropdownMenuPortal = DropdownMenuPortalPrimitives
export const DropdownMenuTrigger = DropdownMenuTriggerPrimitives
export const DropdownMenuRadioGroup = DropdownMenuRadioGroupPrimitives
export const DropdownMenuRadioItem = DropdownMenuRadioItemPrimitives

const menuContentStyle = cn(
  'z-40 rounded-md border border-gray-200 bg-white p-1 shadow-md drop-shadow-sm'
)

const menuItemStyle = cva({
  base: 'group/item flex items-center space-x-3 rounded-[4px] bg-white px-4 py-2 text-xs font-medium focus:outline-none data-[highlighted]:cursor-pointer',
  variants: {
    intent: {
      neutral: 'text-gray-950 data-[highlighted]:bg-gray-100',
      destructive:
        'data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700',
    },
  },
  defaultVariants: {
    intent: 'neutral',
  },
})

type MenuItemStyleProps = React.ComponentPropsWithoutRef<typeof menuItemStyle>

const menuIconStyle = cva({
  base: 'size-4 text-gray-600',
  variants: {
    intent: {
      neutral: 'text-gray-600',
      destructive:
        'group-data-[highlighted]/item:group-data-[intent=destructive]/item:text-red-700',
    },
  },
  defaultVariants: {
    intent: 'neutral',
  },
})

type MenuIconStyleProps = React.ComponentPropsWithoutRef<typeof menuIconStyle>

export function MenuIcon({
  children,
  className,
  intent,
}: {
  children: React.ReactNode
  className?: string
} & MenuIconStyleProps) {
  return (
    <span className={cn(menuIconStyle({ intent }), className)}>{children}</span>
  )
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
  React.ComponentPropsWithoutRef<typeof ContextMenuItemPrimitives> &
    MenuItemStyleProps
>(({ className, intent, ...props }, ref) => (
  <ContextMenuItemPrimitives
    {...props}
    ref={ref}
    data-intent={intent}
    className={cn(menuItemStyle({ intent }), className)}
  />
))
ContextMenuItem.displayName = ContextMenuItemPrimitives.displayName

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItemPrimitives>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItemPrimitives> &
    MenuItemStyleProps
>(({ className, intent, ...props }, ref) => (
  <DropdownMenuItemPrimitives
    {...props}
    ref={ref}
    data-intent={intent}
    className={cn(menuItemStyle({ intent }), className)}
  />
))
DropdownMenuItem.displayName = DropdownMenuItemPrimitives.displayName

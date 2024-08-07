import React from "react"
import {
  Content as ContextMenuContentPrimitives,
  Item as ContextMenuItemPrimitives,
  Portal as ContextMenuPortalPrimitives,
  Root as ContextMenuRootPrimitives,
  Trigger as ContextMenuTriggerPrimitives,
} from "@radix-ui/react-context-menu"
import {
  Content as DropdownMenuContentPrimitives,
  Item as DropdownMenuItemPrimitives,
  Portal as DropdownMenuPortalPrimitives,
  RadioGroup as DropdownMenuRadioGroupPrimitives,
  RadioItem as DropdownMenuRadioItemPrimitives,
  Root as DropdownMenuRootPrimitives,
  Trigger as DropdownMenuTriggerPrimitives,
} from "@radix-ui/react-dropdown-menu"
import { cva } from "cva"

import { cn } from "#/utils/style"

export const ContextMenuRoot = ContextMenuRootPrimitives
export const ContextMenuTrigger = ContextMenuTriggerPrimitives
export const ContextMenuPortal = ContextMenuPortalPrimitives

export const DropdownMenuRoot = DropdownMenuRootPrimitives
export const DropdownMenuPortal = DropdownMenuPortalPrimitives
export const DropdownMenuTrigger = DropdownMenuTriggerPrimitives
export const DropdownMenuRadioGroup = DropdownMenuRadioGroupPrimitives
export const DropdownMenuRadioItem = DropdownMenuRadioItemPrimitives

const menuContentStyle = cn(
  "z-40 rounded-xl border border-gray-5 bg-gray-1 p-1 drop-shadow-sm animate-in fade-in-80",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
)

const menuItemStyle = cva({
  base: "group/item flex items-center space-x-3 rounded-md bg-gray-1 px-4 py-2 text-xs font-medium focus:outline-none data-[highlighted]:cursor-pointer",
  variants: {
    intent: {
      neutral:
        "text-gray-11 data-[highlighted]:bg-gray-3 data-[highlighted]:text-gray-12",
      destructive:
        "text-gray-11 data-[highlighted]:bg-red-3 data-[highlighted]:text-red-11",
    },
  },
  defaultVariants: {
    intent: "neutral",
  },
})

type MenuItemStyleProps = React.ComponentPropsWithoutRef<typeof menuItemStyle>

const menuIconStyle = cva({
  base: "size-4 text-gray-11",
  variants: {
    intent: {
      neutral: "text-gray-11 data-[highlighted]:text-gray-12",
      destructive:
        "group-data-[highlighted]/item:group-data-[intent=destructive]/item:text-red-11",
    },
  },
  defaultVariants: {
    intent: "neutral",
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
    "className"
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

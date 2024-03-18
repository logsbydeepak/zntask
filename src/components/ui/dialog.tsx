import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { cn } from '@/utils/style'

export const Root = Dialog.Root
export const Close = Dialog.Close

export const Portal = ({ children, ...props }: Dialog.DialogPortalProps) => (
  <Dialog.Portal>
    <Dialog.Overlay
      {...props}
      className={cn(
        'fixed inset-0 z-30 bg-gray-1/50 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
      )}
    />
    {children}
  </Dialog.Portal>
)

export const Content = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentProps<typeof Dialog.Content>
>(({ children, className, ...props }, ref) => (
  <Dialog.Content
    {...props}
    ref={ref}
    className={cn(
      'fixed bottom-0 z-50 w-full rounded-t-xl border border-gray-4 bg-gray-1 p-6 drop-shadow-xl duration-1000',
      'sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[420px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:drop-shadow-sm',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%] sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]',
      'data-[state=closed]:slide-out-to-bottom-1/2 data-[state=open]:slide-in-from-bottom-1/2',
      className
    )}
  >
    {children}
  </Dialog.Content>
))
Content.displayName = Dialog.Content.displayName

export const Title = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentProps<typeof Dialog.Title>
>(({ children, className, ...props }, ref) => (
  <Dialog.Title
    {...props}
    ref={ref}
    className={cn('text-lg font-medium text-gray-12', className)}
  >
    {children}
  </Dialog.Title>
))
Title.displayName = Dialog.Title.displayName

export const Description = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentProps<typeof Dialog.Description>
>(({ children, className, ...props }, ref) => (
  <Dialog.Description
    {...props}
    ref={ref}
    className={cn('text-sm text-gray-11', className)}
  >
    {children}
  </Dialog.Description>
))
Description.displayName = Dialog.Description.displayName

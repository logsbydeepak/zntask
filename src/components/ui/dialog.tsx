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
        'fixed inset-0 z-30 bg-white/80 bg-opacity-50 backdrop-blur-sm'
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
      'fixed bottom-0 z-40 w-full transform rounded-none rounded-t-xl border-t border-gray-200 bg-white p-4 shadow-2xl drop-shadow-2xl sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[400px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md sm:border sm:p-6 sm:shadow-lg sm:drop-shadow-sm',
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
    className={cn('text-lg font-medium text-gray-900', className)}
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
    className={cn('text-sm text-gray-500', className)}
  >
    {children}
  </Dialog.Description>
))
Description.displayName = Dialog.Description.displayName

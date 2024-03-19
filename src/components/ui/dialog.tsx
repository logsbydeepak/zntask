import React from 'react'
import {
  Close as DialogClosePrimitive,
  Content as DialogContentPrimitive,
  Description as DialogDescriptionPrimitive,
  Overlay as DialogOverlayPrimitive,
  Portal as DialogPortalPrimitive,
  Root as DialogRootPrimitive,
  Title as DialogTitlePrimitive,
} from '@radix-ui/react-dialog'

import { cn } from '@/utils/style'

const DialogClose = DialogClosePrimitive

const DialogRoot = ({
  children,
  ...props
}: React.ComponentProps<typeof DialogRootPrimitive>) => (
  <DialogRootPrimitive {...props}>
    <DialogPortalPrimitive>
      <DialogOverlayPrimitive
        {...props}
        className="fixed inset-0 z-30 bg-gray-1/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />

      {children}
    </DialogPortalPrimitive>
  </DialogRootPrimitive>
)

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContentPrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogContentPrimitive>
>(({ children, className, ...props }, ref) => (
  <DialogContentPrimitive
    {...props}
    ref={ref}
    className={cn(
      'fixed bottom-0 z-50 w-full rounded-t-xl border border-gray-3 bg-gray-1 p-6 drop-shadow-xl duration-1000',
      'sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[420px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:drop-shadow-sm',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%] sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]',
      'data-[state=closed]:slide-out-to-bottom-1/2 data-[state=open]:slide-in-from-bottom-1/2',
      className
    )}
  >
    {children}
  </DialogContentPrimitive>
))
DialogContent.displayName = DialogContentPrimitive.displayName

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitlePrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogTitlePrimitive>
>(({ children, className, ...props }, ref) => (
  <DialogTitlePrimitive
    {...props}
    ref={ref}
    className={cn('text-lg font-medium text-gray-12', className)}
  >
    {children}
  </DialogTitlePrimitive>
))
DialogTitle.displayName = DialogTitlePrimitive.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogDescriptionPrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogDescriptionPrimitive>
>(({ children, className, ...props }, ref) => (
  <DialogDescriptionPrimitive
    {...props}
    ref={ref}
    className={cn('text-sm text-gray-11', className)}
  >
    {children}
  </DialogDescriptionPrimitive>
))
DialogDescription.displayName = DialogDescriptionPrimitive.displayName

export {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
}

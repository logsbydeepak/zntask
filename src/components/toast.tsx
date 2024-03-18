'use client'

import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { CheckIcon, XIcon } from 'lucide-react'

import { Toast, useToastStore } from '@/store/toast'
import { cn } from '@/utils/style'

import { ExclamationIcon } from './icon/exclamation'

export function ToastProvider() {
  const toast = useToastStore((s) => s.toasts)

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toast.map((t) => (
        <Item key={t.id} toast={t} />
      ))}

      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 w-[340px] space-y-3 pb-5 pr-5" />
    </ToastPrimitive.Provider>
  )
}

function Item({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast)

  const isError = toast.type === 'error'
  const isSuccess = toast.type === 'success'

  return (
    <ToastPrimitive.Root
      onOpenChange={() => removeToast(toast.id)}
      className="ToastRoot relative rounded-lg border border-gray-3 bg-gray-1 shadow-md shadow-gray-12/5"
    >
      <div className="flex items-center space-x-2 p-4">
        <div>
          {isError && (
            <Icon className="bg-red-7">
              <ExclamationIcon />
            </Icon>
          )}

          {isSuccess && (
            <Icon className="bg-green-8">
              <CheckIcon strokeWidth={3} />
            </Icon>
          )}
        </div>

        <ToastPrimitive.Description className="text-[13px] font-medium text-gray-11">
          {toast.message}
        </ToastPrimitive.Description>
      </div>

      <ToastPrimitive.Close className="absolute right-1.5 top-1.5 text-gray-10 hover:text-gray-12">
        <XIcon className="size-3.5" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ children, ...props }, ref) => (
  <button
    ref={ref}
    className="size-full px-6 hover:bg-gray-2 hover:text-gray-12"
    {...props}
  >
    {children}
  </button>
))
Button.displayName = 'ToastButton'

function Icon({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        ' flex size-4 items-center justify-center rounded-full text-white',
        className
      )}
    >
      <div className="size-2.5">{children}</div>
    </div>
  )
}

'use client'

import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { AlertCircle, CheckCheckIcon } from 'lucide-react'

import { Toast, useToastStore } from '@/store/toast'
import { cn } from '@/utils/style'

export function ToastProvider() {
  const toast = useToastStore((s) => s.toasts)

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toast.map((t) => (
        <Item key={t.id} toast={t} />
      ))}

      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 w-96 space-y-3 pb-3 pr-3" />
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
      className="flex justify-between rounded-md border border-gray-200 bg-white shadow-sm drop-shadow-sm"
    >
      <div className="flex py-4 pl-5">
        <div className="mr-3">
          {isError && (
            <Icon className="bg-red-700 text-red-50">
              <AlertCircle className="h-full w-full" strokeWidth={2.5} />
            </Icon>
          )}

          {isSuccess && (
            <Icon className="bg-green-700 text-green-50">
              <CheckCheckIcon className="h-full w-full" strokeWidth={2.5} />
            </Icon>
          )}
        </div>

        <div>
          <ToastPrimitive.Title className="text-sm font-medium">
            {isError && 'Error'}
            {isSuccess && 'Success'}
          </ToastPrimitive.Title>
          <ToastPrimitive.Description className="text-sm text-gray-600">
            {toast.message}
          </ToastPrimitive.Description>
        </div>
      </div>

      <div className="flex flex-col border-l border-gray-200 text-xs font-medium text-gray-600">
        <ToastPrimitive.Close asChild>
          <Button>close</Button>
        </ToastPrimitive.Close>
        {toast.action && (
          <>
            <div className="border-t border-gray-200" />
            <ToastPrimitive.Action
              onClick={toast.action.onClick}
              altText={toast.action.label}
              asChild
            >
              <Button>{toast.action.label}</Button>
            </ToastPrimitive.Action>
          </>
        )}
      </div>
    </ToastPrimitive.Root>
  )
}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ children, ...props }, ref) => (
  <button
    ref={ref}
    className="h-full w-full px-6 hover:bg-gray-50 hover:text-gray-950"
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
    <div className={cn('mt-0.5 rounded-full p-1', className)}>
      <div className="h-3 w-3">{children}</div>
    </div>
  )
}

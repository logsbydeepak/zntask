'use client'

import React from 'react'

import { Toast, useToastStore } from '@/store/toast'
import * as ToastPrimitive from '@radix-ui/react-toast'

export function ToastProvider() {
  const toast = useToastStore((s) => s.toasts)

  React.useEffect(() => {
    console.log(toast)
  }, [toast])

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toast.map((t) => (
        <Item key={t.id} toast={t} />
      ))}

      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 w-60 space-y-3 pb-3 pr-3" />
    </ToastPrimitive.Provider>
  )
}

function Item({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <ToastPrimitive.Root
      onOpenChange={() => removeToast(toast.id)}
      className="rounded-md border border-gray-100 bg-white px-4 py-2.5 shadow-sm drop-shadow-sm"
    >
      <ToastPrimitive.Title className="text-sm font-medium">
        {toast.title}
      </ToastPrimitive.Title>
      <ToastPrimitive.Description className="text-xs text-gray-500">
        {toast.description}
      </ToastPrimitive.Description>
    </ToastPrimitive.Root>
  )
}

import React from 'react'

import { cn } from '@/utils/style'

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      className={cn(
        'mr-2 inline-flex items-center space-x-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-50 hover:text-gray-950',
        className
      )}
    />
  )
})
Button.displayName = 'Badge.Button'

export function Icon({ children }: { children: React.ReactNode }) {
  return <span className="grid h-3 w-3 place-content-center">{children}</span>
}

export function Label({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn('text-xs font-medium', className)}>{children}</span>
  )
}

import React from 'react'
import { LoaderIcon } from 'lucide-react'

import { cn } from '@/utils/style'

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & { isLoading?: boolean }
>(({ className, isLoading, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      data-loading={isLoading}
      type="button"
      className={cn(
        'group mr-2 inline-flex items-center space-x-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-950 data-[state=open]:bg-gray-50 data-[state=open]:text-gray-950',
        className
      )}
    />
  )
})
Button.displayName = 'Badge.Button'

export function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-3 flex-shrink-0 place-content-center">
      {children}
    </span>
  )
}

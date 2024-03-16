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
        'group mr-2 inline-flex items-center space-x-1 rounded-full border border-newGray-4 px-3 py-1 text-xs font-medium text-newGray-11 hover:bg-newGray-2 hover:text-newGray-12 data-[state=open]:bg-newGray-2 data-[state=open]:text-newGray-12',
        className
      )}
    />
  )
})
Button.displayName = 'Badge.Button'

export function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-3 shrink-0 place-content-center">
      {children}
    </span>
  )
}

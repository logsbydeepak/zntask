import React from 'react'
import { cva, type VariantProps } from 'cva'
import { LoaderIcon } from 'lucide-react'

import { cn } from '@/utils/style'

export const buttonStyle = cva({
  base: 'rounded-md px-4 py-2.5 text-white text-sm font-medium border border-transparent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2 flex justify-center items-center',
  variants: {
    intent: {
      primary:
        'bg-orange-600 focus-visible:ring-orange-700 disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200',
      secondary:
        'border-gray-200 focus-visible:ring-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-700 disabled:border-gray-200 text-gray-600',
      destructive: 'bg-red-600 focus-visible:ring-red-600',
    },
  },
  defaultVariants: {
    intent: 'primary',
  },
})

type ButtonStyleProps = VariantProps<typeof buttonStyle>

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    ButtonStyleProps & { isLoading?: boolean }
>(({ children, intent, className, isLoading = false, ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    className={cn(buttonStyle({ intent }), className)}
  >
    {children}
    {isLoading && <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />}
  </button>
))
Button.displayName = 'Button'

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ children, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className="group flex items-center space-x-2 rounded-md px-1.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-950"
    >
      {children}
    </button>
  )
})
ActionButton.displayName = 'ActionButton'

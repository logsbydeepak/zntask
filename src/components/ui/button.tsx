import React from 'react'
import { cva, type VariantProps } from 'cva'
import { LoaderIcon } from 'lucide-react'

import { cn } from '@/utils/style'

export const buttonStyle = cva({
  base: 'flex items-center justify-center space-x-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  variants: {
    intent: {
      primary:
        'bg-orange-600 focus-visible:ring-orange-700 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-700',
      secondary:
        'border-gray-200 bg-white text-gray-600 focus-visible:ring-gray-900 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-700',
      destructive: 'bg-red-600 focus-visible:ring-red-600',
      ghost:
        'rounded-md px-1.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:ring-gray-900 focus-visible:ring-offset-0',
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
    {isLoading && <LoaderIcon className="ml-2 size-4 animate-spin" />}
  </button>
))
Button.displayName = 'Button'

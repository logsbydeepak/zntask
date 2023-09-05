import React from 'react'
import { cva, type VariantProps } from 'cva'

import { cn } from '@/utils/style'

export const buttonStyle = cva({
  base: 'rounded-md px-4 py-2.5 text-white text-sm font-medium border border-transparent focus:ring-2 focus:outline-none focus:ring-offset-2',
  variants: {
    intent: {
      primary: 'bg-orange-600 focus:ring-orange-700',
      secondary: 'border-gray-200 text-gray-950 focus:ring-gray-900 bg-white',
      destructive: 'bg-red-600 focus:ring-red-600',
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
  </button>
))
Button.displayName = 'Button'

import React from 'react'
import { cva, type VariantProps } from 'cva'

import { cn } from '@/utils/style'

export const buttonStyle = cva({
  base: 'rounded-md px-4 py-2.5 text-white text-sm font-medium',
  variants: {
    intent: {
      primary: 'bg-orange-600',
      secondary: 'bg-gray-600',
      destructive: 'bg-red-600',
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

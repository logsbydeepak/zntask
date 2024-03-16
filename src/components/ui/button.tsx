import React from 'react'
import { cva, type VariantProps } from 'cva'
import { LoaderIcon } from 'lucide-react'

import { cn } from '@/utils/style'

export const buttonStyle = cva({
  base: 'flex items-center justify-center space-x-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-newGray-12 ring-offset-newGray-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  variants: {
    intent: {
      primary:
        'bg-newOrange-9 text-[#ffffff] focus-visible:ring-newOrange-6 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-700',
      secondary:
        'border-newGray-3 bg-newGray-1 text-newGray-11 focus-visible:ring-newGray-6 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-700',
      destructive: 'bg-red-600 focus-visible:ring-red-600',
      ghost:
        'rounded-md px-1.5 py-1 text-xs font-medium text-newGray-11 hover:bg-newGray-3 hover:text-newGray-12 focus-visible:ring-newGray-6 focus-visible:ring-offset-0',
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

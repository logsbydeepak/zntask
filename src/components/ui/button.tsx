import React from "react"
import { cva, type VariantProps } from "cva"
import { LoaderIcon } from "lucide-react"

import { cn } from "#/utils/style"

export const buttonStyle = cva({
  base: "flex items-center justify-center space-x-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-gray-12 ring-offset-gray-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  variants: {
    intent: {
      primary:
        "bg-orange-9 text-white focus-visible:ring-orange-9 disabled:border-gray-4 disabled:bg-gray-4 disabled:text-gray-10 dark:focus-visible:ring-orange-6",
      secondary:
        "border-gray-3 bg-gray-1 text-gray-11 focus-visible:ring-black disabled:border-gray-4 disabled:bg-gray-4 disabled:text-gray-10 dark:focus-visible:ring-gray-6",
      destructive: "bg-red-9 text-white focus-visible:ring-red-6",
      ghost:
        "rounded-md px-1.5 py-1 text-xs font-medium text-gray-11 hover:bg-gray-3 hover:text-gray-12 focus-visible:ring-gray-6 focus-visible:ring-offset-0",
    },
  },
  defaultVariants: {
    intent: "primary",
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
Button.displayName = "Button"

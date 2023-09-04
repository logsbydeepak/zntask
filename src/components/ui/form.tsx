import React, { FieldsetHTMLAttributes } from 'react'
import { CircleIcon, XCircleIcon } from 'lucide-react'

import { cn } from '@/utils/style'

export const Root = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ children, className, ...props }, ref) => (
  <form {...props} ref={ref} className={cn('block', className)}>
    {children}
  </form>
))
Root.displayName = 'Form.Root'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      'mt-0.5 w-full rounded-md border border-gray-300 py-1.5 text-sm shadow-sm',
      'placeholder:font-normal placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-600',
      className
    )}
    {...props}
    ref={ref}
  />
))
Input.displayName = 'Form.Input'

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ children, ...props }, ref) => (
  <label {...props} ref={ref} className="text-sm">
    {children}
  </label>
))
Label.displayName = 'Form.Label'

export const Error = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => (
  <p
    {...props}
    ref={ref}
    className="mt-2 inline-flex items-center rounded-full bg-red-50 px-2 text-xs font-medium text-red-700"
  >
    <span className="mr-1 h-2 w-2">
      <XCircleIcon className="h-full w-full" strokeWidth={3} />
    </span>
    {children}
  </p>
))
Error.displayName = 'Form.Error'

export function Fieldset({
  children,
  ...props
}: FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return <fieldset {...props}>{children}</fieldset>
}

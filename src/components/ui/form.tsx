import React, { FieldsetHTMLAttributes } from 'react'
import { cva } from 'cva'
import { XCircleIcon } from 'lucide-react'

import { cn } from '@/utils/style'

export const Root = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ children, className, ...props }, ref) => (
  <form {...props} ref={ref} className={cn('w-full', className)}>
    {children}
  </form>
))
Root.displayName = 'Form.Root'

export const formInputStyle = cva({
  base: [
    'mb-2 mt-0.5 w-full rounded-md border border-newGray-4 px-3 py-1  disabled:text-newGray-9',
    'placeholder:text-sm placeholder:text-newGray-11 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-newOrange-9',
  ],
})

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} {...props} className={cn(formInputStyle(), className)} />
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
  <>
    {children && (
      <p
        {...props}
        ref={ref}
        className="inline-flex items-center rounded-full bg-newRed-2 px-2 py-0.5 text-xs font-medium text-newRed-11"
      >
        <span className="mr-1 size-2">
          <XCircleIcon strokeWidth={3} />
        </span>
        {children}
      </p>
    )}
  </>
))
Error.displayName = 'Form.Error'

export function Fieldset({
  children,
  ...props
}: FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return <fieldset {...props}>{children}</fieldset>
}

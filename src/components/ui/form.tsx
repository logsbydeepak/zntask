import React, { FieldsetHTMLAttributes } from 'react'

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
    className={cn('block w-full rounded-md', className)}
    {...props}
    ref={ref}
  />
))
Input.displayName = 'Form.Input'

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ children, ...props }, ref) => (
  <label {...props} ref={ref}>
    {children}
  </label>
))
Label.displayName = 'Form.Label'

export const Error = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => (
  <p {...props} ref={ref}>
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

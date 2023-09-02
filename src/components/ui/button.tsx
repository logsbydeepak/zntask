import React from 'react'

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button {...props} ref={ref}>
    {children}
  </button>
))
Button.displayName = 'Button'

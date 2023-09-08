import React from 'react'
import Link from 'next/link'
import {
  CheckCircleIcon,
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
} from 'lucide-react'

import { GoogleIcon } from '@/components/icon/google'
import { LogoIcon } from '@/components/icon/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/style'

export function FormContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center px-10 pt-10', className)}>
      {children}
    </div>
  )
}

export function ActionContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 px-10 py-5 md:mt-10 md:border-t md:border-gray-100 md:bg-gray-50 md:py-10">
      {children}
    </div>
  )
}

export function Logo() {
  return (
    <div className="mb-4 rounded-full bg-orange-600 p-3">
      <div className="h-4 w-4">
        <LogoIcon className="h-full w-full text-white" />
      </div>
    </div>
  )
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text text-center text-xl font-medium">{children}</h1>
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-sm text-gray-500">{children}</p>
}

export function ContinueWithGoogle({
  isLoading = false,
}: {
  isLoading?: boolean
}) {
  return (
    <Button
      className="flex w-full items-center justify-center"
      intent="secondary"
      isLoading={isLoading}
    >
      <div className="mr-2 h-5 w-5 ">
        <GoogleIcon />
      </div>
      <span>Continue with Google</span>
    </Button>
  )
}

export function ResetPassword({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="mr-2 inline-flex items-center rounded-full bg-orange-600 px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-1"
    >
      <span className="mr-1 h-2 w-2 text-white">
        <KeyIcon className="h-full w-full" strokeWidth={3} />
      </span>
      <span className="text-xs font-medium text-white">reset password</span>
    </button>
  )
}

export function PasswordVisibilityToggle({
  isVisible,
  onClick,
}: {
  isVisible: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="mr-2 inline-flex items-center rounded-full bg-orange-600 px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-1"
    >
      <span className="mr-1 h-2 w-2 text-white">
        {!isVisible ? (
          <EyeIcon className="h-full w-full" strokeWidth={3} />
        ) : (
          <EyeOffIcon className="h-full w-full" strokeWidth={3} />
        )}
      </span>
      <span className="text-xs font-medium text-white">
        {!isVisible ? 'show Password' : 'hide password'}
      </span>
    </button>
  )
}

function AccountQuestionContainer({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

function AccountQuestionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-sm text-gray-500">{children}</p>
}

function AccountQuestionAction({
  children,
  disabled = false,
  href,
  ...props
}: {
  children: React.ReactNode
  disabled?: boolean
} & React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      {...props}
      aria-disabled={disabled}
      href={disabled ? '#' : href}
      className="font-medium text-gray-700 hover:text-orange-600 hover:underline aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:text-gray-500"
    >
      {children}
    </Link>
  )
}

export const AccountQuestion = {
  Container: AccountQuestionContainer,
  Title: AccountQuestionTitle,
  Action: AccountQuestionAction,
}

export const passwordChecklist = [
  {
    label: '8 characters',
    condition: (value: string) => value.length >= 8,
  },
  {
    label: 'lowercase',
    condition: (value: string) => /[a-z]/.test(value),
  },
  {
    label: 'uppercase',
    condition: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: 'numbers',
    condition: (value: string) => /[0-9]/.test(value),
  },
  {
    label: 'symbols',
    condition: (value: string) => /[^a-zA-Z0-9]/.test(value),
  },
]

export function PasswordChecklistItem({
  children,
  isValid,
}: {
  children: React.ReactNode
  isValid: boolean
}) {
  return (
    <div
      className={cn(
        'mr-2 mt-2 inline-block rounded-full border border-gray-200 px-2 py-0.5',
        isValid && 'border-gray-100 bg-gray-50'
      )}
    >
      <div className="flex items-center">
        <span className="mr-1 h-2 w-2 text-gray-500">
          {isValid ? (
            <CheckCircleIcon className="h-full w-full" strokeWidth={3} />
          ) : (
            <CircleIcon className="h-full w-full" strokeWidth={3} />
          )}
        </span>

        <p className={cn('text-xs font-medium text-gray-500')}>{children}</p>
      </div>
    </div>
  )
}

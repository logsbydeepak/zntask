import React from 'react'
import Link from 'next/link'
import {
  AsteriskIcon,
  CheckCheckIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  LockIcon,
  SpellCheck2,
  SpellCheck2Icon,
  TextIcon,
  TypeIcon,
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
  onClick,
}: {
  isLoading?: boolean
  onClick?: () => void
}) {
  return (
    <Button
      className="flex w-full items-center justify-center"
      intent="secondary"
      isLoading={isLoading}
      onClick={onClick}
    >
      <div className="mr-2 h-5 w-5 ">
        <GoogleIcon />
      </div>
      <span>Continue with Google</span>
    </Button>
  )
}

function BadgeButton({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      {...props}
      className="inline-flex items-center space-x-1 rounded-full bg-gray-50 px-3 py-0.5 text-xs font-medium text-gray-600 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-1"
    >
      {children}
    </button>
  )
}
function BadgeButtonIcon({ children }: { children: React.ReactNode }) {
  return <span className="h-2 w-2">{children}</span>
}

export function ResetPassword({ onClick }: { onClick: () => void }) {
  return (
    <BadgeButton onClick={onClick} type="button">
      <BadgeButtonIcon>
        <LockIcon strokeWidth={3} />
      </BadgeButtonIcon>
      <p>reset password</p>
    </BadgeButton>
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
    <BadgeButton type="button" onClick={onClick}>
      <BadgeButtonIcon>
        {!isVisible ? (
          <TypeIcon strokeWidth={3} />
        ) : (
          <AsteriskIcon strokeWidth={3} />
        )}
      </BadgeButtonIcon>
      <p>{!isVisible ? 'show password' : 'hide password'}</p>
    </BadgeButton>
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
    <div className="inline-flex items-center space-x-1 text-xs text-gray-500">
      <span className="inline-block h-2 w-2">
        {isValid ? (
          <CheckIcon strokeWidth={3} />
        ) : (
          <CircleIcon strokeWidth={3} />
        )}
      </span>

      <p>{children}</p>
    </div>
  )
}

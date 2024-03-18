import React from 'react'
import Link from 'next/link'
import {
  AsteriskIcon,
  CheckIcon,
  CircleIcon,
  LockIcon,
  TypeIcon,
} from 'lucide-react'

import { GoogleIcon } from '@/components/icon/google'
import { LogoIcon } from '@/components/icon/logo'
import { Button } from '@/components/ui/button'

export function Logo() {
  return (
    <Link
      className="mb-2 flex size-10 items-center justify-center rounded-full bg-orange-9 p-3 text-white"
      href="/"
    >
      <LogoIcon className="size-4" />
    </Link>
  )
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-center text-xl font-medium">{children}</h1>
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-sm text-gray-11">{children}</p>
}

export function Separator() {
  return <div className="w-full border-b border-dashed border-gray-4" />
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
      className="w-full"
      intent="secondary"
      isLoading={isLoading}
      onClick={onClick}
    >
      <GoogleIcon className="size-5" />
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
      className="inline-flex items-center space-x-1 rounded-full bg-gray-2 px-3 py-0.5 text-xs font-medium text-gray-11 ring-offset-gray-1 hover:text-gray-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-9 focus-visible:ring-offset-1"
    >
      {children}
    </button>
  )
}
function BadgeButtonIcon({ children }: { children: React.ReactNode }) {
  return <span className="size-2">{children}</span>
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
  return <div className="text-sm text-gray-11">{children}</div>
}

function AccountQuestionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-center">{children}</p>
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
      className="font-medium text-gray-11 hover:text-orange-9 hover:underline aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:text-gray-9"
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
    <div className="inline-flex items-center space-x-1 text-xs text-gray-10">
      <span className="inline-block size-2">
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

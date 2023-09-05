import Link from 'next/link'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { GoogleIcon } from '@/components/icon/google'
import { LogoIcon } from '@/components/icon/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/style'

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-full border-gray-100 md:w-[500px] md:rounded-md md:border md:shadow-sm md:drop-shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

export function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-10 pt-10">{children}</div>
  )
}

export function ActionContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 space-y-4 border-t border-gray-100 bg-gray-50 px-10 py-10">
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

export function ContinueWithGoogle() {
  return (
    <Button
      className="flex w-full items-center justify-center"
      intent="secondary"
    >
      <div className="mr-2 h-5 w-5">
        <GoogleIcon />
      </div>
      <span>Continue with Google</span>
    </Button>
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
  ...props
}: { children: React.ReactNode } & React.ComponentPropsWithoutRef<
  typeof Link
>) {
  return (
    <Link
      {...props}
      className="font-medium text-gray-700 hover:text-orange-600 hover:underline"
    >
      Login
    </Link>
  )
}

export const AccountQuestion = {
  Container: AccountQuestionContainer,
  Title: AccountQuestionTitle,
  Action: AccountQuestionAction,
}

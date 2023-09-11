'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { atom, Provider, useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  AccountQuestion,
  ContinueWithGoogle,
  PasswordVisibilityToggle,
  ResetPassword,
} from '@/app/(application)/(auth)/components'
import { Head } from '@/components/head'
import { useToastStore } from '@/store/toast'
import { Button } from '@ui/button'
import * as FormPrimitive from '@ui/form'

import { loginWithCredentials, resetPassword } from './actions'
import { resetPasswordSchema, schema } from './utils'

const isLoadingAtom = atom(false)
type FormValues = z.infer<typeof schema>

export function Form() {
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)

  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    React.useState(false)
  const startTransition = React.useTransition()[1]
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isCredentialLoginLoading, setIsCredentialLoginLoading] =
    React.useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: FormValues) => {
    setIsLoading(true)
    setIsCredentialLoginLoading(true)

    startTransition(async () => {
      setTimeout(async () => {
        const res = await loginWithCredentials(values)
        if (res.code === 'INVALID_CREDENTIALS') {
          setError(
            'password',
            {
              message: 'invalid credentials',
            },
            { shouldFocus: true }
          )
          setError(
            'email',
            {
              message: 'invalid credentials',
            },
            { shouldFocus: true }
          )
        }

        if (res.code === 'OK') {
          addToast({
            message: 'You are now logged in',
            type: 'success',
          })
          router.push('/')
        }

        setIsLoading(false)
        setIsCredentialLoginLoading(false)
      }, 2000)
    })
  }

  return (
    <>
      <FormPrimitive.Root onSubmit={handleSubmit(onSubmit)}>
        <FormPrimitive.Fieldset disabled={isLoading}>
          <div className="my-8 space-y-4">
            <div>
              <FormPrimitive.Label htmlFor="email">Email</FormPrimitive.Label>
              <FormPrimitive.Input
                id="email"
                autoFocus
                {...register('email')}
                placeholder="abc@domain.com"
              />
              {errors.email && (
                <FormPrimitive.Error>
                  {errors.email?.message}
                </FormPrimitive.Error>
              )}
            </div>

            <div>
              <FormPrimitive.Label htmlFor="password">
                Password
              </FormPrimitive.Label>
              <FormPrimitive.Input
                id="password"
                {...register('password')}
                placeholder="********"
                type={isPasswordVisible ? 'text' : 'password'}
              />

              <div>
                <PasswordVisibilityToggle
                  isVisible={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
                <ResetPassword
                  onClick={() => setIsResetPasswordDialogOpen(true)}
                />
                {errors.password && (
                  <FormPrimitive.Error>
                    {errors.password?.message}
                  </FormPrimitive.Error>
                )}
              </div>
            </div>
          </div>
          <Button className="w-full" isLoading={isCredentialLoginLoading}>
            Login
          </Button>
        </FormPrimitive.Fieldset>
      </FormPrimitive.Root>
      <ResetPasswordDialog
        isOpen={isResetPasswordDialogOpen}
        setIsOpen={setIsResetPasswordDialogOpen}
      />
    </>
  )
}

export function StateProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}

export function Action() {
  const startTransition = React.useTransition()[1]
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const [isGoogleLoginLoading, setIsGoogleRegisterLoading] =
    React.useState(false)

  const onClick = () => {
    setIsLoading(true)
    setIsGoogleRegisterLoading(true)
  }
  return (
    <>
      <fieldset disabled={isLoading}>
        <ContinueWithGoogle isLoading={isGoogleLoginLoading} />
      </fieldset>
      <AccountQuestion.Container>
        <AccountQuestion.Title>
          Already have an account?{' '}
          <AccountQuestion.Action href="/register" disabled={isLoading}>
            Register
          </AccountQuestion.Action>
        </AccountQuestion.Title>
      </AccountQuestion.Container>
    </>
  )
}

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

function ResetPasswordDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [isPending, startTransition] = React.useTransition()

  const handleClose = () => {
    if (isPending) return
    setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-white/80 bg-opacity-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-md border border-gray-200 bg-white p-6 shadow-2xl drop-shadow-sm">
          <ResetPasswordDialogContent
            handleClose={handleClose}
            isPending={isPending}
            startTransition={startTransition}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function ResetPasswordDialogContent({
  handleClose,
  isPending,
  startTransition,
}: {
  handleClose: () => void
  isPending: boolean
  startTransition: React.TransitionStartFunction
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })
  const addToast = useToastStore((s) => s.addToast)

  const onSubmit = (values: ResetPasswordFormValues) => {
    startTransition(async () => {
      const res = await resetPassword(values)
      switch (res.code) {
        case 'OK':
          addToast({
            message: 'Please check your email',
            type: 'success',
          })
          handleClose()

        case 'EMAIL_ALREADY_SENT':
          setError(
            'email',
            {
              message: 'Email already sent',
            },
            {
              shouldFocus: true,
            }
          )

        case 'INVALID_CREDENTIALS':
          setError(
            'email',
            {
              message: 'Invalid credentials',
            },
            { shouldFocus: true }
          )
          break
      }
    })
  }

  return (
    <>
      <Head title="Reset Password" />
      <FormPrimitive.Root
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <Dialog.Title className="text text-lg font-medium">
            Reset Password
          </Dialog.Title>
          <Dialog.Description className="text-xs text-gray-500">
            Enter your email to reset password
          </Dialog.Description>
        </div>
        <div>
          <FormPrimitive.Label htmlFor="email">Email</FormPrimitive.Label>
          <FormPrimitive.Input
            id="email"
            {...register('email')}
            placeholder="abc@domain.com"
          />
          {errors.email && (
            <FormPrimitive.Error>{errors.email?.message}</FormPrimitive.Error>
          )}
        </div>

        <fieldset className="flex space-x-4" disabled={isPending}>
          <Dialog.Close asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </Dialog.Close>
          <Button className="w-full" isLoading={isPending}>
            Submit
          </Button>
        </fieldset>
      </FormPrimitive.Root>
    </>
  )
}

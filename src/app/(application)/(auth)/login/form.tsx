'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { atom, Provider, useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  AccountQuestion,
  ContinueWithGoogle,
  PasswordVisibilityToggle,
  ResetPassword,
} from '@/app/(application)/(auth)/components'
import { ResetPasswordDialog } from '@/components/dialogs/reset-password'
import { Button } from '@/components/ui/button'
import * as FormPrimitive from '@/components/ui/form'
import { loginWithCredentials } from '@/data/auth'
import { zLoginWithCredentials } from '@/data/utils/zSchema'
import { toast } from '@/store/toast'

const isLoadingAtom = atom(false)
type FormValues = z.infer<typeof zLoginWithCredentials>

export function Form() {
  const router = useRouter()

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
    resolver: zodResolver(zLoginWithCredentials),
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
          toast.success('You are now logged in')
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

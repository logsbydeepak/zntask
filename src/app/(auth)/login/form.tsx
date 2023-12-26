'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  AccountQuestion,
  ContinueWithGoogle,
  PasswordVisibilityToggle,
  ResetPassword,
  Separator,
} from '@/app/(auth)/components'
import { ResetPasswordDialog } from '@/components/dialogs/reset-password'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import * as FormPrimitive from '@/components/ui/form'
import {
  loginWithCredentials,
  loginWithGoogle,
  redirectGoogleLogin,
} from '@/data/auth'
import { zLoginWithCredentials } from '@/data/utils/zSchema'

type FormValues = z.infer<typeof zLoginWithCredentials>

export function Form() {
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const [isGoogleLoading, setIsGoogleLoading] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return !!window.localStorage.getItem('googleCode')
  })
  const [alertMessage, setAlertMessage] = React.useState('')

  const [isCredentialPending, startLoginWithCredentials] = React.useTransition()
  const [isGooglePending, startLoginWithGoogle] = React.useTransition()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(zLoginWithCredentials),
  })

  const isLoading = isCredentialPending || isGooglePending || isGoogleLoading

  const defaultError = () => {
    setAlertMessage('Something went wrong!')
  }

  const handleGoogleCode = React.useCallback(() => {
    const code = window.localStorage.getItem('googleCode')
    if (!code) return
    window.localStorage.removeItem('googleCode')
    startLoginWithGoogle(async () => {
      try {
        const res = await loginWithGoogle({ code })
        const resCode = res?.code

        if (resCode === 'INVALID_CREDENTIALS') {
          setAlertMessage('User not found')
        }
      } catch (error) {
        defaultError()
      }
    })
  }, [])

  const handleLoginWithCredentials = (values: FormValues) => {
    if (isLoading) return
    startLoginWithCredentials(async () => {
      try {
        const res = await loginWithCredentials(values)
        const resCode = res?.code

        if (resCode === 'INVALID_CREDENTIALS') {
          setAlertMessage('Invalid credentials')
        }
      } catch (error) {
        defaultError()
      }
    })
  }

  const handleLoginWithGoogle = () => {
    if (isLoading) return
    startLoginWithGoogle(async () => {
      try {
        await redirectGoogleLogin()
      } catch (error) {
        defaultError()
      }
    })
  }

  React.useEffect(() => {
    handleGoogleCode()
  }, [handleGoogleCode])

  React.useEffect(() => {
    if (isLoading) setAlertMessage('')
  }, [isLoading])

  React.useEffect(() => {
    if (errors) setAlertMessage('')
  }, [errors])

  React.useEffect(() => {
    setIsGoogleLoading(isGooglePending)
  }, [isGooglePending])

  return (
    <>
      {alertMessage && <Alert align="center">{alertMessage}</Alert>}
      <div className="w-full space-y-3">
        <fieldset disabled={isLoading}>
          <ContinueWithGoogle
            isLoading={isGooglePending || isGoogleLoading}
            onClick={handleLoginWithGoogle}
          />
        </fieldset>
      </div>
      <Separator />
      <FormPrimitive.Root
        onSubmit={handleSubmit(handleLoginWithCredentials)}
        id="login_credentials_form"
      >
        <FormPrimitive.Fieldset disabled={isLoading} className="space-y-2.5">
          <div>
            <FormPrimitive.Label htmlFor="email">Email</FormPrimitive.Label>
            <FormPrimitive.Input
              id="email"
              autoFocus
              {...register('email')}
              placeholder="abc@domain.com"
            />
            <FormPrimitive.Error>{errors.email?.message}</FormPrimitive.Error>
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
            <div className="flex flex-wrap justify-between gap-y-2">
              <div className="mr-4">
                <FormPrimitive.Error>
                  {errors.password?.message}
                </FormPrimitive.Error>
              </div>
              <div className="space-x-2">
                <PasswordVisibilityToggle
                  isVisible={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
                <ResetPassword
                  onClick={() => setIsResetPasswordDialogOpen(true)}
                />
              </div>
            </div>
          </div>
        </FormPrimitive.Fieldset>
      </FormPrimitive.Root>
      <Button
        className="w-full"
        isLoading={isCredentialPending}
        form="login_credentials_form"
      >
        Login
      </Button>
      <AccountQuestion.Container>
        <AccountQuestion.Title>
          Already have an account?{' '}
          <AccountQuestion.Action href="/register" disabled={isLoading}>
            Register
          </AccountQuestion.Action>
        </AccountQuestion.Title>
      </AccountQuestion.Container>
      <ResetPasswordDialog
        isOpen={isResetPasswordDialogOpen}
        setIsOpen={setIsResetPasswordDialogOpen}
      />
    </>
  )
}

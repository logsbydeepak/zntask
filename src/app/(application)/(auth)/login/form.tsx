'use client'

import React, { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  AccountQuestion,
  Alert,
  ContinueWithGoogle,
  PasswordVisibilityToggle,
  ResetPassword,
  Separator,
} from '@/app/(application)/(auth)/components'
import { ResetPasswordDialog } from '@/components/dialogs/reset-password'
import { ExclamationIcon } from '@/components/icon/exclamation'
import { Button } from '@/components/ui/button'
import * as FormPrimitive from '@/components/ui/form'
import {
  loginWithCredentials,
  loginWithGoogle,
  redirectGoogleLogin,
} from '@/data/auth'
import { zLoginWithCredentials } from '@/data/utils/zSchema'
import { toast } from '@/store/toast'

type FormValues = z.infer<typeof zLoginWithCredentials>

export function Form() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const requestRef = React.useRef(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(
    !!searchParams.get('code')
  )
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

  const handleGoogleCode = React.useCallback(() => {
    if (requestRef.current) return
    const code = searchParams.get('code')
    if (!code) return
    router.replace('/login')
    startLoginWithGoogle(async () => {
      requestRef.current = true
      const res = await loginWithGoogle({ code })
      requestRef.current = false
      console.log(res)
      if (res.code === 'INVALID_CREDENTIALS') {
        setAlertMessage('User not found')
      }
    })
  }, [searchParams, router])

  const handleLoginWithCredentials = (values: FormValues) => {
    if (isLoading) return
    startLoginWithCredentials(async () => {
      try {
        const res = await loginWithCredentials(values)

        if (res?.code === 'INVALID_CREDENTIALS') {
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
      } catch (error) {
        toast.error('Something went wrong')
      }
    })
  }

  const handleLoginWithGoogle = () => {
    if (isLoading) return
    startLoginWithGoogle(async () => {
      await redirectGoogleLogin()
    })
  }

  React.useEffect(() => {
    handleGoogleCode()
  }, [handleGoogleCode])

  React.useEffect(() => {
    if (isLoading) setAlertMessage('')
  }, [isLoading])

  React.useEffect(() => {
    setIsGoogleLoading(isGooglePending)
  }, [isGooglePending])

  return (
    <>
      <div className="space-y-3">
        <fieldset disabled={isLoading}>
          <ContinueWithGoogle
            isLoading={isGooglePending || isGoogleLoading}
            onClick={handleLoginWithGoogle}
          />
        </fieldset>
        {alertMessage && <Alert>{alertMessage}</Alert>}
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
            {errors.email && (
              <FormPrimitive.Error>{errors.email?.message}</FormPrimitive.Error>
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
            <div className="flex flex-wrap justify-between gap-y-2">
              <div className="mr-4">
                {errors.password && (
                  <FormPrimitive.Error>
                    {errors.password?.message}
                  </FormPrimitive.Error>
                )}
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

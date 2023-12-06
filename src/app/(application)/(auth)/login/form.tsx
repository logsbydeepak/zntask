'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  AccountQuestion,
  ContinueWithGoogle,
  PasswordVisibilityToggle,
  ResetPassword,
  Separator,
} from '@/app/(application)/(auth)/components'
import { ResetPasswordDialog } from '@/components/dialogs/reset-password'
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

  const googleCode = searchParams.get('code')
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isNewTabLoading, setIsNewTabLoading] = React.useState(false)

  const [isCredentialLoading, startLoginWithCredentials] = React.useTransition()
  const [isGoogleLoading, startLoginWithGoogle] = React.useTransition()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(zLoginWithCredentials),
  })

  React.useEffect(() => {
    setIsLoading(isCredentialLoading || isGoogleLoading || isNewTabLoading)
  }, [setIsLoading, isCredentialLoading, isGoogleLoading, isNewTabLoading])

  React.useEffect(() => {
    if (!isNewTabLoading) return

    const bc = new BroadcastChannel('google_auth')
    bc.addEventListener('message', (e) => {
      setIsNewTabLoading(false)
      handleGoogleCode(e.data.code)
      bc.close()
    })

    return () => bc.close()
  }, [isNewTabLoading])

  const handleGoogleCode = async (code: string) => {
    startLoginWithGoogle(async () => {
      const res = await loginWithGoogle({ code })
      console.log(res)
    })
  }

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
      const res = await redirectGoogleLogin()
      setIsNewTabLoading(true)
      window.open(res.url, '_blank', 'noopener, noreferrer')
    })
  }

  return (
    <>
      <fieldset disabled={isLoading}>
        <ContinueWithGoogle
          isLoading={isGoogleLoading || isNewTabLoading}
          onClick={handleLoginWithGoogle}
        />
      </fieldset>
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
        isLoading={isCredentialLoading}
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

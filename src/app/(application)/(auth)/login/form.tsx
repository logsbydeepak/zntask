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
} from '@/app/(application)/(auth)/components'
import { ResetPasswordDialog } from '@/components/dialogs/reset-password'
import { Button } from '@/components/ui/button'
import * as FormPrimitive from '@/components/ui/form'
import { loginWithCredentials, redirectGoogleLogin } from '@/data/auth'
import { zLoginWithCredentials } from '@/data/utils/zSchema'
import { toast } from '@/store/toast'

type FormValues = z.infer<typeof zLoginWithCredentials>

export function Form() {
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

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
    setIsLoading(isCredentialLoading || isGoogleLoading)
  }, [setIsLoading, isCredentialLoading, isGoogleLoading])

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

  return (
    <FormPrimitive.Root onSubmit={handleSubmit(handleLoginWithCredentials)}>
      <FormPrimitive.Fieldset disabled={isLoading}>
        <div className="my-8 space-y-4">
          <fieldset disabled={isLoading}>
            <ContinueWithGoogle
              isLoading={isGoogleLoading}
              onClick={handleLoginWithGoogle}
            />
          </fieldset>
          <Separator />
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
        </div>
        <Button className="w-full" isLoading={isCredentialLoading}>
          Login
        </Button>
      </FormPrimitive.Fieldset>
      <div className="pt-4">
        <AccountQuestion.Container>
          <AccountQuestion.Title>
            Already have an account?{' '}
            <AccountQuestion.Action href="/register" disabled={isLoading}>
              Register
            </AccountQuestion.Action>
          </AccountQuestion.Title>
        </AccountQuestion.Container>
      </div>
      <ResetPasswordDialog
        isOpen={isResetPasswordDialogOpen}
        setIsOpen={setIsResetPasswordDialogOpen}
      />
    </FormPrimitive.Root>
  )
}

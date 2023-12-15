'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import {
  AccountQuestion,
  Alert,
  ContinueWithGoogle,
  passwordChecklist,
  PasswordChecklistItem,
  PasswordVisibilityToggle,
  Separator,
} from '@/app/(application)/(auth)/components'
import { Button } from '@/components/ui/button'
import * as FormPrimitive from '@/components/ui/form'
import {
  redirectGoogleRegister,
  registerWithCredentials,
  registerWithGoogle,
} from '@/data/auth'
import { zRegisterWithCredentials } from '@/data/utils/zSchema'
import { toast } from '@/store/toast'

type FormValues = z.infer<typeof zRegisterWithCredentials>

export function Form() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const requestRef = React.useRef(false)
  const [alertMessage, setAlertMessage] = React.useState('')
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(
    !!searchParams.get('code')
  )

  const [isCredentialPending, startRegisterWithCredentials] =
    React.useTransition()
  const [isGooglePending, startRegisterWithGoogle] = React.useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(zRegisterWithCredentials),
  })

  const isLoading = isGooglePending || isCredentialPending || isGoogleLoading

  const [watchPassword] = useDebounce(watch('password') ?? '', 500)

  const handleGoogleCode = React.useCallback(() => {
    if (requestRef.current) return
    const code = searchParams.get('code')
    if (!code) return
    router.replace('/register')
    startRegisterWithGoogle(async () => {
      try {
        requestRef.current = true
        const res = await registerWithGoogle({ code })
        const resCode = res?.code

        if (resCode === 'INVALID_CREDENTIALS') {
          setAlertMessage('User not found')
        }
        if (resCode === 'EMAIL_ALREADY_EXISTS') {
          setAlertMessage('Email already exists')
        }
      } catch (error) {
        toast.error()
      } finally {
        requestRef.current = false
      }
    })
  }, [searchParams, router])

  const handleRegisterWithCredentials = (values: FormValues) => {
    startRegisterWithCredentials(async () => {
      try {
        const res = await registerWithCredentials(values)
        const resCode = res?.code
        if (resCode === 'EMAIL_ALREADY_EXISTS') {
          setError('email', {
            message: 'already exists',
          })
        }
      } catch (error) {
        toast.error()
      }
    })
  }

  const handleRegisterWithGoogle = () => {
    if (isLoading) return
    startRegisterWithGoogle(async () => {
      try {
        await redirectGoogleRegister()
      } catch (error) {
        toast.error()
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
    setIsGoogleLoading(isGooglePending)
  }, [isGooglePending])

  return (
    <>
      <div className="space-y-3">
        <fieldset disabled={isLoading}>
          <ContinueWithGoogle
            isLoading={isGooglePending || isGoogleLoading}
            onClick={handleRegisterWithGoogle}
          />
        </fieldset>
        {alertMessage && <Alert>{alertMessage}</Alert>}
      </div>

      <Separator />
      <FormPrimitive.Root
        onSubmit={handleSubmit(handleRegisterWithCredentials)}
        id="register_credentials_form"
      >
        <FormPrimitive.Fieldset disabled={isLoading} className="space-y-2.5">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <FormPrimitive.Label htmlFor="firstName">
                First Name
              </FormPrimitive.Label>
              <FormPrimitive.Input
                autoFocus
                id="firstName"
                {...register('firstName')}
                placeholder="Haven"
              />
              <FormPrimitive.Error>
                {errors.firstName?.message}
              </FormPrimitive.Error>
            </div>

            <div className="w-1/2">
              <FormPrimitive.Label htmlFor="lastName">
                Last Name
              </FormPrimitive.Label>
              <FormPrimitive.Input
                id="lastName"
                {...register('lastName')}
                placeholder="Thompson"
              />
            </div>
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

          <div>
            <FormPrimitive.Label htmlFor="password">
              Password
            </FormPrimitive.Label>
            <FormPrimitive.Input
              id="password"
              {...register('password')}
              placeholder="strong password"
              type={isPasswordVisible ? 'text' : 'password'}
            />

            <div className="space-y-2.5">
              <div className="flex flex-wrap justify-between gap-y-2">
                <div className="mr-4">
                  <FormPrimitive.Error>
                    {errors.password?.message}
                  </FormPrimitive.Error>
                </div>
                <PasswordVisibilityToggle
                  isVisible={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
              </div>

              <div className="inline-flex flex-wrap gap-x-4 gap-y-1">
                {passwordChecklist.map((i) => (
                  <PasswordChecklistItem
                    key={i.label}
                    isValid={i.condition(watchPassword)}
                  >
                    {i.label}
                  </PasswordChecklistItem>
                ))}
              </div>
            </div>
          </div>

          <div>
            <FormPrimitive.Label htmlFor="confirmPassword">
              Confirm Password
            </FormPrimitive.Label>
            <FormPrimitive.Input
              id="confirmPassword"
              {...register('confirmPassword')}
              placeholder="strong password"
              type={isPasswordVisible ? 'text' : 'password'}
            />
            <FormPrimitive.Error>
              {errors.confirmPassword?.message}
            </FormPrimitive.Error>
          </div>
        </FormPrimitive.Fieldset>
      </FormPrimitive.Root>
      <Button
        className="w-full"
        isLoading={isCredentialPending}
        form="register_credentials_form"
      >
        Register
      </Button>
      <AccountQuestion.Container>
        <AccountQuestion.Title>
          Already have an account?{' '}
          <AccountQuestion.Action href="/login" disabled={isLoading}>
            Login
          </AccountQuestion.Action>
        </AccountQuestion.Title>
      </AccountQuestion.Container>
    </>
  )
}

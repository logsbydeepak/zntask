'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { atom, Provider, useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import {
  AccountQuestion,
  ContinueWithGoogle,
  passwordChecklist,
  PasswordChecklistItem,
  PasswordVisibilityToggle,
} from '@/app/(application)/(auth)/components'
import { Button } from '@/components/ui/button'
import * as FormPrimitive from '@/components/ui/form'
import { redirectGoogleRegister, registerWithCredentials } from '@/data/auth'
import { zRegisterWithCredentials } from '@/data/utils/zSchema'
import { toast } from '@/store/toast'

type FormValues = z.infer<typeof zRegisterWithCredentials>

const isLoadingAtom = atom(false)

export function Form() {
  const [isPending, startTransition] = React.useTransition()

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(zRegisterWithCredentials),
  })

  React.useEffect(() => {
    setIsLoading(isPending)
  }, [isPending, setIsLoading])

  const [watchPassword] = useDebounce(watch('password') ?? '', 500)

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const res = await registerWithCredentials(values)
      if (res.code === 'EMAIL_ALREADY_EXISTS') {
        setError('email', {
          message: 'already exists',
        })
      }

      setIsLoading(false)
    })
  }

  return (
    <FormPrimitive.Root onSubmit={handleSubmit(onSubmit)}>
      <FormPrimitive.Fieldset disabled={isLoading}>
        <div className="my-8 space-y-4">
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
              {errors.firstName && (
                <FormPrimitive.Error>
                  {errors.firstName?.message}
                </FormPrimitive.Error>
              )}
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

            <div className="flex flex-wrap justify-between gap-y-2">
              <div className="mr-4">
                {errors.password && (
                  <FormPrimitive.Error>
                    {errors.password?.message}
                  </FormPrimitive.Error>
                )}
              </div>
              <PasswordVisibilityToggle
                isVisible={isPasswordVisible}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              />
            </div>

            <div className="mt-4 inline-flex flex-wrap gap-x-4 gap-y-1">
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
            {errors.confirmPassword && (
              <FormPrimitive.Error>
                {errors.confirmPassword?.message}
              </FormPrimitive.Error>
            )}
          </div>
        </div>

        <Button className="w-full" isLoading={isPending}>
          Register
        </Button>
      </FormPrimitive.Fieldset>
    </FormPrimitive.Root>
  )
}

export function Action() {
  const [isPending, startTransition] = React.useTransition()
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)

  const onClick = () => {
    startTransition(async () => {
      await redirectGoogleRegister()
    })
  }

  React.useEffect(() => {
    setIsLoading(isPending)
  }, [setIsLoading, isPending])

  return (
    <>
      <fieldset disabled={isLoading}>
        <ContinueWithGoogle isLoading={isPending} onClick={onClick} />
      </fieldset>

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

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { HomeIcon } from 'lucide-react'
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
import { useToastStore } from '@/store/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import * as FormPrimitive from '@ui/form'

import { addPasswordClientSchema } from './utils'

const schema = addPasswordClientSchema
type FormValues = z.infer<typeof schema>

export function Form() {
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)

  const startTransition = React.useTransition()[1]
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isCredentialRegisterLoading, setIsCredentialRegisterLoading] =
    React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const [watchPassword] = useDebounce(watch('password') ?? '', 500)

  const onSubmit = (values: FormValues) => {
    setIsLoading(true)
    setIsCredentialRegisterLoading(true)

    startTransition(async () => {})
  }

  return (
    <FormPrimitive.Root onSubmit={handleSubmit(onSubmit)}>
      <FormPrimitive.Fieldset disabled={isLoading}>
        <div className="my-8 space-y-4">
          <div>
            <FormPrimitive.Label htmlFor="password">
              Password
            </FormPrimitive.Label>
            <FormPrimitive.Input
              autoFocus
              id="password"
              {...register('password')}
              placeholder="strong password"
              type={isPasswordVisible ? 'text' : 'password'}
            />
            <div>
              <PasswordVisibilityToggle
                isVisible={isPasswordVisible}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              />
              {errors.password && (
                <FormPrimitive.Error>
                  {errors.password?.message}
                </FormPrimitive.Error>
              )}
            </div>

            <div className="mt-4">
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

        <Button className="w-full" isLoading={isCredentialRegisterLoading}>
          Add Password
        </Button>
      </FormPrimitive.Fieldset>
    </FormPrimitive.Root>
  )
}

export function Action() {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  return (
    <>
      <fieldset disabled={isLoading}>
        <Button
          intent="secondary"
          className="w-full"
          onClick={() => router.push('/')}
        >
          <div className="mr-2 h-4 w-4">
            <HomeIcon className="h-full w-full" />
          </div>
          <span>Return to home</span>
        </Button>
      </fieldset>
    </>
  )
}

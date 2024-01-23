'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import {
  passwordChecklist,
  PasswordChecklistItem,
  PasswordVisibilityToggle,
} from '@/app/(auth)/components'
import { Alert, AlertStyleProps } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import * as FormPrimitive from '@/components/ui/form'
import { addPassword } from '@/data/auth'
import { zPassword, zRequired } from '@/utils/zSchema'

const schema = z
  .object({
    password: zPassword('not strong enough'),
    confirmPassword: zRequired,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function Form({ token }: { token: string }) {
  const router = useRouter()

  const [alertMessage, setAlertMessage] = React.useState<{
    message: string
    intent: AlertStyleProps['intent']
  } | null>(null)

  const [isPending, startTransition] = React.useTransition()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const [watchPassword] = useDebounce(watch('password') ?? '', 500)

  React.useEffect(() => {
    setIsLoading(isPending)
  }, [isPending, setIsLoading])

  const defaultError = () => {
    setAlertMessage({
      message: 'Something went wrong!',
      intent: 'destructive',
    })
  }

  const onSubmit = (values: FormValues) => {
    setIsLoading(true)
    startTransition(async () => {
      try {
        const res = await addPassword({ ...values, token })

        switch (res?.code) {
          case 'OK':
            setAlertMessage({
              message: 'Password added successfully',
              intent: 'success',
            })

            router.push('/login')
            break

          case 'INVALID_TOKEN':
            setAlertMessage({
              message: 'invalid token',
              intent: 'destructive',
            })
            break

          case 'TOKEN_EXPIRED':
            setAlertMessage({
              message: 'token expired',
              intent: 'destructive',
            })
            break
        }
      } catch (error) {
        defaultError()
      }
    })
  }

  React.useEffect(() => {
    if (isLoading) setAlertMessage(null)
  }, [isLoading])

  React.useEffect(() => {
    console.log(errors)
    if (errors) setAlertMessage(null)
  }, [errors])

  return (
    <>
      {alertMessage && (
        <Alert align="center" intent={alertMessage.intent}>
          {alertMessage.message}
        </Alert>
      )}
      <FormPrimitive.Root
        onSubmit={handleSubmit(onSubmit)}
        id="add_password_form"
      >
        <FormPrimitive.Fieldset disabled={isLoading} className="space-y-2.5">
          <div>
            <FormPrimitive.Label htmlFor="password">
              Password
            </FormPrimitive.Label>
            <FormPrimitive.Input
              id="password"
              {...register('password')}
              autoFocus
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
      <Button className="w-full" isLoading={isPending} form="add_password_form">
        Add Password
      </Button>
    </>
  )
}

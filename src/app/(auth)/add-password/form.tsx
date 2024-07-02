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
import { Alert, useAlert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  FormError,
  FormFieldset,
  FormInput,
  FormLabel,
  FormRoot,
} from '@/components/ui/form'
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

  const { setAlert, alert } = useAlert()

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
    setAlert({
      type: 'destructive',
      message: 'Something went wrong!',
    })
  }

  const onSubmit = (values: FormValues) => {
    setIsLoading(true)
    startTransition(async () => {
      try {
        const res = await addPassword({ ...values, token })

        switch (res?.code) {
          case 'OK':
            setAlert({
              type: 'success',
              message: 'Password added successfully',
            })

            router.push('/login')
            break

          case 'INVALID_TOKEN':
            setAlert({
              type: 'destructive',
              message: 'invalid token',
            })

            break

          case 'TOKEN_EXPIRED':
            setAlert({
              type: 'destructive',
              message: 'token expired',
            })

            break
        }
      } catch (error) {
        defaultError()
      }
    })
  }

  React.useEffect(() => {
    if (isLoading) setAlert('close')
  }, [isLoading, setAlert])

  return (
    <>
      <Alert align="center" {...alert} />
      <FormRoot onSubmit={handleSubmit(onSubmit)} id="add_password_form">
        <FormFieldset disabled={isLoading} className="space-y-2.5">
          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              id="password"
              {...register('password')}
              autoFocus
              placeholder="strong password"
              type={isPasswordVisible ? 'text' : 'password'}
            />

            <div className="space-y-2.5">
              <div className="flex flex-wrap justify-between gap-y-2">
                <div className="mr-4">
                  <FormError>{errors.password?.message}</FormError>
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
                    isValidID={i.condition(watchPassword)}
                  >
                    {i.label}
                  </PasswordChecklistItem>
                ))}
              </div>
            </div>
          </div>

          <div>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <FormInput
              id="confirmPassword"
              {...register('confirmPassword')}
              placeholder="strong password"
              type={isPasswordVisible ? 'text' : 'password'}
            />
            <FormError>{errors.confirmPassword?.message}</FormError>
          </div>
        </FormFieldset>
      </FormRoot>
      <Button className="w-full" isLoading={isPending} form="add_password_form">
        Add Password
      </Button>
    </>
  )
}

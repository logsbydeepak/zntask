'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { atom, useAtom, useAtomValue } from 'jotai'
import { HomeIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import {
  passwordChecklist,
  PasswordChecklistItem,
  PasswordVisibilityToggle,
} from '@/app/(application)/(auth)/components'
import { Button } from '@/components/ui/button'
import * as FormPrimitive from '@/components/ui/form'
import { addPassword } from '@/data/auth'
import { toast } from '@/store/toast'
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

const isLoadingAtom = atom(false)

export function Form({ token }: { token: string }) {
  const router = useRouter()

  const [isPending, startTransition] = React.useTransition()
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
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

  const onSubmit = (values: FormValues) => {
    setIsLoading(true)
    startTransition(async () => {
      try {
        const res = await addPassword({ ...values, token })

        switch (res?.code) {
          case 'OK':
            toast.success('password added successfully')
            router.push('/login')
            break

          case 'INVALID_TOKEN':
            toast.success('invalid token')
            break

          case 'TOKEN_EXPIRED':
            toast.success('token expired')
            break
        }
      } catch (error) {
        toast.error('Something went wrong')
      }
    })
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
          Add Password
        </Button>
      </FormPrimitive.Fieldset>
    </FormPrimitive.Root>
  )
}

'use client'

import React from 'react'
import { CheckCircleIcon, CircleIcon, Divide } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import {
  AccountQuestion,
  ContinueWithGoogle,
  PasswordVisibilityToggle,
} from '@/app/(application)/(auth)/components'
import { cn } from '@/utils/style'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import * as FormPrimitive from '@ui/form'

import { schema } from './utils'

type FormValues = z.infer<typeof schema>

const passwordChecklist = [
  {
    label: '8 characters',
    condition: (value: string) => value.length >= 8,
  },
  {
    label: 'lowercase',
    condition: (value: string) => /[a-z]/.test(value),
  },
  {
    label: 'uppercase',
    condition: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: 'numbers',
    condition: (value: string) => /[0-9]/.test(value),
  },
  {
    label: 'symbols',
    condition: (value: string) => /[^a-zA-Z0-9]/.test(value),
  },
]

export function Form() {
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

  const onSubmit = (values: FormValues) => {
    console.log(values)
  }

  return (
    <FormPrimitive.Root onSubmit={handleSubmit(onSubmit)}>
      <div className="my-8 space-y-4">
        <div className="flex space-x-4">
          <div>
            <FormPrimitive.Label htmlFor="firstName">
              First Name
            </FormPrimitive.Label>
            <FormPrimitive.Input
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

          <div>
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
          <FormPrimitive.Label htmlFor="password">Password</FormPrimitive.Label>
          <FormPrimitive.Input
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

      <Button className="w-full">Register</Button>
    </FormPrimitive.Root>
  )
}

export function Action() {
  return (
    <>
      <ContinueWithGoogle />

      <AccountQuestion.Container>
        <AccountQuestion.Title>
          Already have an account?{' '}
          <AccountQuestion.Action href="/login">Login</AccountQuestion.Action>
        </AccountQuestion.Title>
      </AccountQuestion.Container>
    </>
  )
}

function PasswordChecklistItem({
  children,
  isValid,
}: {
  children: React.ReactNode
  isValid: boolean
}) {
  return (
    <div
      className={cn(
        'mr-2 mt-2 inline-block rounded-full border border-gray-200 px-2 py-0.5',
        isValid && 'border-gray-100 bg-gray-50'
      )}
    >
      <div className="flex items-center">
        <span className={cn('mr-1 h-2 w-2 text-gray-500')}>
          {isValid ? (
            <CheckCircleIcon className="h-full w-full" strokeWidth={3} />
          ) : (
            <CircleIcon className="h-full w-full" strokeWidth={3} />
          )}
        </span>

        <p className={cn('text-xs font-medium text-gray-500')}>{children}</p>
      </div>
    </div>
  )
}

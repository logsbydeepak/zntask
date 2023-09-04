'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircleIcon, CheckIcon, CircleIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { cn } from '@/utils/style'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import * as FormPrimitive from '@ui/form'

import { schema } from './utils'

type FormValues = z.infer<typeof schema>

const passwordChecklist = [
  {
    label: 'length 8',
    condition: (value: string) => value.length >= 8,
  },
  {
    label: 'lowercase 1',
    condition: (value: string) => /[a-z]/.test(value),
  },
  {
    label: 'uppercase 1',
    condition: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: 'numbers 1',
    condition: (value: string) => /[0-9]/.test(value),
  },
  {
    label: 'symbols 1',
    condition: (value: string) => /[^a-zA-Z0-9]/.test(value),
  },
]

export function Form() {
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
    <>
      <FormPrimitive.Root onSubmit={handleSubmit(onSubmit)}>
        <FormPrimitive.Label htmlFor="firstName">
          First Name
        </FormPrimitive.Label>
        <FormPrimitive.Input id="firstName" {...register('firstName')} />
        <FormPrimitive.Error>{errors.firstName?.message}</FormPrimitive.Error>

        <FormPrimitive.Label htmlFor="lastName">Last Name</FormPrimitive.Label>
        <FormPrimitive.Input id="lastName" {...register('lastName')} />
        <FormPrimitive.Error>{errors.lastName?.message}</FormPrimitive.Error>

        <FormPrimitive.Label htmlFor="email">Email</FormPrimitive.Label>
        <FormPrimitive.Input id="email" {...register('email')} />
        <FormPrimitive.Error>{errors.email?.message}</FormPrimitive.Error>

        <FormPrimitive.Label htmlFor="password">Password</FormPrimitive.Label>
        <FormPrimitive.Input id="password" {...register('password')} />
        <FormPrimitive.Error>{errors.password?.message}</FormPrimitive.Error>

        <FormPrimitive.Label htmlFor="confirmPassword">
          Confirm Password
        </FormPrimitive.Label>
        <FormPrimitive.Input
          id="confirmPassword"
          {...register('confirmPassword')}
        />
        <FormPrimitive.Error>
          {errors.confirmPassword?.message}
        </FormPrimitive.Error>

        <div>
          <p>Strong Password must contain minimum of</p>
          {passwordChecklist.map((i) => (
            <PasswordChecklistItem
              key={i.label}
              isValid={i.condition(watchPassword)}
            >
              {i.label}
            </PasswordChecklistItem>
          ))}
        </div>

        <Button className="w-full">Register</Button>
      </FormPrimitive.Root>
      <span>
        <span>Already have an account?</span>
        <Link href="/register">Register</Link>
      </span>
      <Button className="w-full" intent="secondary">
        Continue with Google
      </Button>
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
    <div className="mr-2 inline-block rounded-full border px-2">
      <div className="flex items-center">
        <span className="mr-1 h-2 w-2 text-gray-500">
          {isValid ? (
            <CheckCircleIcon className="h-full w-full" strokeWidth={3} />
          ) : (
            <CircleIcon className="h-full w-full" strokeWidth={3} />
          )}
        </span>

        <p className="text-xs font-medium text-gray-500">{children}</p>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  AccountQuestion,
  ContinueWithGoogle,
  PasswordVisibilityToggle,
} from '@/app/(application)/(auth)/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import * as FormPrimitive from '@ui/form'

import { login } from './actions'
import { schema } from './utils'

type FormValues = z.infer<typeof schema>

export function Form() {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const res = await login(values)
      console.log(res)
    })
  }

  return (
    <FormPrimitive.Root onSubmit={handleSubmit(onSubmit)}>
      <div className="my-8 space-y-4">
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
            placeholder="********"
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
        </div>
      </div>
      <Button className="w-full">Login</Button>
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
          <AccountQuestion.Action href="/register">
            Register
          </AccountQuestion.Action>
        </AccountQuestion.Title>
      </AccountQuestion.Container>
    </>
  )
}

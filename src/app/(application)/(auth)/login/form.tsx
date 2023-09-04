'use client'

import React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import * as FormPrimitive from '@ui/form'

import { login } from './actions'
import { schema } from './utils'

type FormValues = z.infer<typeof schema>

export function Form() {
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
    <>
      <FormPrimitive.Root onSubmit={handleSubmit(onSubmit)}>
        <FormPrimitive.Fieldset>
          <FormPrimitive.Label htmlFor="email">Email</FormPrimitive.Label>
          <FormPrimitive.Input id="email" {...register('email')} />
          <FormPrimitive.Error>{errors.email?.message}</FormPrimitive.Error>
          <FormPrimitive.Label htmlFor="password">Password</FormPrimitive.Label>
          <FormPrimitive.Input id="password" {...register('password')} />
          <FormPrimitive.Error>{errors.password?.message}</FormPrimitive.Error>
          <Link href="#">forgot password?</Link>
          <Button className="w-full">Login</Button>
        </FormPrimitive.Fieldset>
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

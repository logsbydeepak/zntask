'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import * as FormPrimitive from '@ui/form'

const schema = z
  .object({
    firstName: z.string().nonempty({ message: 'required' }),
    lastName: z.string().nonempty({ message: 'required' }),
    email: z.string().nonempty({ message: 'required' }).email(),
    password: z.string().nonempty({ message: 'required' }).min(8).max(32),
    confirmPassword: z
      .string()
      .nonempty({ message: 'required' })
      .min(8)
      .max(32),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

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

        <Button>Register</Button>
      </FormPrimitive.Root>
    </>
  )
}

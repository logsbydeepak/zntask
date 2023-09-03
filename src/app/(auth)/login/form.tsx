'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/button'
import * as FormPrimitive from '@ui/form'

const schema = z.object({
  email: z.string().nonempty({ message: 'required' }).email(),
  password: z.string().nonempty({ message: 'required' }).min(8).max(32),
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
        <FormPrimitive.Fieldset>
          <FormPrimitive.Label htmlFor="email">Email</FormPrimitive.Label>
          <FormPrimitive.Input id="email" {...register('email')} />
          <FormPrimitive.Error>{errors.email?.message}</FormPrimitive.Error>
          <FormPrimitive.Label htmlFor="password">Password</FormPrimitive.Label>
          <FormPrimitive.Input id="password" {...register('password')} />
          <FormPrimitive.Error>{errors.password?.message}</FormPrimitive.Error>
          <Button className="w-full">Login</Button>
        </FormPrimitive.Fieldset>
      </FormPrimitive.Root>
    </>
  )
}

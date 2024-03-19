import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { PasswordVisibilityToggle } from '@/app/(auth)/components'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import { updateEmail } from '@/data/user'
import { useAppStore } from '@/store/app'
import { toast } from '@/store/toast'
import { zEmail, zPassword } from '@/utils/zSchema'

import { Head } from '../head'

const zSchema = z.object({
  email: zEmail,
  password: zPassword('invalid password'),
})

type FormValues = z.infer<typeof zSchema>

export function UpdateEmailDialog() {
  const [isPending, startTransition] = React.useTransition()
  const isOpen = useAppStore((state) => state.dialog.updateEmail)
  const setIsOpen = useAppStore((state) => state.setDialog)

  const handleClose = () => {
    if (isPending) return
    setIsOpen({ updateEmail: false })
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <Content
          handleClose={handleClose}
          isPending={isPending}
          startTransition={startTransition}
        />
      </DialogContent>
    </DialogRoot>
  )
}

function Content({
  handleClose,
  isPending,
  startTransition,
}: {
  handleClose: () => void
  isPending: boolean
  startTransition: React.TransitionStartFunction
}) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(zSchema),
  })

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const res = await updateEmail(values)
        const resCode = res?.code

        if (resCode === 'INVALID_CREDENTIALS') {
          setError('password', {
            type: 'manual',
            message: 'invalid credentials',
          })
        }
        if (resCode === 'EMAIL_EXISTS') {
          setError('email', {
            type: 'manual',
            message: 'email already exists',
          })
        }
        if (resCode === 'OK') {
          toast.success('Email updated successfully')
          handleClose()
        }
      } catch (error) {
        toast.error()
      }
    })
  }

  return (
    <>
      <Head title="Update email" />
      <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <DialogTitle>Update email</DialogTitle>
          <DialogDescription>
            Enter your new email and password to update your email
          </DialogDescription>
        </div>
        <div>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Input
            id="email"
            {...register('email')}
            placeholder="abc@domain.com"
            autoFocus
          />
          <Form.Error>{errors.email?.message}</Form.Error>
        </div>
        <div>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Input
            id="password"
            {...register('password')}
            placeholder="********"
            type={isPasswordVisible ? 'text' : 'password'}
          />
          <div className="flex flex-wrap justify-between gap-y-2">
            <div className="mr-4">
              <Form.Error>{errors.password?.message}</Form.Error>
            </div>
            <div className="space-x-2">
              <PasswordVisibilityToggle
                isVisible={isPasswordVisible}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              />
            </div>
          </div>
        </div>

        <fieldset className="flex space-x-4" disabled={isPending}>
          <DialogClose asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button className="w-full" isLoading={isPending}>
            Redirect
          </Button>
        </fieldset>
      </Form.Root>
    </>
  )
}

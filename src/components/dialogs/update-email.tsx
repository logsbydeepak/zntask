import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import { useAppStore } from '@/store/app'
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
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Content>
          <Content
            handleClose={handleClose}
            isPending={isPending}
            startTransition={startTransition}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(zSchema),
  })

  const onSubmit = (values: FormValues) => {}

  return (
    <>
      <Head title="Update email" />
      <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Dialog.Title className="text text-lg font-medium">
            Update email
          </Dialog.Title>
          <Dialog.Description className="text-xs text-gray-500">
            Enter your new email and password to update your email
          </Dialog.Description>
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
          />
          <Form.Error>{errors.password?.message}</Form.Error>
        </div>

        <fieldset className="flex space-x-4" disabled={isPending}>
          <Dialog.Close asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </Dialog.Close>
          <Button className="w-full" isLoading={isPending}>
            Redirect
          </Button>
        </fieldset>
      </Form.Root>
    </>
  )
}

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { resetPassword } from '@/app/(application)/(auth)/login/actions'
import { resetPasswordSchema } from '@/app/(application)/(auth)/login/utils'
import { useToastStore } from '@/store/toast'
import { Button } from '@ui/button'
import * as Form from '@ui/form'

import { Head } from '../head'

type FormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const [isPending, startTransition] = React.useTransition()

  const handleClose = () => {
    if (isPending) return
    setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-white/80 bg-opacity-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 transform rounded-md border border-gray-200 bg-white p-6 shadow-2xl drop-shadow-sm">
          <ResetPasswordDialogContent
            handleClose={handleClose}
            isPending={isPending}
            startTransition={startTransition}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function ResetPasswordDialogContent({
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
    resolver: zodResolver(resetPasswordSchema),
  })
  const addToast = useToastStore((s) => s.addToast)

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const res = await resetPassword(values)
      switch (res.code) {
        case 'OK':
          addToast({
            message: 'Please check your email',
            type: 'success',
          })
          handleClose()

        case 'EMAIL_ALREADY_SENT':
          setError(
            'email',
            {
              message: 'Email already sent',
            },
            {
              shouldFocus: true,
            }
          )

        case 'INVALID_CREDENTIALS':
          setError(
            'email',
            {
              message: 'Invalid credentials',
            },
            { shouldFocus: true }
          )
          break
      }
    })
  }

  return (
    <>
      <Head title="Reset Password" />
      <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Dialog.Title className="text text-lg font-medium">
            Reset Password
          </Dialog.Title>
          <Dialog.Description className="text-xs text-gray-500">
            Enter your email to reset password
          </Dialog.Description>
        </div>
        <div>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Input
            id="email"
            {...register('email')}
            placeholder="abc@domain.com"
          />
          {errors.email && <Form.Error>{errors.email?.message}</Form.Error>}
        </div>

        <fieldset className="flex space-x-4" disabled={isPending}>
          <Dialog.Close asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </Dialog.Close>
          <Button className="w-full" isLoading={isPending}>
            Submit
          </Button>
        </fieldset>
      </Form.Root>
    </>
  )
}

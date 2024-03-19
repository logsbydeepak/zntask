import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormError,
  FormFieldset,
  FormInput,
  FormLabel,
  FormRoot,
} from '@/components/ui/form'
import { resetPassword } from '@/data/auth'
import { zResetPassword } from '@/data/utils/zSchema'

import { Head } from '../head'
import { Alert, AlertStyleProps } from '../ui/alert'

type FormValues = z.infer<typeof zResetPassword>

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
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <ResetPasswordDialogContent
          handleClose={handleClose}
          isPending={isPending}
          startTransition={startTransition}
        />
      </DialogContent>
    </DialogRoot>
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
  const [alertMessage, setAlertMessage] = React.useState<{
    message: string
    intent: AlertStyleProps['intent']
  } | null>(null)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(zResetPassword),
  })

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const res = await resetPassword(values)
      switch (res.code) {
        case 'OK':
          setAlertMessage({
            message: 'Check your email for reset link',
            intent: 'success',
          })

        case 'EMAIL_ALREADY_SENT':
          setAlertMessage({
            message: 'Email already sent',
            intent: 'success',
          })
          break

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

  React.useEffect(() => {
    if (errors) setAlertMessage(null)
  }, [errors])

  return (
    <>
      <Head title="Reset Password" />
      <FormRoot onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email to reset password
          </DialogDescription>
        </div>
        {alertMessage && (
          <Alert intent={alertMessage.intent}>{alertMessage.message}</Alert>
        )}
        <div>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput
            id="email"
            {...register('email')}
            placeholder="abc@domain.com"
            autoFocus
          />
          <FormError>{errors.email?.message}</FormError>
        </div>

        <fieldset className="flex space-x-4" disabled={isPending}>
          <DialogClose asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button className="w-full" isLoading={isPending}>
            Submit
          </Button>
        </fieldset>
      </FormRoot>
    </>
  )
}

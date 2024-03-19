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
import { removeGoogleAuthProvider } from '@/data/auth'
import { useAppStore } from '@/store/app'
import { toast } from '@/store/toast'
import { zPassword } from '@/utils/zSchema'

import { Head } from '../head'

const zSchema = z.object({
  password: zPassword('invalid password'),
})

type FormValues = z.infer<typeof zSchema>

export function RemoveGoogleDialog() {
  const [isPending, startTransition] = React.useTransition()
  const isOpen = useAppStore((state) => state.dialog.removeGoogleAuth)
  const setIsOpen = useAppStore((state) => state.setDialog)

  const handleClose = () => {
    if (isPending) return
    setIsOpen({ removeGoogleAuth: false })
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
        const res = await removeGoogleAuthProvider(values)
        const resCode = res?.code
        if (resCode === 'INVALID_CREDENTIALS') {
          setError('password', {
            type: 'manual',
            message: 'invalid credentials',
          })
        }
        if (resCode === 'NOT_ADDED') {
          handleClose()
          toast.error('google auth provider not added')
        }
        if (resCode === 'OK') {
          handleClose()
          toast.success('google auth provider removed')
        }
      } catch (error) {
        toast.error()
      }
    })
  }

  return (
    <>
      <Head title="Remove Google" />
      <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <DialogTitle>Remove Google</DialogTitle>
          <DialogDescription>
            Enter your password to add remove google auth
          </DialogDescription>
        </div>
        <div>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Input
            id="password"
            {...register('password')}
            placeholder="********"
            type={isPasswordVisible ? 'text' : 'password'}
            autoFocus
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
            Remove
          </Button>
        </fieldset>
      </Form.Root>
    </>
  )
}

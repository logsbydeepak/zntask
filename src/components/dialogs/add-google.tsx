import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { PasswordVisibilityToggle } from '@/app/(auth)/components'
import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import { addGoogleAuthProvider, redirectGoogleAddNew } from '@/data/auth'
import { useAppStore } from '@/store/app'
import { toast } from '@/store/toast'
import { zPassword } from '@/utils/zSchema'

import { Head } from '../head'

const zSchema = z.object({
  password: zPassword('invalid password'),
})

type FormValues = z.infer<typeof zSchema>

export function AddGoogleDialog() {
  const [isPending, startTransition] = React.useTransition()
  const isAddGoogleAuthOpen = useAppStore((state) => state.dialog.addGoogleAuth)
  const setIsOpen = useAppStore((state) => state.setDialog)

  const isOpen =
    isAddGoogleAuthOpen ||
    (typeof window !== 'undefined' &&
      !!window?.localStorage?.getItem('googleCode'))

  const handleClose = React.useCallback(() => {
    if (isPending) return
    setIsOpen({ addGoogleAuth: false })
  }, [isPending, setIsOpen])

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
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(zSchema),
  })

  const handleAddGoogle = React.useCallback(() => {
    const code = window.localStorage.getItem('googleCode')
    if (!code) return
    window.localStorage.removeItem('googleCode')
    startTransition(async () => {
      try {
        await addGoogleAuthProvider({ code })
        toast.success('google auth added')
        handleClose()
      } catch (error) {}
    })
  }, [handleClose, startTransition])

  React.useEffect(() => {
    handleAddGoogle()
  }, [handleAddGoogle])

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const res = await redirectGoogleAddNew(values)
        const resCode = res?.code
        if (resCode === 'INVALID_CREDENTIALS') {
          setError('password', {
            message: 'invalid credentials',
          })
          return
        }
        if (resCode === 'ALREADY_ADDED') {
          handleClose()
          toast.error('google auth already added')
        }
      } catch (error) {
        toast.error()
      }
    })
  }

  return (
    <>
      <Head title="Add Google" />
      <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Dialog.Title className="text-lg font-medium">
            Add Google
          </Dialog.Title>
          <Dialog.Description className="text-xs text-gray-500">
            Enter your password to add google auth
          </Dialog.Description>
        </div>
        <div>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Input
            id="password"
            {...register('password')}
            placeholder="********"
            autoFocus
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

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = React.useTransition()
  const isAddGoogleAuthOpen = useAppStore((state) => state.dialog.addGoogleAuth)
  const setIsOpen = useAppStore((state) => state.setDialog)

  const requestRef = React.useRef(false)
  const isOpen = isAddGoogleAuthOpen || !!searchParams.get('code')

  const handleClose = React.useCallback(() => {
    if (isPending) return
    setIsOpen({ addGoogleAuth: false })
  }, [isPending, setIsOpen])

  const handleAddGoogle = React.useCallback(() => {
    if (requestRef.current) return
    const code = searchParams.get('code')
    if (!code) return
    setIsOpen({ addGoogleAuth: true })
    router.replace('/user')
    startTransition(async () => {
      try {
        requestRef.current = true
        await addGoogleAuthProvider({ code })
        toast.success('google auth added')
        handleClose()
      } catch (error) {
      } finally {
        requestRef.current = false
      }
    })
  }, [searchParams, router, handleClose, setIsOpen])

  React.useEffect(() => {
    handleAddGoogle()
  }, [handleAddGoogle])

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
      <Head title="Add google auth" />
      <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Dialog.Title className="text text-lg font-medium">
            Add Google auth provider
          </Dialog.Title>
          <Dialog.Description className="text-xs text-gray-500">
            Enter your password to add google auth provider
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

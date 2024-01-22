import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom, useAtomValue } from 'jotai'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import { updateName } from '@/data/user'
import { zUpdateName } from '@/data/utils/zSchema'
import { useAppStore } from '@/store/app'
import { toast } from '@/store/toast'

import { Head } from '../head'

type FormValues = z.infer<typeof zUpdateName>

export function UpdateNameDialog() {
  const [isPending, startTransition] = React.useTransition()
  const isOpen = useAppStore((state) => state.dialog.updateName)
  const setIsOpen = useAppStore((state) => state.setDialog)

  const handleClose = () => {
    if (isPending) return
    setIsOpen({ updateName: false })
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Content>
          <UpdateNameDialogContent
            handleClose={handleClose}
            isPending={isPending}
            startTransition={startTransition}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function UpdateNameDialogContent({
  handleClose,
  isPending,
  startTransition,
}: {
  handleClose: () => void
  isPending: boolean
  startTransition: React.TransitionStartFunction
}) {
  const user = useAppStore((s) => s.user)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(zUpdateName),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })

  const onSubmit = (values: FormValues) => {
    if (
      user.firstName === values.firstName &&
      user.lastName === values.lastName
    ) {
      handleClose()
      return
    }

    startTransition(async () => {
      await updateName(values)
      toast.success('Name updated')
      handleClose()
    })
  }

  return (
    <>
      <Head title="Update name" />
      <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Dialog.Title className="text text-lg font-medium">Name</Dialog.Title>
          <Dialog.Description className="text-xs text-gray-500">
            Enter your new name
          </Dialog.Description>
        </div>

        <div className="flex space-x-4">
          <div>
            <Form.Label htmlFor="firstName">First Name</Form.Label>
            <Form.Input
              autoFocus
              id="firstName"
              {...register('firstName')}
              placeholder="Haven"
            />
            <Form.Error>{errors.firstName?.message}</Form.Error>
          </div>

          <div>
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
            <Form.Input
              id="lastName"
              {...register('lastName')}
              placeholder="Thompson"
            />
          </div>
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

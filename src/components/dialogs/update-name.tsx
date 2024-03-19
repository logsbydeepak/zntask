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
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <UpdateNameDialogContent
          handleClose={handleClose}
          isPending={isPending}
          startTransition={startTransition}
        />
      </DialogContent>
    </DialogRoot>
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
      <FormRoot onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <DialogTitle>Name</DialogTitle>
          <DialogDescription>Enter your new name</DialogDescription>
        </div>

        <div className="flex space-x-4">
          <div>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <FormInput
              autoFocus
              id="firstName"
              {...register('firstName')}
              placeholder="Haven"
            />
            <FormError>{errors.firstName?.message}</FormError>
          </div>

          <div>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <FormInput
              id="lastName"
              {...register('lastName')}
              placeholder="Thompson"
            />
          </div>
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

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom, useAtomValue } from 'jotai'
import { Trash2Icon, UploadIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button, buttonStyle } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import { updateName } from '@/data/user'
import { useAppStore, userAtom } from '@/store/app'
import { toast } from '@/store/toast'
import { cn } from '@/utils/style'

import { Avatar } from '../avatar'
import { Head } from '../head'

// type FormValues = z.infer<typeof zUpdateProfilePicture>

export function UpdateProfilePictureDialog() {
  const [isPending, startTransition] = React.useTransition()
  const isOpen = useAppStore((state) => state.dialog.updateProfilePicture)
  const setIsOpen = useAppStore((state) => state.setDialog)

  const handleClose = () => {
    if (isPending) return
    setIsOpen({ updateProfilePicture: false })
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Content>
          <UpdateProfilePictureDialogContent
            handleClose={handleClose}
            isPending={isPending}
            startTransition={startTransition}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function UpdateProfilePictureDialogContent({
  handleClose,
  isPending,
  startTransition,
}: {
  handleClose: () => void
  isPending: boolean
  startTransition: React.TransitionStartFunction
}) {
  const user = useAtomValue(userAtom)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })

  const onSubmit = () => {
    handleClose()
  }

  const name = `${user.firstName} ${user.lastName}`
  return (
    <>
      <Head title="Update profile picture" />
      <Form.Root onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Dialog.Title className="text text-lg font-medium">
            Update name
          </Dialog.Title>
          <Dialog.Description className="text-xs text-gray-500">
            Enter your new name
          </Dialog.Description>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Avatar name={name} src={user.profilePicture} size={100} />

          <div className="space-y-2">
            <label htmlFor="file">
              <input type="file" name="file" id="file" className="hidden" />
              <div
                className={cn(
                  buttonStyle({ intent: 'secondary' }),
                  'w-full cursor-pointer space-x-2'
                )}
              >
                <UploadIcon className="h-4 w-4" />
                <span>Pick new</span>
              </div>
            </label>

            <Button
              className="w-full space-x-2"
              intent="secondary"
              isLoading={isPending}
              type="button"
            >
              <Trash2Icon className="h-4 w-4" />
              <span>Remove</span>
            </Button>
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

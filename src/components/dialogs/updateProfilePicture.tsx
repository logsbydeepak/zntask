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
  const [file, setFile] = React.useState<(File & { preview: string }) | null>(
    null
  )
  const [reset, setReset] = React.useState(false)

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
          <div className="h-24 w-24 rounded-full">
            <Avatar
              name={name}
              src={file && file.preview}
              size={96}
              onLoad={() => URL.revokeObjectURL(file?.preview || '')}
            />
          </div>

          <div className="space-y-2">
            <Button
              className="w-full space-x-2"
              intent="secondary"
              isLoading={isPending}
              type="button"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.click()
                input.onchange = () => {
                  const file = input.files?.[0]
                  if (!file) return
                  setReset(false)
                  setFile(
                    Object.assign(file, {
                      preview: URL.createObjectURL(file),
                    })
                  )
                }
              }}
            >
              <UploadIcon className="h-4 w-4" />
              <span>Pick new</span>
            </Button>

            <Button
              className="w-full space-x-2"
              intent="secondary"
              isLoading={isPending}
              type="button"
              onClick={() => {
                setFile(null)
                setReset(true)
              }}
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

import React from 'react'
import Image from 'next/image'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import Avvvatars from 'avvvatars-react'
import { useAtomValue } from 'jotai'
import { Trash2Icon, UploadIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import type { OurFileRouter } from '@/data/utils/uploadthing'
import { useAppStore, userAtom } from '@/store/app'

import { Head } from '../head'

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>()

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
  const [preview, setPreview] = React.useState<string | null>(
    user.profilePicture
  )

  const [file, setFile] = React.useState<File | null>(null)
  const [reset, setReset] = React.useState(false)
  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (file) => {
      handleClose()
    },
  })

  const isLoading = isPending || isUploading

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
    if (file) {
      startUpload([file])
    }

    if (reset) {
      startTransition(async () => {})
    }
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
          <div className="relative h-24 w-24 rounded-full">
            {preview && (
              <Image
                src={preview}
                onLoad={() => URL.revokeObjectURL(preview)}
                fill
                alt="avatar"
                className="h-full w-full rounded-full object-cover"
              />
            )}

            {(reset || !user.profilePicture) && (
              <Avvvatars value={name} size={96} />
            )}
          </div>

          <fieldset className="space-y-2" disabled={isLoading}>
            <Button
              className="w-full space-x-2"
              intent="secondary"
              type="button"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.click()
                input.onchange = () => {
                  const file = input.files?.[0]
                  if (!file) return

                  setPreview(URL.createObjectURL(file))
                  setFile(file)
                  setReset(false)
                }
              }}
            >
              <UploadIcon className="h-4 w-4" />
              <span>Pick new</span>
            </Button>

            <Button
              className="w-full space-x-2"
              intent="secondary"
              type="button"
              onClick={() => {
                setPreview(null)
                setFile(null)
                setReset(true)
              }}
            >
              <Trash2Icon className="h-4 w-4" />
              <span>Remove</span>
            </Button>
          </fieldset>
        </div>

        <fieldset className="flex space-x-4" disabled={isLoading}>
          <Dialog.Close asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </Dialog.Close>
          <Button className="w-full" isLoading={isLoading}>
            Submit
          </Button>
        </fieldset>
      </Form.Root>
    </>
  )
}

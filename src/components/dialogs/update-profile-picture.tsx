import React from 'react'
import Image from 'next/image'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import { useAtomValue } from 'jotai'
import { Trash2Icon, UploadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import { removeProfilePicture, revalidateUser } from '@/data/user'
import type { OurFileRouter } from '@/data/utils/uploadthing'
import { useAppStore, userAtom } from '@/store/app'
import { toast } from '@/store/toast'

import { genInitials } from '../avatar'
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

  const [file, setFile] = React.useState<File | null>(null)
  const [reset, setReset] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>(
    user.profilePicture
  )

  const { startUpload, isUploading } = useUploadThing('profilePicture', {
    onClientUploadComplete: (file) => {
      startTransition(async () => {
        await revalidateUser()
      })
      toast.success('Profile picture updated')
      handleClose()
    },
    onUploadError: () => {
      toast.error()
    },
  })

  const isLoading = isPending || isUploading

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      startUpload([file])
    }

    if (reset) {
      startTransition(async () => {
        await removeProfilePicture()
        toast.success('Profile picture updated')
        handleClose()
      })
    }
  }

  const initials = genInitials(user.firstName, user.lastName)

  return (
    <>
      <Head title="Update profile picture" />
      <Form.Root onSubmit={onSubmit} className="space-y-5">
        <div>
          <Dialog.Title>Profile picture</Dialog.Title>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <div className="flex size-24 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
            {preview && (
              <Image
                src={preview}
                onLoad={() => URL.revokeObjectURL(preview)}
                width={96}
                height={96}
                quality={100}
                alt="avatar"
                className="size-full rounded-full object-cover"
              />
            )}

            {(reset || !user.profilePicture) && !preview && (
              <p className="text-4xl font-medium tracking-wider text-gray-600">
                {initials}
              </p>
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
                input.accept = 'image/png, image/jpeg'
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
              <UploadIcon className="size-4" />
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
              <Trash2Icon className="size-4" />
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

import React from "react"
import Image from "next/image"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { Trash2Icon, UploadIcon } from "lucide-react"

import * as Badge from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
} from "#/components/ui/dialog"
import { FormRoot } from "#/components/ui/form"
import { removeProfilePicture, revalidateUser } from "#/data/user"
import type { OurFileRouter } from "#/data/utils/uploadthing"
import { useAppStore } from "#/store/app"
import { toast } from "#/store/toast"

import { Avatar, genInitials } from "../avatar"
import { Head } from "../head"

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function UpdateProfilePictureDialog() {
  const [isPending, startTransition] = React.useTransition()
  const isOpen = useAppStore((state) => state.dialog.updateProfilePicture)
  const setIsOpen = useAppStore((state) => state.setDialog)

  const handleClose = () => {
    if (isPending) return
    setIsOpen({ updateProfilePicture: false })
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <UpdateProfilePictureDialogContent
          handleClose={handleClose}
          isPending={isPending}
          startTransition={startTransition}
        />
      </DialogContent>
    </DialogRoot>
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
  const user = useAppStore((s) => s.user)

  const [file, setFile] = React.useState<File | null>(null)
  const [reset, setReset] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>(
    user.profilePicture
  )

  const { startUpload, isUploading } = useUploadThing("profilePicture", {
    onClientUploadComplete: (file) => {
      startTransition(async () => {
        await revalidateUser()
      })
      toast.success("Profile picture updated")
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
        toast.success("Profile picture updated")
        handleClose()
      })
    }
  }

  const initials = genInitials(user.firstName, user.lastName)

  return (
    <>
      <Head title="Update profile picture" />
      <FormRoot onSubmit={onSubmit} className="space-y-5">
        <div>
          <DialogTitle>Profile picture</DialogTitle>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
            profilePicture={preview}
            size={96}
            className="size-24 text-4xl"
          />

          <fieldset className="flex flex-col space-y-2" disabled={isLoading}>
            <Badge.Button
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/png, image/jpeg"
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
              <Badge.Icon>
                <UploadIcon />
              </Badge.Icon>
              <span>Pick new</span>
            </Badge.Button>

            <Badge.Button
              onClick={() => {
                setPreview(null)
                setFile(null)
                setReset(true)
              }}
            >
              <Badge.Icon>
                <Trash2Icon />
              </Badge.Icon>
              <span>Remove</span>
            </Badge.Button>
          </fieldset>
        </div>

        <fieldset className="flex space-x-4" disabled={isLoading}>
          <DialogClose asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button className="w-full" isLoading={isLoading}>
            Submit
          </Button>
        </fieldset>
      </FormRoot>
    </>
  )
}

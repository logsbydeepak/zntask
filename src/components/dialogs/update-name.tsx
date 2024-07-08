import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "#/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "#/components/ui/dialog"
import { FormError, FormInput, FormLabel, FormRoot } from "#/components/ui/form"
import { getInitialData } from "#/data"
import { updateName } from "#/data/user"
import { zUpdateName } from "#/data/utils/zSchema"
import { getAppState, useAppStore } from "#/store/app"
import { toast } from "#/store/toast"

import { Head } from "../head"

type FormValues = z.infer<typeof zUpdateName>

type InitialData = {
  firstName: string
  lastName: string | null
}

export function UpdateNameDialog() {
  const appState = getAppState()
  const dialogOpen = useAppStore((state) => state.dialogOpen)
  const isUpdateName = useAppStore((state) => state.dialog.updateName)
  const setDialog = useAppStore((state) => state.setDialog)

  const initialData = React.useRef<InitialData>()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const handleClose = React.useCallback(() => {
    if (isPending) return
    setIsOpen(false)
  }, [isPending])

  React.useEffect(() => {
    if (dialogOpen !== "createCategory" && dialogOpen !== "editCategory") {
      handleClose()
    }
  }, [dialogOpen, handleClose])

  React.useEffect(() => {
    if (isUpdateName) {
      const appData = appState()
      initialData.current = {
        firstName: appData.user.firstName,
        lastName: appData.user.lastName,
      }
      setDialog({ updateName: false })
      setIsOpen(true)
    }
  }, [appState, isUpdateName, setDialog])

  if (!initialData.current) return
  return (
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <UpdateNameDialogContent
          handleClose={handleClose}
          isPending={isPending}
          startTransition={startTransition}
          initialData={initialData.current}
        />
      </DialogContent>
    </DialogRoot>
  )
}

function UpdateNameDialogContent({
  handleClose,
  isPending,
  startTransition,
  initialData,
}: {
  handleClose: () => void
  initialData: InitialData
  isPending: boolean
  startTransition: React.TransitionStartFunction
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(zUpdateName),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
    },
  })

  const onSubmit = (values: FormValues) => {
    if (
      initialData.firstName === values.firstName &&
      initialData.lastName === values.lastName
    ) {
      handleClose()
      return
    }

    startTransition(async () => {
      await updateName(values)
      toast.success("Name updated")
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
              {...register("firstName")}
              placeholder="Haven"
            />
            <FormError>{errors.firstName?.message}</FormError>
          </div>

          <div>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <FormInput
              id="lastName"
              {...register("lastName")}
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

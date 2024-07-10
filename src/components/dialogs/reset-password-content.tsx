import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "#/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "#/components/ui/dialog"
import { FormError, FormInput, FormLabel, FormRoot } from "#/components/ui/form"
import { resetPassword } from "#/data/auth"
import { zResetPassword } from "#/data/utils/zSchema"

import { Head } from "../head"
import { Alert, useAlert } from "../ui/alert"

type FormValues = z.infer<typeof zResetPassword>

export function ResetPasswordDialogContent({
  handleClose,
  isPending,
  startTransition,
}: {
  handleClose: () => void
  isPending: boolean
  startTransition: React.TransitionStartFunction
}) {
  const { alert, setAlert } = useAlert()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(zResetPassword),
  })

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const res = await resetPassword(values)
      switch (res.code) {
        case "OK":
          setAlert({
            message: "Check your email for reset link",
            type: "success",
          })
          break

        case "EMAIL_ALREADY_SENT":
          setAlert({
            message: "Email already sent",
            type: "success",
          })
          break

        case "INVALID_CREDENTIALS":
          setError(
            "email",
            {
              message: "Invalid credentials",
            },
            { shouldFocus: true }
          )
          break
      }
    })
  }

  React.useEffect(() => {
    if (errors) setAlert("close")
  }, [setAlert, errors])

  return (
    <>
      <Head title="Reset Password" />
      <FormRoot onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email to reset password
          </DialogDescription>
        </div>
        <Alert {...alert} align="right" />
        <div>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput
            id="email"
            {...register("email")}
            placeholder="abc@domain.com"
            autoFocus
          />
          <FormError>{errors.email?.message}</FormError>
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

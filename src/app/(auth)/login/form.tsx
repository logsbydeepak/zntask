"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  AccountQuestion,
  ContinueWithGoogle,
  PasswordVisibilityToggle,
  ResetPassword,
  Separator,
} from "#/app/(auth)/components"
import { ResetPasswordDialog } from "#/components/dialogs/reset-password-no-auth"
import { Alert, useAlert } from "#/components/ui/alert"
import { Button } from "#/components/ui/button"
import {
  FormError,
  FormFieldset,
  FormInput,
  FormLabel,
  FormRoot,
} from "#/components/ui/form"
import {
  loginWithCredentials,
  loginWithGoogle,
  redirectGoogleLogin,
} from "#/data/auth"
import { zLoginWithCredentials } from "#/data/utils/zSchema"

type FormValues = z.infer<typeof zLoginWithCredentials>

export function Form() {
  const { alert, setAlert } = useAlert()

  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const [isGoogleLoading, setIsGoogleLoading] = React.useState(() => {
    if (typeof window === "undefined") return false
    return !!window.localStorage.getItem("googleCode")
  })

  const [isCredentialPending, startLoginWithCredentials] = React.useTransition()
  const [isGooglePending, startLoginWithGoogle] = React.useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(zLoginWithCredentials),
  })

  const isLoading = isCredentialPending || isGooglePending || isGoogleLoading

  const defaultError = React.useCallback(() => {
    setAlert({
      type: "destructive",
      message: "Something went wrong!",
    })
  }, [setAlert])

  const handleGoogleCode = React.useCallback(() => {
    const code = window.localStorage.getItem("googleCode")
    if (!code) return
    window.localStorage.removeItem("googleCode")
    startLoginWithGoogle(async () => {
      try {
        const res = await loginWithGoogle({ code })
        const resCode = res?.code

        if (resCode === "INVALID_CREDENTIALS") {
          setAlert({
            type: "destructive",
            message: "Invalid credentials",
          })
        }
      } catch (error) {
        defaultError()
      }
    })
  }, [setAlert, defaultError])

  const handleLoginWithCredentials = (values: FormValues) => {
    if (isLoading) return
    startLoginWithCredentials(async () => {
      try {
        const res = await loginWithCredentials(values)
        const resCode = res?.code

        if (resCode === "INVALID_CREDENTIALS") {
          setAlert({
            type: "destructive",
            message: "Invalid credentials",
          })
        }
      } catch (error) {
        defaultError()
      }
    })
  }

  const handleLoginWithGoogle = () => {
    if (isLoading) return
    startLoginWithGoogle(async () => {
      try {
        await redirectGoogleLogin()
      } catch (error) {
        defaultError()
      }
    })
  }

  React.useEffect(() => {
    handleGoogleCode()
  }, [handleGoogleCode])

  React.useEffect(() => {
    if (isLoading) setAlert("close")
  }, [isLoading, setAlert])

  React.useEffect(() => {
    setIsGoogleLoading(isGooglePending)
  }, [isGooglePending])

  return (
    <>
      <Alert {...alert} align="center" />
      <div className="w-full space-y-3">
        <fieldset disabled={isLoading}>
          <ContinueWithGoogle
            isLoading={isGooglePending || isGoogleLoading}
            onClick={handleLoginWithGoogle}
          />
        </fieldset>
      </div>
      <Separator />
      <FormRoot
        onSubmit={handleSubmit(handleLoginWithCredentials)}
        id="login_credentials_form"
      >
        <FormFieldset disabled={isLoading} className="space-y-2.5">
          <div>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              autoFocus
              {...register("email")}
              placeholder="abc@domain.com"
            />
            <FormError>{errors.email?.message}</FormError>
          </div>

          <div>
            <FormLabel htmlFor="password">Password</FormLabel>

            <FormInput
              id="password"
              {...register("password")}
              placeholder="********"
              type={isPasswordVisible ? "text" : "password"}
            />
            <div className="flex flex-wrap justify-between gap-y-2">
              <div className="mr-4">
                <FormError>{errors.password?.message}</FormError>
              </div>
              <div className="space-x-2">
                <PasswordVisibilityToggle
                  isVisible={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
                <ResetPassword
                  onClick={() => setIsResetPasswordDialogOpen(true)}
                />
              </div>
            </div>
          </div>
        </FormFieldset>
      </FormRoot>
      <fieldset className="w-full" disabled={isLoading}>
        <Button
          className="w-full"
          isLoading={isCredentialPending}
          form="login_credentials_form"
        >
          Login
        </Button>
      </fieldset>
      <AccountQuestion.Container>
        <AccountQuestion.Title>
          Already have an account?{" "}
          <AccountQuestion.Action href="/register" disabled={isLoading}>
            Register
          </AccountQuestion.Action>
        </AccountQuestion.Title>
      </AccountQuestion.Container>
      <ResetPasswordDialog
        isOpen={isResetPasswordDialogOpen}
        setIsOpen={setIsResetPasswordDialogOpen}
      />
    </>
  )
}

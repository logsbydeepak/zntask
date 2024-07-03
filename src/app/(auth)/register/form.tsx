"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDebounce } from "use-debounce"
import { z } from "zod"

import {
  AccountQuestion,
  ContinueWithGoogle,
  passwordChecklist,
  PasswordChecklistItem,
  PasswordVisibilityToggle,
  Separator,
} from "#/app/(auth)/components"
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
  redirectGoogleRegister,
  registerWithCredentials,
  registerWithGoogle,
} from "#/data/auth"
import { zRegisterWithCredentials } from "#/data/utils/zSchema"

type FormValues = z.infer<typeof zRegisterWithCredentials>

export function Form() {
  const { alert, setAlert } = useAlert()

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(() => {
    if (typeof window === "undefined") return false
    return !!window.localStorage.getItem("googleCode")
  })

  const [isCredentialPending, startRegisterWithCredentials] =
    React.useTransition()
  const [isGooglePending, startRegisterWithGoogle] = React.useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(zRegisterWithCredentials),
  })

  const isLoading = isGooglePending || isCredentialPending || isGoogleLoading

  const [watchPassword] = useDebounce(watch("password") ?? "", 500)

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
    startRegisterWithGoogle(async () => {
      try {
        const res = await registerWithGoogle({ code })
        const resCode = res?.code

        if (resCode === "INVALID_CREDENTIALS") {
          setAlert({
            type: "destructive",
            message: "User not found",
          })
        }
        if (resCode === "EMAIL_ALREADY_EXISTS") {
          setAlert({
            type: "destructive",
            message: "Email already exists",
          })
        }
      } catch (error) {
        defaultError()
      }
    })
  }, [setAlert, defaultError])

  const handleRegisterWithCredentials = (values: FormValues) => {
    startRegisterWithCredentials(async () => {
      try {
        const res = await registerWithCredentials(values)
        const resCode = res?.code
        if (resCode === "EMAIL_ALREADY_EXISTS") {
          setError("email", {
            message: "already exists",
          })
        }
      } catch (error) {
        defaultError()
      }
    })
  }

  const handleRegisterWithGoogle = () => {
    if (isLoading) return
    startRegisterWithGoogle(async () => {
      try {
        await redirectGoogleRegister()
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
      <Alert align="center" {...alert} />
      <div className="w-full space-y-3">
        <fieldset disabled={isLoading}>
          <ContinueWithGoogle
            isLoading={isGooglePending || isGoogleLoading}
            onClick={handleRegisterWithGoogle}
          />
        </fieldset>
      </div>

      <Separator />
      <FormRoot
        onSubmit={handleSubmit(handleRegisterWithCredentials)}
        id="register_credentials_form"
      >
        <FormFieldset disabled={isLoading} className="space-y-2.5">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <FormInput
                autoFocus
                id="firstName"
                {...register("firstName")}
                placeholder="Haven"
              />
              <FormError>{errors.firstName?.message}</FormError>
            </div>

            <div className="w-1/2">
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <FormInput
                id="lastName"
                {...register("lastName")}
                placeholder="Thompson"
              />
            </div>
          </div>

          <div>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              {...register("email")}
              placeholder="abc@domain.com"
            />

            {errors.email && <FormError>{errors.email?.message}</FormError>}
          </div>

          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormInput
              id="password"
              {...register("password")}
              placeholder="strong password"
              type={isPasswordVisible ? "text" : "password"}
            />

            <div className="space-y-2.5">
              <div className="flex flex-wrap justify-between gap-y-2">
                <div className="mr-4">
                  <FormError>{errors.password?.message}</FormError>
                </div>
                <PasswordVisibilityToggle
                  isVisible={isPasswordVisible}
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
              </div>

              <div className="inline-flex flex-wrap gap-x-4 gap-y-1">
                {passwordChecklist.map((i) => (
                  <PasswordChecklistItem
                    key={i.label}
                    isValidID={i.condition(watchPassword)}
                  >
                    {i.label}
                  </PasswordChecklistItem>
                ))}
              </div>
            </div>
          </div>

          <div>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <FormInput
              id="confirmPassword"
              {...register("confirmPassword")}
              placeholder="strong password"
              type={isPasswordVisible ? "text" : "password"}
            />
            <FormError>{errors.confirmPassword?.message}</FormError>
          </div>
        </FormFieldset>
      </FormRoot>
      <Button
        className="w-full"
        isLoading={isCredentialPending}
        form="register_credentials_form"
      >
        Register
      </Button>
      <AccountQuestion.Container>
        <AccountQuestion.Title>
          Already have an account?{" "}
          <AccountQuestion.Action href="/login" disabled={isLoading}>
            Login
          </AccountQuestion.Action>
        </AccountQuestion.Title>
      </AccountQuestion.Container>
    </>
  )
}

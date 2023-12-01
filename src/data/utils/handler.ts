import { isRedirectError } from 'next/dist/client/components/redirect'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { isAuth, UnauthorizedError } from './auth'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export function r<CODE extends Uppercase<string>>(c: CODE): { code: CODE }

export function r<CODE extends Uppercase<string>, RES extends object>(
  c: CODE,
  res: RES
): Prettify<{ code: CODE } & RES>

export function r(code: string, res?: object) {
  if (res) {
    return { code: code, ...res }
  }

  if (code) {
    return { code: code }
  }

  throw new Error('Something went wrong!')
}

const hAuth = Object.freeze({
  input: function input<Z extends z.ZodTypeAny>(zod: Z) {
    return Object.freeze({
      fn: function fn<
        FN extends ({
          input,
          userId,
        }: {
          input: z.infer<Z>
          userId: string
          token: string
        }) => Promise<any>,
      >(fn: FN) {
        return async function (input: z.infer<Z>) {
          try {
            const parsedInput = await zod.parseAsync(input)
            const { userId, token } = await isAuth()
            const result = await fn({ input: parsedInput, userId, token })
            return result as FN extends ({
              input,
              userId,
            }: {
              input: z.infer<Z>
              userId: string
              token: string
            }) => Promise<infer R>
              ? R
              : never
          } catch (error) {
            handleError(error)
          }
        }
      },
    })
  },

  fn: function fn<
    FN extends ({ userId }: { userId: string; token: string }) => Promise<any>,
  >(fn: FN) {
    return async function () {
      try {
        const { userId, token } = await isAuth()
        const result = await fn({ userId, token })
        return result as FN extends ({
          userId,
        }: {
          userId: string
        }) => Promise<infer R>
          ? R
          : never
      } catch (error) {
        handleError(error)
      }
    }
  },
})

export const h = Object.freeze({
  input: function input<Z extends z.ZodTypeAny>(zod: Z) {
    return Object.freeze({
      fn: function fn<
        FN extends ({ input }: { input: z.infer<Z> }) => Promise<any>,
      >(fn: FN) {
        return async function (input: z.infer<Z>) {
          try {
            const parsedInput = await zod.parseAsync(input)
            const result = await fn({ input: parsedInput })
            return result as FN extends ({
              input,
            }: {
              input: z.infer<Z>
            }) => Promise<infer R>
              ? R
              : never
          } catch (error) {
            handleError(error)
          }
        }
      },
    })
  },

  fn: function fn<FN extends () => Promise<any>>(fn: FN) {
    return async function () {
      try {
        const result = await fn()
        return result as FN extends () => Promise<infer R> ? R : never
      } catch (error) {
        handleError(error)
      }
    }
  },

  auth: hAuth,
})

function handleError(error: unknown): never {
  if (error instanceof UnauthorizedError) {
    const authCookie = cookies().get('auth')?.value
    redirect(`/logout?auth=${authCookie}`)
  }

  if (isRedirectError(error)) {
    throw error
  }

  console.log(error)

  throw new Error('Something went wrong!')
}

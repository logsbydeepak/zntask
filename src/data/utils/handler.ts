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

// zod | fn
export function h<
  Z extends z.ZodTypeAny,
  FN extends ({ input }: { input: z.infer<Z> }) => Promise<any>,
>(z: Z, fn: FN): (input: z.infer<Z>) => ReturnType<FN>

// fn
export function h<FN extends () => Promise<any>>(fn: FN): () => ReturnType<FN>

// auth + zod + fn
export function h<
  A extends 'AUTH',
  Z extends z.ZodTypeAny,
  FN extends ({
    input,
    userId,
  }: {
    input: z.infer<Z>
    userId: string
    token: string
  }) => Promise<any>,
>(auth: A, z: Z, fn: FN): (input: z.infer<Z>) => ReturnType<FN>

// auth + fn
export function h<
  A extends 'AUTH',
  FN extends ({ userId }: { userId: string; token: string }) => Promise<any>,
>(auth: A, fn: FN): () => ReturnType<FN>

export function h(...args: any[]) {
  // auth
  if (typeof args[0] === 'string') {
    // auth + fn
    if (typeof args[1] === 'function') {
      return async function () {
        try {
          const { userId, token } = await isAuth()
          const result = await args[1]({ userId, token })
          return result
        } catch (error) {
          handleError(error)
        }
      }
    }

    // auth + zod + fn
    if (typeof args[1] === 'object' && typeof args[2] === 'function') {
      return async function (input: any) {
        try {
          const { userId, token } = await isAuth()
          const result = await args[2]({ input, userId, token })
          return result
        } catch (error) {
          handleError(error)
        }
      }
    }
  }

  // zod + fn
  if (typeof args[0] === 'object' && typeof args[1] === 'function') {
    return async function (input: any) {
      try {
        const result = await args[1]({ input })
        return result
      } catch (error) {
        handleError(error)
      }
    }
  }

  // fn
  if (typeof args[0] === 'function') {
    return async function () {
      try {
        const result = await args[0]()
        return result
      } catch (error) {
        handleError(error)
      }
    }
  }

  throw new Error('Something went wrong!')
}

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

const h2 = Object.freeze({
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

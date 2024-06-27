import { isRedirectError } from 'next/dist/client/components/redirect'
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
        FN extends (_: {
          input: z.infer<Z>
          userId: string
          token: string
        }) => Promise<any>,
      >(fn: FN): (input: z.infer<Z>) => Promise<Awaited<ReturnType<FN>>> {
        return async function (input) {
          try {
            const parsedInput = await zod.parseAsync(input)
            const { userId, token } = await isAuth()
            return await fn({ input: parsedInput, userId, token })
          } catch (error) {
            handleError(error)
          }
        }
      },
    })
  },

  fn: function fn<
    FN extends ({ userId }: { userId: string; token: string }) => Promise<any>,
  >(fn: FN): () => Promise<Awaited<ReturnType<FN>>> {
    return async function () {
      try {
        const { userId, token } = await isAuth()
        return await fn({ userId, token })
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
        FN extends (input: { input: z.infer<Z> }) => Promise<any>,
      >(fn: FN): (input: z.infer<Z>) => Promise<Awaited<ReturnType<FN>>> {
        return async function (input) {
          try {
            const parsedInput = await zod.parseAsync(input)
            return await fn({ input: parsedInput })
          } catch (error) {
            handleError(error)
          }
        }
      },
    })
  },

  fn: function fn<FN extends () => Promise<any>>(
    fn: FN
  ): () => Promise<Awaited<ReturnType<FN>>> {
    return async function () {
      try {
        return await fn()
      } catch (error) {
        handleError(error)
      }
    }
  },

  auth: hAuth,
})

function handleError(error: unknown): never {
  if (error instanceof UnauthorizedError) {
    redirect(`/`)
  }

  if (isRedirectError(error)) {
    throw error
  }

  console.error(error)
  throw new Error('Something went wrong!')
}

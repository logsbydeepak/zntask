import { redirect } from 'next/navigation'
import { z } from 'zod'

import { isAuth, UnauthorizedError } from '@/app/(application)/(auth)/utils'

export function r<CODE extends Uppercase<string>>(c: CODE): { code: CODE }

export function r<CODE extends Uppercase<string>, RES extends object>(
  c: CODE,
  res: RES
): { code: CODE; res: RES }

export function r(code: string, res?: object) {
  if (res) {
    return { code: code, res: res }
  }

  if (code) {
    return { code: code }
  }

  throw new Error('Something went wrong!')
}

export function h<
  Z extends z.ZodTypeAny,
  FN extends ({ input }: { input: z.infer<Z> }) => Promise<any>,
>(z: Z, fn: FN): (input: z.infer<Z>) => ReturnType<FN>

export function h<FN extends () => Promise<any>>(fn: FN): () => ReturnType<FN>

export function h<
  A extends 'AUTH',
  Z extends z.ZodTypeAny,
  FN extends ({
    input,
    userId,
  }: {
    input: z.infer<Z>
    userId: string
  }) => Promise<any>,
>(auth: A, z: Z, fn: FN): (input: z.infer<Z>) => ReturnType<FN>

export function h<
  A extends 'AUTH',
  FN extends ({ userId }: { userId: string }) => Promise<any>,
>(auth: A, fn: FN): () => ReturnType<FN>

export function h(...args: any[]) {
  // auth
  if (typeof args[0] === 'string') {
    // auth + zod
    if (typeof args[1] === 'function') {
      return async function () {
        try {
          const { userId } = await isAuth()
          const result = await args[1]({ userId })
          return result
        } catch (error) {
          if (error instanceof UnauthorizedError) {
            redirect('/login')
          }
          throw new Error('Something went wrong!')
        }
      }
    }

    // auth + zod + fn
    if (typeof args[1] === 'object' && typeof args[2] === 'function') {
      return async function (input: any) {
        try {
          const { userId } = await isAuth()
          const result = await args[2]({ input, userId })
          return result
        } catch (error) {
          if (error instanceof UnauthorizedError) {
            redirect('/login')
          }
          throw new Error('Something went wrong!')
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
        console.log(error)
        throw new Error('Something went wrong!')
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
        throw new Error('Something went wrong!')
      }
    }
  }

  throw new Error('Something went wrong!')
}

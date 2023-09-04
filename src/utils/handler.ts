import { z } from 'zod'

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

export function h<FN extends (input: any) => Promise<any>>(
  fn: FN
): () => ReturnType<FN>

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
>(z: Z, fn: FN): (input: z.infer<Z>) => ReturnType<FN>

export function h<
  A extends 'AUTH',
  FN extends ({ userId }: { userId: string }) => Promise<any>,
>(fn: FN): () => ReturnType<FN>

export function h(...args: any[]) {
  // auth
  if (typeof args[0] === 'string') {
    // auth + zod
    if (typeof args[1] === 'function') {
      return async function () {
        try {
          const result = await args[1]({ userId: 'test' })
          return result
        } catch (error) {
          throw new Error('Something went wrong!')
        }
      }
    }

    // auth + zod + fn
    if (typeof args[1] === 'object' && typeof args[2] === 'function') {
      return async function (input: any) {
        try {
          const result = await args[2]({ input, userId: 'test' })
          return result
        } catch (error) {
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

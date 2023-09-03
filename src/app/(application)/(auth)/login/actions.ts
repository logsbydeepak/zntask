'use server'

import { h, r } from '@/utils/handler'

import { schema } from './utils'

export const login = h(schema, async ({ input }) => {
  return r('OK')
})

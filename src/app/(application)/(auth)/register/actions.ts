'use server'

import { h, r } from '@/utils/handler'

import { schema } from './utils'

export const registerWithCredentials = h(schema, async function ({ input }) {
  return r('OK')
})

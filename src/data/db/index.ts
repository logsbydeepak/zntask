import { connect } from '@planetscale/database'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

import { env } from '@/env.mjs'

import * as schema from './schema'

const connection = connect({
  url: env.DATABASE_URL,
})

export const db = drizzle(connection, { schema })
export const dbSchema = schema

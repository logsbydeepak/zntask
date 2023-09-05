import { env } from '#env'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

import { connect } from '@planetscale/database'

import * as schema from './schema'

const connection = connect({
  url: env.DATABASE_URL,
})

export const db = drizzle(connection, { schema })
export const dbSchema = schema

import { env } from '#env'
import { drizzle } from 'drizzle-orm/planetscale-serverless'

import { connect } from '@planetscale/database'

const connection = connect({
  url: env.DATABASE_URL,
})

export const db = drizzle(connection)

import { relations } from 'drizzle-orm'
import { mysqlTable, varchar } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: varchar('id', { length: 26 }).primaryKey(),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }),
  email: varchar('email', { length: 256 }).unique().notNull(),
  profilePicture: varchar('profile_picture', { length: 256 }),
})

export const credentialAuth = mysqlTable('credential_auth', {
  id: varchar('id', { length: 26 }).primaryKey(),
  userId: varchar('user_id', { length: 26 }).notNull(),
  password: varchar('password', { length: 256 }).notNull(),
})

export const googleAuth = mysqlTable('google_auth', {
  id: varchar('id', { length: 26 }).primaryKey(),
  userId: varchar('user_id', { length: 26 }).notNull(),
  googleId: varchar('google_id', { length: 256 }).notNull(),
})

export const userRelations = relations(users, ({ one }) => ({
  credentialAuth: one(credentialAuth),
  googleAuth: one(googleAuth),
}))

export const credentialAuthRelations = relations(credentialAuth, ({ one }) => ({
  user: one(users, {
    fields: [credentialAuth.userId],
    references: [users.id],
  }),
}))

export const googleAuthRelations = relations(googleAuth, ({ one }) => ({
  user: one(users, {
    fields: [googleAuth.userId],
    references: [users.id],
  }),
}))

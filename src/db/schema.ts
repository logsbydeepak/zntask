import { relations } from 'drizzle-orm'
import { boolean, mysqlTable, varchar } from 'drizzle-orm/mysql-core'

import {
  categoryDefaultIndicatorOption,
  categoryIndicatorLabel,
} from '../utils/category'

const id = (name?: string) => varchar(name || 'id', { length: 26 })

const tasks = {
  id: id().primaryKey(),
  userId: id('user_id').notNull(),
  isCompleted: boolean('is_completed').notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  orderId: varchar('order_id', { length: 26 }).notNull(),
  date: varchar('date', { length: 30 }),
  time: varchar('time', { length: 30 }),
  details: varchar('details', { length: 256 }),
}

export const users = mysqlTable('users', {
  id: id().primaryKey(),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }),
  email: varchar('email', { length: 256 }).unique().notNull(),
  profilePicture: varchar('profile_picture', { length: 256 }),
})

export const credentialAuth = mysqlTable('credential_auth', {
  id: id().primaryKey(),
  userId: id('user_id').notNull(),
  password: varchar('password', { length: 256 }).notNull(),
})

export const googleAuth = mysqlTable('google_auth', {
  id: id().primaryKey(),
  userId: id('user_id').notNull(),
  googleId: varchar('google_id', { length: 256 }).notNull(),
})

export const categories = mysqlTable('categories', {
  id: id().primaryKey(),
  userId: id('user_id').notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  indicator: varchar('indicator', {
    length: 256,
    enum: categoryIndicatorLabel,
  })
    .default(categoryDefaultIndicatorOption.label)
    .notNull(),
  isFavorite: boolean('is_favorite').notNull(),
  isArchived: boolean('is_archived').notNull(),
  orderId: varchar('order_id', { length: 26 }).notNull(),
})

export const parentTasks = mysqlTable('parent_tasks', {
  ...tasks,
  categoryId: id('category_id'),
})

export const childTask = mysqlTable('child_tasks', {
  ...tasks,
  parentId: id('parent_id').notNull(),
})

export const categoryRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
}))

export const userRelations = relations(users, ({ one, many }) => ({
  credentialAuth: one(credentialAuth),
  googleAuth: one(googleAuth),
  categories: many(categories),
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

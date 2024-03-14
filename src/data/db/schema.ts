import { relations } from 'drizzle-orm'
import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core'

import {
  categoryDefaultIndicatorOption,
  categoryIndicatorLabel,
} from '../../utils/category'

const id = (name = 'id') => varchar(name, { length: 26 })

const tasks = {
  id: id().primaryKey(),
  userId: id('user_id').notNull(),
  completedAt: varchar('completed_at', { length: 30 }),
  title: varchar('title', { length: 256 }).notNull(),
  orderId: varchar('order_id', { length: 26 }).notNull(),
  date: varchar('date', { length: 30 }),
  time: varchar('time', { length: 30 }),
  details: varchar('details', { length: 256 }),
  categoryId: id('category_id'),
}

export const users = pgTable(
  'users',
  {
    id: id().primaryKey(),
    firstName: varchar('first_name', { length: 256 }).notNull(),
    lastName: varchar('last_name', { length: 256 }),
    email: varchar('email', { length: 256 }).unique().notNull(),
    profilePicture: varchar('profile_picture', { length: 256 }),
  },
  (table) => {
    return {
      emailIdx: index('email_idx').on(table.email),
    }
  }
)

export const passwordAuth = pgTable('password_auth', {
  id: id().primaryKey(),
  password: varchar('password', { length: 256 }).notNull(),
})

export const googleAuth = pgTable('google_auth', {
  id: id().primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
})

export const categories = pgTable(
  'categories',
  {
    userId: id('user_id').notNull(),
    id: id().primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
    indicator: varchar('indicator', {
      length: 256,
      enum: categoryIndicatorLabel,
    })
      .default(categoryDefaultIndicatorOption.label)
      .notNull(),
    orderNumber: integer('order_number'),
    favoriteOrderNumber: integer('favorite_order_number'),
    archivedAt: varchar('archived_at', { length: 30 }),
  },
  (table) => {
    return {
      userIdIdx: index('categories_user_id_idx').on(table.userId),
    }
  }
)

export const parentTasks = pgTable('parent_tasks', tasks, (table) => {
  return {
    userIdIdx: index('parent_tasks_user_id_idx').on(table.userId),
  }
})

export const childTask = pgTable(
  'child_tasks',
  {
    ...tasks,
    parentId: id('parent_id').notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('child_tasks_user_id_idx').on(table.userId),
    }
  }
)

export const userRelations = relations(users, ({ one, many }) => ({
  passwordAuth: one(passwordAuth),
  googleAuth: one(googleAuth),

  categories: many(categories),
  parentTasks: many(parentTasks),
  childTasks: many(childTask),
}))

export const categoryRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
}))

export const parentTaskRelations = relations(parentTasks, ({ one, many }) => ({
  user: one(users, {
    fields: [parentTasks.userId],
    references: [users.id],
  }),
}))

export const childTaskRelations = relations(childTask, ({ one, many }) => ({
  user: one(users, {
    fields: [childTask.userId],
    references: [users.id],
  }),
}))

export const passwordAuthRelations = relations(passwordAuth, ({ one }) => ({
  user: one(users, {
    fields: [passwordAuth.id],
    references: [users.id],
  }),
}))

export const googleAuthRelations = relations(googleAuth, ({ one }) => ({
  user: one(users, {
    fields: [googleAuth.id],
    references: [users.id],
  }),
}))

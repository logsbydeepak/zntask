import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  int,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core'

import {
  categoryDefaultIndicatorOption,
  categoryIndicatorLabel,
} from '../../utils/category'

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
  categoryId: id('category_id'),
}

export const users = mysqlTable(
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

export const credentialAuth = mysqlTable(
  'credential_auth',
  {
    id: id().primaryKey(),
    userId: id('user_id').notNull(),
    password: varchar('password', { length: 256 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    }
  }
)

export const googleAuth = mysqlTable(
  'google_auth',
  {
    id: id().primaryKey(),
    userId: id('user_id').notNull(),
    email: varchar('email', { length: 256 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    }
  }
)

export const categories = mysqlTable(
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
    orderNumber: int('order_number').notNull(),
    favoriteOrderNumber: int('favorite_order_number').notNull(),
    archivedAt: varchar('archived_at', { length: 30 }),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    }
  }
)

export const parentTasks = mysqlTable('parent_tasks', tasks, (table) => {
  return {
    userIdIdx: index('user_id_idx').on(table.userId),
  }
})

export const childTask = mysqlTable(
  'child_tasks',
  {
    ...tasks,
    parentId: id('parent_id').notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
    }
  }
)

export const userRelations = relations(users, ({ one, many }) => ({
  credentialAuth: one(credentialAuth),
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

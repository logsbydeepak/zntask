import { z } from "zod"

import { zRequired } from "#/utils/zSchema"

import { db, dbSchema } from "./db"
import { h, r } from "./utils/handler"

const zCreateParentTask = z.object({
  id: zRequired,
  title: zRequired,
  date: zRequired,
  time: zRequired,
  details: zRequired,
  categoryId: zRequired.nullable(),
  createdAt: zRequired,
  completedAt: zRequired.nullable(),
})

export const createParentTask = h.auth
  .input(zCreateParentTask)
  .fn(async function ({ input, userId }) {
    let createdAt = new Date(input.createdAt)

    if (input.completedAt === null) {
    }

    if (isNaN(createdAt.getTime())) {
      createdAt = new Date()
    }

    const [res] = await db
      .insert(dbSchema.parentTasks)
      .values({
        userId,
        title: input.title,
        details: input.details,
        createdAt: createdAt.toISOString(),
        id: input.id,
        date: input.date,
        time: input.time,
        categoryId: input.categoryId,
        completedAt: input.completedAt,
      })
      .returning({ id: dbSchema.categories.id })

    if (!res) {
      throw new Error("id should be present")
    }

    return r("OK", {
      id: res.id,
    })
  })

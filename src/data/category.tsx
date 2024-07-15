import { eq } from "drizzle-orm"
import { z } from "zod"

import { genID } from "#/shared/id"
import { zCategoryIndicator } from "#/utils/category"
import { zRequired } from "#/utils/zSchema"

import { db, dbSchema } from "./db"
import { h, r } from "./utils/handler"

const zCreateCategory = z.object({
  title: zRequired,
  indicator: zCategoryIndicator,
  favoriteAt: z.string().nullable(),
  archivedAt: z.string().nullable(),
})

export const createCategory = h.auth
  .input(zCreateCategory)
  .fn(async ({ userId, input }) => {
    const id = genID()

    await db.insert(dbSchema.categories).values({
      userId,
      id,
      title: input.title,
      archivedAt: input.archivedAt,
      favoriteAt: input.favoriteAt,
      indicator: input.indicator,
    })

    return r("OK")
  })

export const editCategory = h.auth
  .input(zCreateCategory)
  .fn(async ({ userId, input }) => {
    const id = genID()

    const [res] = await db
      .update(dbSchema.categories)
      .set({
        userId,
        id,
        title: input.title,
        archivedAt: input.archivedAt,
        favoriteAt: input.favoriteAt,
        indicator: input.indicator,
      })
      .returning({ id: dbSchema.categories.id })

    if (!res) {
      return r("NOT_FOUND")
    }

    return r("OK")
  })

export const deleteCategory = h.auth
  .input(z.object({ id: zRequired }))
  .fn(async () => {
    const id = genID()

    const [res] = await db
      .delete(dbSchema.categories)
      .where(eq(dbSchema.categories.id, id))
      .returning({
        id: dbSchema.categories.id,
      })

    if (!res) {
      return r("NOT_FOUND")
    }

    return r("OK")
  })

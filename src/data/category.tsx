"use server"

import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { genID, isValidID } from "#/shared/id"
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

    const [res] = await db
      .insert(dbSchema.categories)
      .values({
        userId,
        id,
        title: input.title,
        archivedAt: input.archivedAt,
        favoriteAt: input.favoriteAt,
        indicator: input.indicator,
      })
      .returning({ id: dbSchema.categories.id })

    if (!id) {
      throw new Error("id should be present")
    }

    return r("OK", {
      id: res.id,
    })
  })

const zEditCategory = zCreateCategory.extend({
  id: zRequired,
})

export const editCategory = h.auth
  .input(zEditCategory)
  .fn(async ({ userId, input }) => {
    const [res] = await db
      .update(dbSchema.categories)
      .set({
        title: input.title,
        archivedAt: input.archivedAt,
        favoriteAt: input.favoriteAt,
        indicator: input.indicator,
      })
      .where(
        and(
          eq(dbSchema.categories.id, input.id),
          eq(dbSchema.categories.userId, userId)
        )
      )
      .returning({ id: dbSchema.categories.id })

    if (!res) {
      return r("NOT_FOUND")
    }

    return r("OK")
  })

export const deleteCategory = h.auth
  .input(z.object({ id: zRequired }))
  .fn(async ({ input, userId }) => {
    const [res] = await db
      .delete(dbSchema.categories)
      .where(
        and(
          eq(dbSchema.categories.id, input.id),
          eq(dbSchema.categories.userId, userId)
        )
      )
      .returning({
        id: dbSchema.categories.id,
      })

    if (!res) {
      return r("NOT_FOUND")
    }

    return r("OK")
  })

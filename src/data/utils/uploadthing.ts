import { revalidatePath, revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { db, dbSchema } from '../db'
import { isAuth } from './auth'
import { utapi } from './config'
import { r } from './handler'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      return await isAuth()
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const user = await db.query.users.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, metadata.userId)
        },
      })

      if (!user) throw new Error('User not found!')

      if (user.profilePicture) {
        await utapi.deleteFiles(user?.profilePicture)
        await db
          .update(dbSchema.users)
          .set({ profilePicture: null })
          .where(eq(dbSchema.users.id, metadata.userId))
      }

      await db
        .update(dbSchema.users)
        .set({ profilePicture: file.key })
        .where(eq(dbSchema.users.id, metadata.userId))

      return r('OK')
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

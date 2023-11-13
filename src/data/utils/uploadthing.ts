import { eq } from 'drizzle-orm'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { db, dbSchema } from '../db'
import { isAuth } from './auth'
import { r } from './handler'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      return await isAuth()
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(dbSchema.users)
        .set({ profilePicture: file.url })
        .where(eq(dbSchema.users.id, metadata.userId))

      return r('OK')
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

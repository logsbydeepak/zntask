import { createNextRouteHandler } from "uploadthing/next"

import { ourFileRouter } from "#/data/utils/uploadthing"

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
})

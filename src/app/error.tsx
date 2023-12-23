'use client'

import { BaseLayout } from '@/components/base-layout'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <BaseLayout>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </BaseLayout>
  )
}

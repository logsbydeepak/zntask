import type { Metadata } from 'next'
import Link from 'next/link'

import { BaseLayout } from '@/components/base-layout'

export const metadata: Metadata = {
  title: '404',
}

export default function NotFound() {
  return (
    <BaseLayout>
      <h2>Not Found</h2>
      <Link href="/">Return Home</Link>
    </BaseLayout>
  )
}

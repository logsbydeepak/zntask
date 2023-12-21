import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404',
}

export default function NotFound() {
  return (
    <html>
      <body>
        <h2>Not Found</h2>
        <Link href="/">Return Home</Link>
      </body>
    </html>
  )
}

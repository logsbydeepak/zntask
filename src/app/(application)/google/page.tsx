'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  React.useEffect(() => {
    const type = searchParams.get('type')
    const code = searchParams.get('code')

    if (type === 'login') {
      router.replace(`/login?code=${code}`)
    }
    if (type === 'register') {
      router.replace(`/register?code=${code}`)
    }
    if (type === 'new') {
      router.replace(`/user?code=${code}`)
    }
  }, [searchParams, router])

  return null
}

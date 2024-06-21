'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Page() {
  return (
    <Suspense>
      <Redirect />
    </Suspense>
  )
}

function Redirect() {
  const searchParams = useSearchParams()
  const router = useRouter()

  React.useEffect(() => {
    const type = searchParams.get('type')
    const code = searchParams.get('code')

    if (code) {
      window.localStorage.setItem('googleCode', code)
      if (type === 'login') {
        router.replace('/login')
      }
      if (type === 'register') {
        router.replace('/register')
      }
      if (type === 'new') {
        router.replace('/user')
      }
    }
  }, [searchParams, router])

  return null
}

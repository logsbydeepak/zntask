'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const code = useSearchParams().get('code')

  React.useEffect(() => {
    const bc = new BroadcastChannel('google_auth')
    bc.postMessage({ code })
    window.close()
    return () => bc.close()
  }, [code])

  return null
}

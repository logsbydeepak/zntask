'use client'

import { startTransition } from 'react'
import { useRouter } from 'next/navigation'

import { LogoIcon } from '@/components/icon/logo'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  function handleReset() {
    startTransition(() => {
      router.refresh()
      reset()
    })
  }

  return (
    <div className="absolute flex min-h-full w-full items-center justify-center text-center">
      <div className="flex w-80 flex-col space-y-6 p-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-orange-9 bg-gradient-to-b from-white/5 to-black/10 text-white">
            <span className="size-4">
              <LogoIcon />
            </span>
          </span>
          <span className="text-lg font-medium">zntask</span>
        </div>

        <div className="space-y-4">
          <Alert
            message="Something went wrong!"
            type="destructive"
            isOpen
            align="center"
          />
          <Button className="w-full" intent="secondary" onClick={handleReset}>
            Tray again
          </Button>
        </div>
      </div>
    </div>
  )
}

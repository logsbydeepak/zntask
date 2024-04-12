import type { Metadata } from 'next'
import Link from 'next/link'

import { LogoIcon } from '@/components/icon/logo'
import { Alert } from '@/components/ui/alert'
import { buttonStyle } from '@/components/ui/button'
import { cn } from '@/utils/style'

export const metadata: Metadata = {
  title: '404',
}

export default function NotFound() {
  return (
    <>
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
              message="Not Found"
              type="destructive"
              isOpen
              align="center"
            />
            <Link
              className={cn(buttonStyle({ intent: 'secondary' }), 'w-full')}
              href="/"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

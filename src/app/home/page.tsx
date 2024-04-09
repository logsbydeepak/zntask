import Link from 'next/link'

import { LogoIcon } from '@/components/icon/logo'
import { ThemeSwitch } from '@/components/theme'
import { buttonStyle } from '@/components/ui/button'
import { cn } from '@/utils/style'

export default function Home() {
  return (
    <div className="absolute flex min-h-full w-full items-center justify-center">
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
          <Link
            href="/register"
            className={cn(buttonStyle({ intent: 'primary' }), 'w-full')}
          >
            Register
          </Link>
          <Link
            href="/login"
            className={cn(buttonStyle({ intent: 'secondary' }), 'w-full')}
          >
            Login
          </Link>
        </div>
        <ThemeSwitch />
      </div>
    </div>
  )
}

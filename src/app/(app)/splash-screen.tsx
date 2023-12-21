import { LoaderIcon } from 'lucide-react'

import { LogoIcon } from '@/components/icon/logo'

export function SplashScreen() {
  return (
    <div className="flex h-[calc(100vh-50px)] flex-col items-center justify-center space-y-2">
      <span className="flex size-10 items-center justify-center rounded-full bg-orange-600 text-white">
        <LogoIcon className="size-4" />
      </span>
      <span className="h-5 w-5">
        <LoaderIcon className="size-full animate-spin text-gray-600" />
      </span>
    </div>
  )
}

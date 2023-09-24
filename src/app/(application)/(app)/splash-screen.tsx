import { LoaderIcon } from 'lucide-react'

import { LogoIcon } from '@/components/icon/logo'

export function SplashScreen() {
  return (
    <div className="flex h-[calc(100vh-50px)] flex-col items-center justify-center space-y-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white">
        <LogoIcon className="h-4 w-4" />
      </span>
      <span className="h-5 w-5">
        <LoaderIcon className="h-full w-full animate-spin text-gray-600" />
      </span>
    </div>
  )
}

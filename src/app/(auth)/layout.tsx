import { ThemeSwitch } from '@/components/theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute min-h-full w-full items-center justify-center md:flex">
        <div className="absolute z-10 hidden size-full *:absolute *:size-full md:block">
          <div className="auth-layout-square" />
          <div className="bg-gradient-to-t from-gray-1/70 to-gray-3/20" />
        </div>

        <div className="z-20 flex w-full flex-col items-center space-y-6 border-gray-4 p-6 sm:p-8 md:my-[180px] md:w-[500px] md:rounded-xl md:border md:bg-gray-1 md:p-10 md:drop-shadow-md">
          {children}
          <ThemeSwitch />
        </div>
      </div>
    </>
  )
}

import { ThemeSwitch } from '@/components/theme'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute inset-0 hidden *:absolute *:inset-0 md:block">
        {/* <div className="bg-auth-layout-gradient opacity-20" /> */}
        <div className="auth-layout-square" />
        <div className="bg-gradient-to-t from-gray-1/70 to-gray-3/20" />
      </div>

      <div className="absolute flex min-h-full w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-6 border-gray-4 p-6 sm:p-8 md:my-[180px]  md:w-[500px] md:rounded-xl md:border md:border-gray-4 md:bg-gray-1 md:p-10 md:drop-shadow-md">
          {children}
          <ThemeSwitch />
        </div>
      </div>
    </>
  )
}

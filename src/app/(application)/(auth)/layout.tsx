import { Theme } from './client-components'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="items-center justify-center bg-gray-50 md:flex">
      <div className="flex flex-col items-center space-y-6 border-gray-100 bg-white p-4 sm:p-8 md:my-[180px] md:w-[500px] md:rounded-md md:border md:p-10 md:shadow-sm md:drop-shadow-sm">
        {children}
        <Theme />
      </div>
    </div>
  )
}

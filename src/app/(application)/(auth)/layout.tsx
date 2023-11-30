import { Navbar } from './client-components'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="w-full items-center justify-center md:flex">
        <div className="w-full border-gray-100 bg-white md:my-[100px] md:w-[500px] md:rounded-md md:border md:shadow-sm md:drop-shadow-sm">
          {children}
        </div>
      </div>
      <div className="pattern fixed inset-0 -z-10 bg-gray-50/50" />
    </>
  )
}

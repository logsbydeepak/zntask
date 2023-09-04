export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full items-center justify-center md:flex">
      <div className="w-full border-gray-100 p-12 md:mt-36 md:w-[500px] md:rounded-md md:border">
        {children}
      </div>
    </div>
  )
}

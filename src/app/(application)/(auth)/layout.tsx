export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full items-center justify-center md:flex">{children}</div>
  )
}

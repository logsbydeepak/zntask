export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="block">
      <div className="w-80">{children}</div>
    </div>
  )
}

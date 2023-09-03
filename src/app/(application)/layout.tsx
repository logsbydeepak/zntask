import { ToastProvider } from '@/components/toast'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastProvider />
    </>
  )
}

import { JotaiProvider, ThemeProvider } from '@/components/client-providers'
import { ToastProvider } from '@/components/toast'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider>
        {children}
        <ToastProvider />
      </ThemeProvider>
    </JotaiProvider>
  )
}

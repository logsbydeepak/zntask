import { ToastProvider } from '@/components/toast'

import { ThemeProvider } from './client-components'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <ToastProvider />
    </ThemeProvider>
  )
}

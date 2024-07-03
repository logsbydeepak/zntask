import { GeistSans } from "geist/font/sans"

import { cn } from "#/utils/style"

import "./globals.css"

import type { Metadata } from "next"

import { ThemeProvider } from "#/components/theme"

export const metadata: Metadata = {
  title: "zntask",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          GeistSans.variable,
          "overflow-y-scroll bg-gray-1 font-sans text-gray-12"
        )}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

import React, { Suspense } from "react"
import { LoaderIcon } from "lucide-react"

import { Dialogs } from "#/components/dialogs"
import { LogoIcon } from "#/components/icon/logo"
import {
  DelayRender,
  GlobalShortcut,
  State,
  SyncAppState,
} from "#/components/state"
import { Sync } from "#/components/sync"
import { ToastProvider } from "#/components/toast"
import { getUser } from "#/data/user"
import { AppProvider } from "#/store/app"

import { AppLayout } from "./app-layout"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<Loading />}>
      <DelayRender>
        <InitData>
          <Sync />
          <Navbar />
          <State />
          <Sidebar />
          <AppLayout>{children}</AppLayout>
          <GlobalShortcut />
          <Dialogs />
        </InitData>
      </DelayRender>
      <ToastProvider />
    </Suspense>
  )
}

async function InitData({ children }: { children: React.ReactNode }) {
  // const initialData = await getInitialData()
  const user = await getUser()
  return (
    <AppProvider initialProps={{ user: user }}>
      <SyncAppState user={user} />
      {children}
    </AppProvider>
  )
}

function Loading() {
  return (
    <div className="flex h-[calc(100vh-50px)] flex-col items-center justify-center space-y-2">
      <span className="flex size-10 items-center justify-center rounded-full bg-orange-9 text-white">
        <LogoIcon className="size-4" />
      </span>
      <span className="size-5">
        <LoaderIcon className="size-full animate-spin text-gray-11" />
      </span>
    </div>
  )
}

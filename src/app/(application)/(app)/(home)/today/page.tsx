'use client'

import React from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { isToday } from 'date-fns'
import { CalendarClockIcon } from 'lucide-react'
import { useShallow } from 'zustand/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { Task, useTaskStore } from '@/store/task'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Today</Layout.Title>
        <Head title="Today" />
      </Layout.Header>
      <Layout.Content>
        <Tabs.Root defaultValue="planed">
          <Tabs.List className="inline-flex space-x-2 rounded-lg bg-gray-100 p-1.5">
            <TabsTrigger value="planed">Planed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </Tabs.List>
          <Tabs.Content value="planed">
            <PlanedTab />
          </Tabs.Content>
          <Tabs.Content value="completed">
            <CompletedTab />
          </Tabs.Content>
        </Tabs.Root>
      </Layout.Content>
    </Layout.Root>
  )
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof Tabs.Trigger>,
  React.ComponentProps<typeof Tabs.Trigger>
>((props, ref) => (
  <Tabs.Trigger
    {...props}
    ref={ref}
    className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:text-gray-950 aria-[selected=true]:bg-white aria-[selected=true]:text-gray-950 aria-[selected=true]:shadow-sm aria-[selected=true]:drop-shadow-sm"
  />
))
TabsTrigger.displayName = Tabs.Trigger.displayName

function PlanedTab() {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.tasks.filter((i) => i.date && isToday(new Date(i.date)))
    )
  )

  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <>
      {tasks.length === 0 && <EmptyState />}

      {tasks.map((i) => (
        <p key={i.id} onClick={() => setDialog('editTask', i)}>
          {i.title}
        </p>
      ))}
    </>
  )
}

function CompletedTab() {
  const tasks: Task[] = []

  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <>
      {tasks.length === 0 && <EmptyState />}

      {tasks.map((i) => (
        <p key={i.id} onClick={() => setDialog('editTask', i)}>
          {i.title}
        </p>
      ))}
    </>
  )
}

function ArchivedTab() {
  const tasks: Task[] = []
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <>
      {tasks.length === 0 && <EmptyState />}
      {tasks.map((i) => (
        <p key={i.id} onClick={() => setDialog('editTask', i)}>
          {i.title}
        </p>
      ))}
    </>
  )
}

function EmptyState() {
  return (
    <Layout.Empty.Container>
      <Layout.Empty.Icon>
        <CalendarClockIcon className="h-full w-full" />
      </Layout.Empty.Icon>
      <Layout.Empty.Label>No task</Layout.Empty.Label>
    </Layout.Empty.Container>
  )
}

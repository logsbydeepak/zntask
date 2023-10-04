'use client'

import React from 'react'
import { isToday } from 'date-fns'
import { CalendarClockIcon } from 'lucide-react'
import { useShallow } from 'zustand/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { Task, useTaskStore } from '@/store/task'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@ui/tabs'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Today</Layout.Title>
        <Head title="Today" />
      </Layout.Header>
      <Layout.Content>
        <TabsRoot defaultValue="planed">
          <TabsList>
            <TabsTrigger value="planed">Planed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="planed">
            <PlanedTab />
          </TabsContent>
          <TabsContent value="completed">
            <CompletedTab />
          </TabsContent>
        </TabsRoot>
      </Layout.Content>
    </Layout.Root>
  )
}

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

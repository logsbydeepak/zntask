'use client'

import React from 'react'
import { isToday } from 'date-fns'
import { CalendarClockIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import * as Tabs from '@/components/ui/tabs'
import { useAppStore } from '@/store/app'
import { ParentTask, useTaskStore } from '@/store/task'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Today</Layout.Title>
        <Head title="Today" />
      </Layout.Header>
      <Layout.Content>
        <Tabs.Root defaultValue="planed">
          <Tabs.List>
            <Tabs.Trigger value="planed">Planed</Tabs.Trigger>
            <Tabs.Trigger value="completed">Completed</Tabs.Trigger>
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

function PlanedTab() {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.parentTasks.filter((i) => i.date && isToday(new Date(i.date)))
    )
  )

  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <>
      {tasks.length === 0 && <EmptyState />}

      {tasks.map((i) => (
        <p
          key={i.id}
          onClick={() => setDialog({ editTask: { parentTaskId: i.id } })}
        >
          {i.title}
        </p>
      ))}
    </>
  )
}

function CompletedTab() {
  const tasks: ParentTask[] = []

  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <>
      {tasks.length === 0 && <EmptyState />}

      {tasks.map((i) => (
        <p
          key={i.id}
          onClick={() => setDialog({ editTask: { parentTaskId: i.id } })}
        >
          {i.title}
        </p>
      ))}
    </>
  )
}

function ArchivedTab() {
  const tasks: ParentTask[] = []
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <>
      {tasks.length === 0 && <EmptyState />}
      {tasks.map((i) => (
        <p
          key={i.id}
          onClick={() => setDialog({ editTask: { parentTaskId: i.id } })}
        >
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
        <CalendarClockIcon />
      </Layout.Empty.Icon>
      <Layout.Empty.Label>No task</Layout.Empty.Label>
    </Layout.Empty.Container>
  )
}

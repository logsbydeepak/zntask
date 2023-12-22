'use client'

import React from 'react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useTaskStore } from '@/store/task'
import { DNDProvider } from '@/utils/dnd'

import { EmptyInbox, TaskContainer } from '../task'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Inbox</Layout.Title>
        <Head title="Inbox" />
      </Layout.Header>
      <Layout.Content>
        <TabsRoot defaultValue="planed">
          <TabsList>
            <TabsTrigger value="planed">Planed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="planed">
            <div className="mt-4">
              <PlanedTab />
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="mt-4">
              <CompletedTab />
            </div>
          </TabsContent>
        </TabsRoot>
      </Layout.Content>
    </Layout.Root>
  )
}

function PlanedTab() {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.parentTasks
        .filter((i) => !i.categoryId && !!!i.completedAt)
        .sort((a, b) => (a.orderId > b.orderId ? 1 : -1))
    )
  )

  if (tasks.length === 0) return <EmptyInbox />
  return (
    <div className="space-y-2">
      <DNDProvider onDrop={() => {}}>
        {tasks.map((i, idx) => (
          <TaskContainer key={i.id} task={i} index={idx} />
        ))}
      </DNDProvider>
    </div>
  )
}

function CompletedTab() {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.parentTasks.filter((i) => !i.categoryId && !!i.completedAt)
    )
  )

  if (tasks.length === 0) return <EmptyInbox />

  return (
    <div className="space-y-2 ">
      {tasks.map((i, idx) => (
        <TaskContainer key={i.id} task={i} index={idx} />
      ))}
    </div>
  )
}
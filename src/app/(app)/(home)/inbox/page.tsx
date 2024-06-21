'use client'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useAppStore } from '@/store/app'

import { EmptyInbox, TaskContainer, TaskItem } from '../task'

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
  const tasks = useAppStore((s) =>
    s.parentTasks
      .filter((i) => !i.categoryId && !!!i.completedAt)
      .sort((a, b) => (a.orderId > b.orderId ? 1 : -1))
  )

  if (tasks.length === 0) return <EmptyInbox />
  return (
    <TaskContainer>
      {tasks.map((i) => (
        <TaskItem key={i.id} task={i} />
      ))}
    </TaskContainer>
  )
}

function CompletedTab() {
  const tasks = useAppStore((s) =>
    s.parentTasks.filter((i) => !i.categoryId && !!i.completedAt)
  )

  if (tasks.length === 0) return <EmptyInbox />

  return (
    <TaskContainer>
      {tasks.map((i) => (
        <TaskItem key={i.id} task={i} />
      ))}
    </TaskContainer>
  )
}

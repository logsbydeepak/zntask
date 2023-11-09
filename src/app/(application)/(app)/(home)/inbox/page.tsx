'use client'

import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useTaskStore } from '@/store/task'

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
      s.parentTasks.filter((i) => !i.categoryId && !i.isCompleted)
    )
  )

  if (tasks.length === 0) return <EmptyInbox />
  return (
    <div className="space-y-1">
      {tasks.map((i) => (
        <TaskContainer key={i.id} task={i} />
      ))}
    </div>
  )
}

function CompletedTab() {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.parentTasks.filter((i) => !i.categoryId && i.isCompleted)
    )
  )

  if (tasks.length === 0) return <EmptyInbox />

  return (
    <div className="space-y-1">
      {tasks.map((i) => (
        <TaskContainer key={i.id} task={i} />
      ))}
    </div>
  )
}

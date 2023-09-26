'use client'

import { InboxIcon } from 'lucide-react'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useTaskStore } from '@/store/task'

export default function Page() {
  const tasks = useTaskStore((s) => s.tasks)

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Inbox</Layout.Title>
        <Head title="Inbox" />
      </Layout.Header>
      <Layout.Content>
        {tasks.length === 0 && (
          <Layout.Empty.Container>
            <Layout.Empty.Icon>
              <InboxIcon className="h-full w-full" />
            </Layout.Empty.Icon>
            <Layout.Empty.Label>No task</Layout.Empty.Label>
          </Layout.Empty.Container>
        )}

        {tasks.map((i) => (
          <p key={i.id}>{i.title}</p>
        ))}
      </Layout.Content>
    </Layout.Root>
  )
}

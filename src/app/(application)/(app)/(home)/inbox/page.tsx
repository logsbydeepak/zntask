'use client'

import { InboxIcon } from 'lucide-react'
import { useShallow } from 'zustand/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { useTaskStore } from '@/store/task'

export default function Page() {
  const tasks = useTaskStore(
    useShallow((s) => s.tasks.filter((i) => !i.categoryId))
  )
  const setDialog = useAppStore((s) => s.setDialog)

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
          <p key={i.id} onClick={() => setDialog('editTask', i)}>
            {i.title}
          </p>
        ))}
      </Layout.Content>
    </Layout.Root>
  )
}

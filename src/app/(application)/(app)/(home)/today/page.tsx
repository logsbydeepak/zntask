'use client'

import { isToday } from 'date-fns'
import { CalendarClockIcon } from 'lucide-react'
import { useShallow } from 'zustand/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { useTaskStore } from '@/store/task'

export default function Page() {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.tasks.filter((i) => i.date && isToday(new Date(i.date)))
    )
  )
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Today</Layout.Title>
        <Head title="Today" />
      </Layout.Header>
      <Layout.Content>
        {tasks.length === 0 && (
          <Layout.Empty.Container>
            <Layout.Empty.Icon>
              <CalendarClockIcon className="h-full w-full" />
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

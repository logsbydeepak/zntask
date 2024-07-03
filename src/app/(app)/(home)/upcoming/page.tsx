"use client"

import { GanttChartIcon } from "lucide-react"

import * as Layout from "#/app/(app)/app-layout"
import { Head } from "#/components/head"

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Upcoming</Layout.Title>
        <Head title="Upcoming" />
      </Layout.Header>
      <Layout.Content>
        <EmptyState />
      </Layout.Content>
    </Layout.Root>
  )
}

function EmptyState() {
  return (
    <Layout.Empty.Container>
      <Layout.Empty.Icon>
        <GanttChartIcon />
      </Layout.Empty.Icon>
      <Layout.Empty.Label>No task</Layout.Empty.Label>
    </Layout.Empty.Container>
  )
}

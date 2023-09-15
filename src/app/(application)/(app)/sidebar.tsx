'use client'

import React from 'react'
import Link from 'next/link'

import { useCategoryStore } from '@/store/category'
import { cn } from '@/utils/style'

export function Sidebar() {
  const categories = useCategoryStore((state) => state.categories)

  return (
    <aside className="fixed bottom-0 top-14 w-56 overflow-y-scroll border-r border-gray-200 bg-white">
      <div className="space-y-4">
        <div>
          <QuickSection />
        </div>
        <div>
          <FavoriteSection />
        </div>
        <div>
          <CategorySection />
        </div>
      </div>
    </aside>
  )
}

function QuickSection() {
  const item = [
    {
      label: 'today',
      href: '/today',
    },
    { label: 'inbox', href: '/inbox' },
    {
      label: 'upcoming',
      href: '/upcoming',
    },
    {
      label: 'favorite',
      href: '/favorite',
    },
    {
      label: 'category',
      href: '/category',
    },
  ]

  return (
    <>
      {item.map((item) => (
        <Item key={item.label} href={item.href}>
          {item.label}
        </Item>
      ))}
    </>
  )
}

function FavoriteSection() {
  return (
    <>
      <Title>Favorite</Title>
    </>
  )
}

function CategorySection() {
  const categories = useCategoryStore((s) => s.categories)

  return (
    <>
      <Title>Category</Title>
      {categories.map((c) => (
        <Item key={c.id} href={`/category/${c.id}`}>
          {c.title}
        </Item>
      ))}
    </>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return <h3>{children}</h3>
}

function Item({
  children,
  href,
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link href={href} {...props} className={cn('block', className)}>
      {children}
    </Link>
  )
}

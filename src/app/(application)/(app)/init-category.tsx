'use client'

import React, { useEffect } from 'react'
import bcrypt from 'bcryptjs'

import { useCategoryStore } from '@/store/category'

import { getInitCategories } from './actions'

export function InitCategories() {
  const renderCount = React.useRef(0)
  const [isPending, startTransaction] = React.useTransition()

  const category = useCategoryStore((s) => s.category)
  const addCategories = useCategoryStore((s) => s.addCategories)

  useEffect(() => {
    if (renderCount.current) return
    const hash = bcrypt.hashSync(JSON.stringify(category), 10)

    startTransaction(async () => {
      const res = await getInitCategories({ hash })
      if (res.code === 'OK') {
        addCategories(res.categories)
      }
    })

    renderCount.current++
  }, [category, addCategories])

  return null
}

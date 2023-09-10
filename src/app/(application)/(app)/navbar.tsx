'use client'

import Link from 'next/link'
import Avvvatars from 'avvvatars-react'

import * as Avatar from '@radix-ui/react-avatar'

export function Navbar({
  firstName,
  lastName,
  profilePicture,
}: {
  firstName: string
  lastName: string | null
  profilePicture: string | null
}) {
  const name = `${firstName} ${lastName}`
  return (
    <nav className="flex justify-between">
      <Link href="/">zntask</Link>
      <div>
        <p>{name}</p>
        <Avatar.Root>
          <Avatar.Image src={profilePicture || ''}>1</Avatar.Image>
          <Avatar.Fallback>
            <Avvvatars value={name} style="shape" shadow={true} />
          </Avatar.Fallback>
        </Avatar.Root>
      </div>
    </nav>
  )
}

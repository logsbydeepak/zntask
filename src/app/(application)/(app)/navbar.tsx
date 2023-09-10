'use client'

import Link from 'next/link'

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
      </div>
    </nav>
  )
}

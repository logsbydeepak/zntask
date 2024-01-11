import Image from 'next/image'

import { cn } from '@/utils/style'

export function genInitials(firstName: string, lastName?: string | null) {
  if (!lastName && firstName.length >= 2) {
    return `${firstName[0]}${firstName[1]}`.toUpperCase()
  }
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  return firstName[0].toUpperCase()
}

export function Avatar({
  profilePicture,
  firstName,
  lastName,
  size = 32,
  className,
}: {
  profilePicture: string | null
  firstName: string
  lastName?: string | null
  size: number
  className?: string
}) {
  const initials = genInitials(firstName, lastName)

  return (
    <div
      className={cn(
        'flex size-full items-center justify-center rounded-full border border-gray-100 bg-gray-50',
        className
      )}
    >
      {profilePicture && (
        <Image
          src={profilePicture}
          alt="avatar"
          width={size}
          height={size}
          quality={100}
          className="size-full rounded-full object-cover"
        />
      )}

      {!profilePicture && (
        <p className="text-[75%] font-medium tracking-wider text-gray-600">
          {initials}
        </p>
      )}
    </div>
  )
}

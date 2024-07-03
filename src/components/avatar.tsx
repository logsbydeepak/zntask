import Image from "next/image"

import { cn } from "#/utils/style"

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
        "group flex size-full select-none items-center justify-center rounded-full border border-gray-5 bg-gray-1 bg-gradient-to-t from-gray-4 to-gray-2/10 shadow-inner shadow-gray-3 hover:border-gray-6 hover:bg-gray-2",
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
          priority={false}
        />
      )}
      {!profilePicture && (
        <p className="text-[95%] font-semibold tracking-wider text-gray-11 group-hover:text-gray-12">
          {initials}
        </p>
      )}
    </div>
  )
}

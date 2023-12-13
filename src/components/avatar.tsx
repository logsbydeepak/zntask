export function genInitials(firstName: string, lastName?: string | null) {
  if (!lastName && firstName.length >= 2) {
    return `${firstName[0]}${firstName[1]}`.toUpperCase()
  }
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  return firstName[0].toUpperCase()
}

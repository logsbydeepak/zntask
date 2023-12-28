import { ClassNameValue, twJoin, twMerge } from 'tailwind-merge'

export function cn(...args: ClassNameValue[]) {
  return twMerge(twJoin(...args))
}
export function tw(str: TemplateStringsArray) {
  return str[0]
}

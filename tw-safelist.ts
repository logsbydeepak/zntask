import { categoryIndicatorOptions } from '@/utils/category'

const path = './tw-safelist.txt'

const write: string[] = []

categoryIndicatorOptions.forEach((item) => {
  const color = item.color
  write.push(`bg-${color}-600`, `hover:ring-${color}-300`)
})

Bun.write(path, write.join('\n'))

import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarRoot,
} from '@radix-ui/react-avatar'
import Avvvatars from 'avvvatars-react'

export function Avatar({
  src,
  name,
  size,
}: {
  src: string | null
  name: string
  size?: number
}) {
  return (
    <AvatarRoot>
      <AvatarImage src={src || ''} className="rounded-full" />
      <AvatarFallback>
        <Avvvatars value={name} shadow={true} size={size} />
      </AvatarFallback>
    </AvatarRoot>
  )
}

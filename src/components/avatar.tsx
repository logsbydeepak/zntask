import Image from 'next/image'
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
  onLoad,
}: {
  src: string | null | undefined
  name: string
  size?: number
  onLoad?: () => void
}) {
  return (
    <AvatarRoot className="h-full w-full">
      <AvatarImage
        src={src || ''}
        alt="avatar"
        className="h-full w-full rounded-full object-cover"
        onLoad={onLoad}
      />
      <AvatarFallback>
        <Avvvatars value={name} shadow={true} size={size} />
      </AvatarFallback>
    </AvatarRoot>
  )
}

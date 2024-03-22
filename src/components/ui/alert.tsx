import { cva, VariantProps } from 'cva'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/utils/style'

import { ExclamationIcon } from '../icon/exclamation'

const alertStyle = cva({
  base: 'flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-xs font-medium',
  variants: {
    intent: {
      success: 'bg-green-3 text-green-11',
      destructive: 'bg-red-3 text-red-11',
    },
    align: {
      right: 'justify-start',
      center: 'justify-center',
    },
  },
  defaultVariants: {
    intent: 'destructive',
    align: 'right',
  },
})

export type AlertStyleProps = VariantProps<typeof alertStyle>

export function Alert({
  children,
  intent = 'destructive',
  align = 'right',
}: { children: React.ReactNode } & AlertStyleProps) {
  return (
    <div className={cn(alertStyle({ intent, align }))}>
      <div className="*:fle*:items-center *:justify-center *:rounded-full *:p-0.5">
        {intent === 'destructive' && (
          <div className="bg-red-11">
            <ExclamationIcon className="size-2.5 text-red-1" />
          </div>
        )}
        {intent === 'success' && (
          <div className="bg-green-11">
            <CheckIcon className="size-2.5 text-green-1" />
          </div>
        )}
      </div>

      <p>{children}</p>
    </div>
  )
}

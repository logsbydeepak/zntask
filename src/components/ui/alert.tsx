import { cva, VariantProps } from 'cva'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/utils/style'

import { ExclamationIcon } from '../icon/exclamation'

const alertStyle = cva({
  base: 'flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-xs font-medium',
  variants: {
    intent: {
      success: 'bg-green-6 text-green-11',
      destructive: 'bg-red-6 text-red-11',
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
          <div className="bg-red-7">
            <ExclamationIcon className="size-2.5 text-white" />
          </div>
        )}
        {intent === 'success' && (
          <div className="bg-green-7">
            <CheckIcon className="size-2.5 text-white" />
          </div>
        )}
      </div>

      <p>{children}</p>
    </div>
  )
}

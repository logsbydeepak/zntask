import React from 'react'
import { PopoverContent } from '@radix-ui/react-popover'
import { DayPicker } from 'react-day-picker'

export const SchedulePopover = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent>
>(({ ...props }, ref) => {
  return (
    <PopoverContent
      ref={ref}
      className="category-popover w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:w-96"
    >
      <DayPicker mode="single" />
    </PopoverContent>
  )
})

SchedulePopover.displayName = 'SchedulePopover'

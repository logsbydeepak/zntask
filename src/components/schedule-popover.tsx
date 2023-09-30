import React from 'react'
import { PopoverContent } from '@radix-ui/react-popover'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

export const SchedulePopover = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent>
>(({ ...props }, ref) => {
  const [selectedDay, setSelectedDay] = React.useState<Date>()

  return (
    <PopoverContent
      ref={ref}
      className="category-popover w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <DayPicker
        selected={selectedDay}
        onSelect={setSelectedDay}
        mode="single"
        className="text-sm"
        showOutsideDays={true}
        classNames={{
          month: 'space-y-4',

          caption: 'flex justify-center pt-1 relative font-medium',
          nav: 'space-x-1 flex items-center justify-center',
          nav_button_next: 'absolute right-1',
          nav_button_previous: 'absolute left-1',
          nav_button:
            'h-7 w-7 bg-transparent p-0 hover:text-gray-950 text-gray-600 flex justify-center items-center outline-gray-950 rounded-md',

          head_cell: 'font-normal text-gray-600',
          day: 'h-7 w-7 rounded-md border border-transparent hover:border-gray-200 hover:bg-gray-100 m-0.5 focus-visible:outline-gray-950 text-xs',
          day_selected:
            'bg-orange-600 text-white hover:bg-orange-600 hover:border-orange-600',
          day_outside: 'text-gray-400',
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
        }}
      />
    </PopoverContent>
  )
})

SchedulePopover.displayName = 'SchedulePopover'

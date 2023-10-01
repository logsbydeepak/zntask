import React from 'react'
import { PopoverContent } from '@radix-ui/react-popover'
import * as chrono from 'chrono-node'
import { format, isThisYear, isToday, isTomorrow, isYesterday } from 'date-fns'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HourglassIcon,
} from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import * as Form from '@ui/form'

export const SchedulePopover = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent>
>(({ ...props }, ref) => {
  const [value, setValue] = React.useState('')
  const [date, setDate] = React.useState<Date | null>(null)
  const [time, setTime] = React.useState<Date | null>(null)

  React.useEffect(() => {
    try {
      const date = chrono.parse(value)[0]
      setDate(date.start.date())
    } catch (error) {
      setDate(null)
    }

    try {
      const time = chrono.parse(value)[0]
      if (time.start.isCertain('hour')) {
        setTime(time.start.date())
      }
    } catch (error) {
      setTime(null)
    }
  }, [value])

  return (
    <PopoverContent
      ref={ref}
      sideOffset={20}
      className="category-popover w-80 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="space-x-2">
        <InfoContainer>
          <InfoIcon>
            <CalendarIcon className="h-full w-full" />
          </InfoIcon>
          <InfoText>
            {date
              ? (isTomorrow(date) && 'tomorrow') ||
                (isToday(date) && 'today') ||
                (isYesterday(date) && 'yesterday') ||
                (isThisYear(date) &&
                  !isToday(date) &&
                  !isTomorrow(date) &&
                  !isYesterday(date) &&
                  format(date, 'MMM d')) ||
                format(date, 'MMM d, yyyy')
              : 'select'}
          </InfoText>
        </InfoContainer>

        <InfoContainer>
          <InfoIcon>
            <HourglassIcon className="h-full w-full" />
          </InfoIcon>
          <InfoText>{time ? format(time, 'p') : 'select'}</InfoText>
        </InfoContainer>
      </div>

      <Form.Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        placeholder="tomorrow at 9am"
      />

      <DayPicker
        selected={date ?? undefined}
        onSelect={(value) => {
          if (!value) return
          setDate(value)
        }}
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

function InfoContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center space-x-1 rounded-full border px-4 py-1 text-xs">
      {children}
    </div>
  )
}

function InfoIcon({ children }: { children: React.ReactNode }) {
  return <div className="h-3 w-3 text-gray-600">{children}</div>
}

function InfoText({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>
}

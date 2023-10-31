import React from 'react'
import { PopoverContent } from '@radix-ui/react-popover'
import * as Popover from '@radix-ui/react-popover'
import { parse as chronoParse } from 'chrono-node'
import {
  addDays,
  format,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns'
import {
  CalendarCheckIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HourglassIcon,
  XCircleIcon,
} from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { useDebounce } from 'use-debounce'

import { cn } from '@/utils/style'
import * as Badge from '@ui/badge'

export function SchedulePicker({
  date,
  time,
  setDate,
  setTime,
}: {
  date: Date | null
  time: Date | null
  setDate: (date: Date | null) => void
  setTime: (date: Date | null) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Badge.Button>
          <Badge.Icon>
            <CalendarIcon />
          </Badge.Icon>
          <Badge.Label>{date ? showDate(date) : 'select'}</Badge.Label>

          {time && (
            <div>
              <div className="mx-1 h-2 border-l border-gray-200" />
            </div>
          )}

          {time && (
            <>
              <Badge.Icon>
                <HourglassIcon />
              </Badge.Icon>
              <Badge.Label>{time && showTime(time)}</Badge.Label>
            </>
          )}
        </Badge.Button>
      </Popover.Trigger>
      {isOpen && (
        <SchedulePopover
          setIsOpen={setIsOpen}
          date={date}
          time={time}
          setDate={setDate}
          setTime={setTime}
        />
      )}
    </Popover.Root>
  )
}

const SchedulePopover = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent> & {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDate: (date: Date | null) => void
    setTime: (time: Date | null) => void
    date: Date | null
    time: Date | null
  }
>(({ setIsOpen, date, time, setTime, setDate, ...props }, ref) => {
  const [inputValue, setInputValue] = React.useState('')
  const [actionTime, setActionTime] = React.useState<Date | null>(null)
  const [actionDate, setActionDate] = React.useState<Date | null>(null)
  const [debouncedValue] = useDebounce(inputValue, 500)

  React.useEffect(() => {
    try {
      const parseValue = chronoParse(debouncedValue)[0]
      const date = parseValue.start.date()

      setActionDate(date)
      if (parseValue.start.isCertain('hour')) {
        setActionTime(date)
      } else {
        setActionTime(null)
      }
    } catch (error) {
      setActionDate(null)
      setActionDate(null)
    }
  }, [debouncedValue])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <PopoverContent
      {...props}
      ref={ref}
      align="center"
      side="top"
      sideOffset={10}
      className="category-popover z-50 w-72 space-y-4 rounded-lg border border-gray-200 bg-white shadow-sm"
      autoFocus={true}
      collisionPadding={10}
    >
      <div className="flex flex-col border-b border-gray-200 px-4 pb-4 pt-2.5">
        <div className="flex items-center">
          <CalendarCheckIcon className="h-3 w-3 text-gray-400" />
          <input
            placeholder="today at 9am"
            autoFocus
            className="ml-2 h-5 w-full border-none p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
            value={inputValue}
            autoComplete="off"
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="mt-3 flex flex-row flex-wrap gap-x-1.5 gap-y-2">
          {actionDate && actionTime && (
            <Badge.Button
              onClick={() => {
                setTime(actionTime)
                setDate(actionDate)
                handleClose()
              }}
            >
              <Badge.Icon>
                <CalendarIcon />
              </Badge.Icon>
              <Badge.Icon>
                <HourglassIcon />
              </Badge.Icon>
            </Badge.Button>
          )}

          {actionDate && (
            <Badge.Button
              onClick={() => {
                setDate(actionDate)
                handleClose()
              }}
            >
              <Badge.Icon>
                <CalendarIcon />
              </Badge.Icon>
              <Badge.Label>
                {format(actionDate ?? new Date(), 'MMM d')}
              </Badge.Label>
            </Badge.Button>
          )}
          {actionTime && (
            <Badge.Button
              onClick={() => {
                if (!date) setDate(new Date())
                setTime(actionDate)
                handleClose()
              }}
            >
              <Badge.Icon>
                <HourglassIcon />
              </Badge.Icon>
              <Badge.Label>
                {format(actionTime ?? new Date(), 'h:mm a')}
              </Badge.Label>
            </Badge.Button>
          )}

          <Badge.Button
            onClick={() => {
              setDate(new Date())
              handleClose()
            }}
          >
            <Badge.Icon>
              <CalendarIcon />
            </Badge.Icon>
            <Badge.Label>today</Badge.Label>
          </Badge.Button>

          <Badge.Button
            onClick={() => {
              setDate(addDays(new Date(), 1))
              handleClose()
            }}
          >
            <Badge.Icon>
              <CalendarIcon />
            </Badge.Icon>
            <Badge.Label>tomorrow</Badge.Label>
          </Badge.Button>

          {date && (
            <Badge.Button
              onClick={() => {
                setDate(null)
                setTime(null)
                handleClose()
              }}
            >
              <Badge.Icon>
                <XCircleIcon />
              </Badge.Icon>
              <Badge.Label>clear date</Badge.Label>
            </Badge.Button>
          )}

          {time && (
            <Badge.Button
              onClick={() => {
                setTime(null)
                handleClose()
              }}
            >
              <Badge.Icon>
                <XCircleIcon />
              </Badge.Icon>
              <Badge.Label>clear time</Badge.Label>
            </Badge.Button>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <Calendar
          value={date ?? undefined}
          onSelect={(value) => {
            if (!value) return
            setDate(value)
            handleClose()
          }}
        />
      </div>
    </PopoverContent>
  )
})

SchedulePopover.displayName = 'SchedulePopover'

function Calendar({
  value,
  onSelect,
}: {
  value?: Date
  onSelect: (value?: Date) => void
}) {
  return (
    <DayPicker
      selected={value}
      formatters={{
        formatWeekdayName: weekDayName,
      }}
      onSelect={onSelect}
      mode="single"
      className="text-sm"
      showOutsideDays={true}
      classNames={{
        month: 'space-y-4',
        caption: 'flex justify-center relative font-medium',
        nav: 'space-x-1 flex items-center justify-center',
        nav_button_next: 'absolute right-1',
        nav_button_previous: 'absolute left-1',
        nav_button:
          'h-7 w-7 bg-transparent p-0 hover:text-gray-950 text-gray-600 flex justify-center items-center rounded-md',

        head_cell: 'font-normal text-gray-400 text-xs pb-1',
        day_today: 'text-orange-600 font-medium aria-[]:text-white',
        day: 'h-7 w-7 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-100 m-0.5 text-xs aria-[selected=true]:font-medium',
        day_selected:
          'bg-orange-600 text-white hover:bg-orange-600 hover:border-orange-600',
        day_outside: 'text-gray-400',
        table: 'w-full',
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
      }}
    />
  )
}

function weekDayName(date: Date) {
  const day = date.getDay()
  if (day === 0) return 'S'
  if (day === 1) return 'M'
  if (day === 2) return 'T'
  if (day === 3) return 'W'
  if (day === 4) return 'T'
  if (day === 5) return 'F'
  if (day === 6) return 'S'
  return 'NA'
}

function showDate(date: Date) {
  return (
    (isTomorrow(date) && 'tomorrow') ||
    (isToday(date) && 'today') ||
    (isYesterday(date) && 'yesterday') ||
    (isThisYear(date) &&
      !isToday(date) &&
      !isTomorrow(date) &&
      !isYesterday(date) &&
      format(date, 'MMM d')) ||
    format(date, 'MMM d, yyyy')
  )
}

function showTime(time: Date) {
  return format(time, 'h:mm a')
}

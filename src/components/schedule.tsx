import React from 'react'
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
  CalendarClockIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HourglassIcon,
  XCircleIcon,
} from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { useDebounce } from 'use-debounce'

import * as Badge from '@/components/ui/badge'

import { PopoverContent, PopoverRoot, PopoverTrigger } from './ui/popover'

export function SchedulePicker({
  value,
  setValue,
}: {
  value: { date: Date | null; time: Date | null }
  setValue: ({ date, time }: { date: Date | null; time: Date | null }) => void
}) {
  const { date, time } = value
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Badge.Button>
          <Badge.Icon>
            <CalendarIcon />
          </Badge.Icon>
          <span>{date ? showDate(date) : 'select'}</span>

          {time && (
            <div>
              <div className="mx-1 h-2 border-l border-gray-3" />
            </div>
          )}

          {time && (
            <>
              <Badge.Icon>
                <HourglassIcon />
              </Badge.Icon>
              <span>{time && showTime(time)}</span>
            </>
          )}
        </Badge.Button>
      </PopoverTrigger>
      {isOpen && (
        <SchedulePopover
          setIsOpen={setIsOpen}
          value={value}
          setValue={setValue}
        />
      )}
    </PopoverRoot>
  )
}

const SchedulePopover = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent> & {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    value: { date: Date | null; time: Date | null }
    setValue: ({ date, time }: { date: Date | null; time: Date | null }) => void
  }
>(({ setIsOpen, value, setValue, ...props }, ref) => {
  const { date, time } = value

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
      className="space-y-4 p-0 shadow-sm"
      autoFocus={true}
      collisionPadding={10}
    >
      <div className="flex flex-col border-b border-gray-3 px-4 pb-4 pt-2.5">
        <div className="flex items-center">
          <CalendarClockIcon className="size-4 text-gray-10" />
          <input
            placeholder="today at 9am"
            autoFocus
            className="ml-2 h-5 w-full border-none p-0 outline-none placeholder:text-gray-10 focus:ring-0"
            value={inputValue}
            autoComplete="off"
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="mt-3 flex flex-row flex-wrap gap-x-0.5 gap-y-2">
          {actionDate && actionTime && (
            <Badge.Button
              onClick={() => {
                setValue({ date: actionDate, time: actionTime })
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
                setValue({ date: actionDate, time })
                handleClose()
              }}
            >
              <Badge.Icon>
                <CalendarIcon />
              </Badge.Icon>
              <span>{format(actionDate ?? new Date(), 'MMM d')}</span>
            </Badge.Button>
          )}
          {actionTime && (
            <Badge.Button
              onClick={() => {
                if (!date) setValue({ date: new Date(), time })
                setValue({ date, time: actionTime })
                handleClose()
              }}
            >
              <Badge.Icon>
                <HourglassIcon />
              </Badge.Icon>
              <span>{format(actionTime ?? new Date(), 'h:mm a')}</span>
            </Badge.Button>
          )}

          <Badge.Button
            onClick={() => {
              setValue({ date: new Date(), time })
              handleClose()
            }}
          >
            <Badge.Icon>
              <CalendarIcon />
            </Badge.Icon>
            <span>today</span>
          </Badge.Button>

          <Badge.Button
            onClick={() => {
              setValue({ date: addDays(new Date(), 1), time })
              handleClose()
            }}
          >
            <Badge.Icon>
              <CalendarIcon />
            </Badge.Icon>
            <span>tomorrow</span>
          </Badge.Button>

          {date && (
            <Badge.Button
              onClick={() => {
                setValue({ date: null, time: null })
                handleClose()
              }}
            >
              <Badge.Icon>
                <XCircleIcon />
              </Badge.Icon>
              <span>clear date</span>
            </Badge.Button>
          )}

          {time && (
            <Badge.Button
              onClick={() => {
                setValue({ date, time: null })
                handleClose()
              }}
            >
              <Badge.Icon>
                <XCircleIcon />
              </Badge.Icon>
              <span>clear time</span>
            </Badge.Button>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <Calendar
          value={date ?? undefined}
          onSelect={(value) => {
            if (!value) return
            setValue({ date: value, time })
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
          'size-7 bg-transparent p-0 hover:text-gray-12 text-gray-11 flex justify-center items-center rounded-md',

        head_cell: 'font-normal text-gray-10 text-xs pb-1',
        day_today: 'text-orange-9 font-medium aria-[]:text-white',
        day: 'size-7 rounded-full border border-transparent hover:border-gray-3 hover:bg-gray-2 m-0.5 text-xs aria-[selected=true]:font-medium',
        day_selected:
          'bg-orange-9 text-white hover:bg-orange-9 hover:border-orange-9',
        day_outside: 'text-gray-10',
        table: 'w-full',
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="size-4" />,
        IconRight: () => <ChevronRightIcon className="size-4" />,
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

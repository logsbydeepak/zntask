import React from 'react'
import { PopoverContent } from '@radix-ui/react-popover'
import { parse as chronoParse } from 'chrono-node'
import { addDays, format } from 'date-fns'
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

export const SchedulePopover = React.forwardRef<
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
            <ActionContainer
              onClick={() => {
                setTime(actionTime)
                setDate(actionDate)
                handleClose()
              }}
            >
              <ActionIcon>
                <CalendarIcon />
              </ActionIcon>
              <ActionIcon>
                <HourglassIcon />
              </ActionIcon>
            </ActionContainer>
          )}

          {actionDate && (
            <ActionContainer
              onClick={() => {
                setDate(actionDate)
                handleClose()
              }}
            >
              <ActionIcon>
                <CalendarIcon />
              </ActionIcon>
              <ActionText>
                {format(actionDate ?? new Date(), 'MMM d')}
              </ActionText>
            </ActionContainer>
          )}
          {actionTime && (
            <ActionContainer
              onClick={() => {
                if (!date) setDate(new Date())
                setTime(actionDate)
                handleClose()
              }}
            >
              <ActionIcon>
                <HourglassIcon />
              </ActionIcon>
              <ActionText>
                {format(actionTime ?? new Date(), 'h:mm a')}
              </ActionText>
            </ActionContainer>
          )}

          <ActionContainer
            onClick={() => {
              setDate(new Date())
              handleClose()
            }}
          >
            <ActionIcon>
              <CalendarIcon />
            </ActionIcon>
            <ActionText>today</ActionText>
          </ActionContainer>

          <ActionContainer
            onClick={() => {
              setDate(addDays(new Date(), 1))
              handleClose()
            }}
          >
            <ActionIcon>
              <CalendarIcon />
            </ActionIcon>
            <ActionText>tomorrow</ActionText>
          </ActionContainer>

          {date && (
            <ActionContainer
              onClick={() => {
                setDate(null)
                setTime(null)
                handleClose()
              }}
            >
              <ActionIcon>
                <XCircleIcon />
              </ActionIcon>
              <ActionText>clear date</ActionText>
            </ActionContainer>
          )}

          {time && (
            <ActionContainer
              onClick={() => {
                setTime(null)
                handleClose()
              }}
            >
              <ActionIcon>
                <XCircleIcon />
              </ActionIcon>
              <ActionText>clear time</ActionText>
            </ActionContainer>
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

function ActionContainer({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      className="group inline-flex items-center space-x-1 rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-950"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function ActionIcon({ children }: { children: React.ReactNode }) {
  return <div className="h-2.5 w-2.5">{children}</div>
}

function ActionText({ children }: { children: React.ReactNode }) {
  return <span className="font-normal">{children}</span>
}

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

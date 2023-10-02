import React from 'react'
import { PopoverContent } from '@radix-ui/react-popover'
import * as chrono from 'chrono-node'
import {
  format,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
  set,
} from 'date-fns'
import {
  ArrowBigUpIcon,
  CalendarCheckIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CornerDownLeftIcon,
  HourglassIcon,
  Info,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { useDebounce } from 'use-debounce'

import { Action } from '@/app/(application)/(auth)/add-password/form'
import * as Form from '@ui/form'

export const SchedulePopover = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent>
>(({ ...props }, ref) => {
  const [value, setValue] = React.useState('')
  const [date, setDate] = React.useState<Date | null>(null)
  const [time, setTime] = React.useState<Date | null>(null)

  const [actionTime, setActionTime] = React.useState<Date | null>(null)
  const [actionDate, setActionDate] = React.useState<Date | null>(null)

  const [debouncedValue] = useDebounce(value, 500)

  React.useEffect(() => {
    try {
      const parseValue = chrono.parse(debouncedValue)[0]
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

  return (
    <PopoverContent
      ref={ref}
      side="top"
      sideOffset={15}
      className="category-popover w-64 space-y-4 rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex flex-col border-b border-gray-200 px-4 pb-4 pt-2.5">
        <div className="flex items-center">
          <CalendarCheckIcon className="h-3 w-3 text-gray-400" />
          <input
            id="schedule-form"
            placeholder="today at 9am"
            className="ml-2 h-5 w-full border-none p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
            value={value}
            autoComplete="off"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="mt-3 flex flex-row flex-wrap gap-x-1.5 gap-y-2">
          {actionDate && actionTime && (
            <ActionContainer>
              <ActionIcon>
                <CalendarIcon className="h-full w-full" />
              </ActionIcon>
              <ActionIcon>
                <HourglassIcon className="h-full w-full" />
              </ActionIcon>
            </ActionContainer>
          )}

          {actionDate && (
            <ActionContainer>
              <ActionIcon>
                <CalendarIcon className="h-full w-full" />
              </ActionIcon>
              <ActionText>
                {format(actionDate ?? new Date(), 'MMM d')}
              </ActionText>
            </ActionContainer>
          )}
          {actionTime && (
            <ActionContainer>
              <ActionIcon>
                <HourglassIcon className="h-full w-full" />
              </ActionIcon>
              <ActionText>
                {format(actionTime ?? new Date(), 'h:mm a')}
              </ActionText>
            </ActionContainer>
          )}

          <ActionContainer>
            <ActionIcon>
              <CalendarIcon className="h-full w-full" />
            </ActionIcon>
            <ActionText>today</ActionText>
          </ActionContainer>

          <ActionContainer>
            <ActionIcon>
              <CalendarIcon className="h-full w-full" />
            </ActionIcon>
            <ActionText>tomorrow</ActionText>
          </ActionContainer>

          {date && (
            <ActionContainer>
              <ActionIcon>
                <XIcon className="h-full w-full" />
              </ActionIcon>
              <ActionText>clear date</ActionText>
            </ActionContainer>
          )}

          {time && (
            <ActionContainer>
              <ActionIcon>
                <XIcon className="h-full w-full" />
              </ActionIcon>
              <ActionText>clear time</ActionText>
            </ActionContainer>
          )}
        </div>
      </div>

      <div className="w-full px-4">
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
            IconRight: ({ ...props }) => (
              <ChevronRightIcon className="h-4 w-4" />
            ),
          }}
        />
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-1.5">
        <div className="flex items-center space-x-1">
          <InfoContainer>
            <InfoIcon>
              <CalendarIcon className="h-full w-full" />
            </InfoIcon>
            <InfoText>
              {date && (
                <>
                  {(isTomorrow(date) && 'tomorrow') ||
                    (isToday(date) && 'today') ||
                    (isYesterday(date) && 'yesterday') ||
                    (isThisYear(date) &&
                      !isToday(date) &&
                      !isTomorrow(date) &&
                      !isYesterday(date) &&
                      format(date, 'MMM d')) ||
                    format(date, 'MMM d, yyyy')}
                </>
              )}
            </InfoText>
          </InfoContainer>

          <InfoContainer>
            <InfoIcon>
              <HourglassIcon className="h-full w-full" />
            </InfoIcon>
            <InfoText>{time && format(time, 'h:mm a')}</InfoText>
          </InfoContainer>
        </div>

        <ActionButton type="button">
          <span>Select</span>
          <div className="flex space-x-1">
            <ShortcutIcon>
              <ArrowBigUpIcon className="h-full w-full" />
            </ShortcutIcon>
            <ShortcutIcon>
              <CornerDownLeftIcon className="h-full w-full" />
            </ShortcutIcon>
          </div>
        </ActionButton>
      </div>
    </PopoverContent>
  )
})

SchedulePopover.displayName = 'SchedulePopover'

function InfoContainer({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <div className="inline-flex items-center space-x-1 text-xs text-gray-600">
      {children}
    </div>
  )
}

function InfoIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-3 w-3 group-data-[active=true]:text-white">
      {children}
    </div>
  )
}

function InfoText({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>
}

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
      type="button"
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

function ShortcutIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-200 text-gray-500 group-hover:border-gray-300 group-hover:text-gray-950">
      <span className="h-3 w-3">{children}</span>
    </span>
  )
}

function ActionButton({ children, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className="group flex items-center space-x-2 rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-gray-950"
    >
      {children}
    </button>
  )
}

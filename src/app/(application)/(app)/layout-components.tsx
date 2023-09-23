import { Button } from '@/components/ui/button'

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-lg font-medium">{children}</h1>
}

export function Root({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function Header({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function Content({ children }: { children?: React.ReactNode }) {
  return <div className="pt-4">{children}</div>
}

export function NotFound() {
  return <h1>Not Found</h1>
}

function EmptyContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-60 flex h-full flex-col items-center justify-center">
      <div className="flex h-40 w-40 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm">
        <span className="flex flex-col items-center space-y-1 text-gray-600">
          {children}
        </span>
      </div>
    </div>
  )
}

function EmptyIcon({ children }: { children: React.ReactNode }) {
  return <div className="h-5 w-5">{children}</div>
}

function EmptyLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>
}

export const Empty = {
  Container: EmptyContainer,
  Icon: EmptyIcon,
  Label: EmptyLabel,
}

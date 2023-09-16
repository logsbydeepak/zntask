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
  return <div>{children}</div>
}

export function NotFound() {
  return <h1>Not Found</h1>
}

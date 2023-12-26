export function LogoIcon({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="currentColor"
      style={style}
      className={className}
    >
      <path d="M20 20H10L20 10L0 20V0H10L0 10L20 0V20Z" />
    </svg>
  )
}

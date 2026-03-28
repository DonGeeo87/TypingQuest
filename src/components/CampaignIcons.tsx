import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
}

function IconBase({ size, width, height, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={size ?? width ?? 24}
      height={size ?? height ?? 24}
      {...props}
    />
  )
}

export function ZapIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </IconBase>
  )
}

export function TargetIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

export function FlameIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3c1 3-1 4-1 6 0 1 1 2 2 2 2 0 3-2 3-4 2 2 4 5 4 8a7 7 0 1 1-14 0c0-3 2-6 6-12Z" />
    </IconBase>
  )
}

export function LockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </IconBase>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 2.5 2.9 5.88 6.5.95-4.7 4.58 1.1 6.47L12 17.3l-5.8 3.08 1.1-6.47-4.7-4.58 6.5-.95L12 2.5z" />
    </IconBase>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m15 18-6-6 6-6" />
    </IconBase>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M17 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M7 6H5a2 2 0 0 0 0 4h2" />
    </IconBase>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 18 6-6-6-6" />
    </IconBase>
  )
}

import { useId, useState } from 'react'

export function Tooltip(props: { content: string; children: React.ReactNode }) {
  const id = useId()
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={id} tabIndex={0} className="outline-none focus:ring-2 focus:ring-indigo-500 rounded-md">
        {props.children}
      </span>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute z-50 -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-max max-w-[260px] px-3 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] text-xs shadow-xl"
        >
          {props.content}
        </span>
      )}
    </span>
  )
}


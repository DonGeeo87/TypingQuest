const DEV = import.meta.env.DEV

export const log = {
  debug: (...args: unknown[]) => {
    if (!DEV) return
    console.debug(...args)
  },
  info: (...args: unknown[]) => {
    if (!DEV) return
    console.info(...args)
  },
  warn: (...args: unknown[]) => {
    if (!DEV) return
    console.warn(...args)
  },
  error: (...args: unknown[]) => {
    if (!DEV) return
    console.error(...args)
  },
}

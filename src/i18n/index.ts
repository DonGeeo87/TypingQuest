import { en } from './en'
import { es } from './es'

export type UiLanguage = 'en' | 'es'

const dict = { en, es } as const

export function t(lang: UiLanguage, key: string) {
  const parts = key.split('.')
  let cur: unknown = dict[lang]
  for (const p of parts) {
    if (typeof cur !== 'object' || cur === null) return key
    const rec = cur as Record<string, unknown>
    cur = rec[p]
  }
  return typeof cur === 'string' ? cur : key
}

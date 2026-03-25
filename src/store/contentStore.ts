import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ContentMode = 'classic' | 'taptap' | 'multiplayer'

interface ContentState {
  recentKeys: string[]
  hasRecentKey: (key: string) => boolean
  rememberKey: (key: string) => void
  buildKey: (mode: ContentMode, language: 'en' | 'es', level: number, pool: string, key: string) => string
}

const MAX_RECENT = 80

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      recentKeys: [],
      hasRecentKey: (key) => get().recentKeys.includes(key),
      rememberKey: (key) => {
        const next = [key, ...get().recentKeys.filter((k) => k !== key)].slice(0, MAX_RECENT)
        set({ recentKeys: next })
      },
      buildKey: (mode, language, level, pool, key) => `${mode}:${language}:${level}:${pool}:${key}`,
    }),
    { name: 'typingquest-content' }
  )
)


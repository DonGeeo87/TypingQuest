import { motion } from 'framer-motion'
import type { WordCategory } from '../types'
import { t } from '../i18n'
import { en } from '../i18n/en'
import { es } from '../i18n/es'
import type { Language } from '../types'

interface CategorySelectorProps {
  selectedCategory: WordCategory
  onCategoryChange: (category: WordCategory) => void
  language: Language
}

const categoryIcons: Record<WordCategory, string> = {
  general: '🎲',
  animals: '🦁',
  fruits: '🍎',
  nouns: '📍',
  verbs: '⚡',
  technology: '💻',
  adjectives: '✨',
  places: '🗺',
  daily: '☀️',
  advanced: '🧠',
  parts_of_speech: '📚',
  tenses: '⏰',
  verb_to_be: '⚙️',
  prepositions: '🛣️',
  abbreviations: '📋',
}

export function CategorySelector({ selectedCategory, onCategoryChange, language }: CategorySelectorProps) {
  const categories: WordCategory[] = ['general', 'animals', 'fruits', 'nouns', 'verbs', 'parts_of_speech', 'tenses', 'verb_to_be', 'prepositions']
  const dict = language === 'en' ? en : es
  const categoryData = dict.home.categories as Record<WordCategory, { name: string; description: string }>

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
        {t(language, 'home.learningTheme')}
      </div>

      {/* Desktop grid */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {categories.map((category) => {
          const info = categoryData[category]
          return (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category)}
              className={`p-2 rounded-lg border-2 transition-all text-center ${
                selectedCategory === category
                  ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
                  : 'border-[var(--card-border)] bg-[var(--secondary)] hover:opacity-90'
              }`}
            >
              <div className="text-xl mb-1">{categoryIcons[category]}</div>
              <div className="font-semibold text-xs text-[var(--foreground)] leading-tight">{info.name}</div>
              <div className="text-[10px] text-[var(--muted)] leading-tight">{info.description}</div>
            </motion.button>
          )
        })}
      </div>

      {/* Mobile: horizontal scroll chips */}
      <div className="sm:hidden overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => {
            const info = categoryData[category]
            return (
              <motion.button
                key={category}
                whileTap={{ scale: 0.92 }}
                onClick={() => onCategoryChange(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all flex flex-col items-center gap-1 min-w-[72px] ${
                  selectedCategory === category
                    ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
                    : 'border-[var(--card-border)] bg-[var(--secondary)]'
                }`}
              >
                <span className="text-xl">{categoryIcons[category]}</span>
                <span className="font-semibold text-[var(--foreground)] text-xs whitespace-nowrap">{info.name}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="text-xs text-[var(--muted)] italic">
        {t(language, 'home.learningThemeDesc')}
      </div>
    </div>
  )
}

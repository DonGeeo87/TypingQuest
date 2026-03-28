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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
              <div className="text-2xs text-[var(--muted)] mt-0.5 leading-tight">{info.description}</div>
            </motion.button>
          )
        })}
      </div>
      <div className="text-xs text-[var(--muted)] italic">
        {t(language, 'home.learningThemeDesc')}
      </div>
    </div>
  )
}

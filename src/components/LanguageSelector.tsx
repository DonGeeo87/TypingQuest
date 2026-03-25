import { motion } from 'framer-motion'

interface LanguageSelectorProps {
  selectedLanguage: 'en' | 'es'
  onLanguageChange: (language: 'en' | 'es') => void
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-4 p-2 bg-[var(--secondary)] rounded-xl">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onLanguageChange('en')}
        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
          selectedLanguage === 'en'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]'
        }`}
      >
        🇬🇧 English
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onLanguageChange('es')}
        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
          selectedLanguage === 'es'
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
            : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]'
        }`}
      >
        🇪🇸 Español
      </motion.button>
    </div>
  )
}

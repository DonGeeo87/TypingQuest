import { motion } from 'framer-motion'

interface LevelSelectorProps {
  selectedLevel: number
  onLevelChange: (level: number) => void
}

const levelInfo = {
  1: { name: 'Beginner', description: 'Simple words (3-5 letters)', icon: '🌱' },
  2: { name: 'Easy', description: 'Medium words (6-8 letters)', icon: '🌿' },
  3: { name: 'Intermediate', description: 'Short phrases', icon: '🌳' },
  4: { name: 'Advanced', description: 'Long phrases', icon: '🍀' },
  5: { name: 'Expert', description: 'Paragraphs', icon: '🏆' },
}

export function LevelSelector({ selectedLevel, onLevelChange }: LevelSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {(Object.keys(levelInfo) as unknown as number[]).map((level) => (
        <motion.button
          key={level}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLevelChange(level)}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedLevel === level
              ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
              : 'border-[var(--card-border)] bg-[var(--secondary)] hover:opacity-90'
          }`}
        >
          <div className="text-3xl mb-2">{levelInfo[level as keyof typeof levelInfo].icon}</div>
          <div className="font-semibold text-[var(--foreground)]">{levelInfo[level as keyof typeof levelInfo].name}</div>
          <div className="text-xs text-[var(--muted)] mt-1">
            {levelInfo[level as keyof typeof levelInfo].description}
          </div>
        </motion.button>
      ))}
    </div>
  )
}

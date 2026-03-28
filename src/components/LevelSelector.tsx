import { motion } from 'framer-motion'

interface LevelSelectorProps {
  selectedLevel: number
  onLevelChange: (level: number) => void
}

const levelInfo = {
  1: { name: 'Beginner', shortName: 'B', description: '3-5 letras', icon: '🌱' },
  2: { name: 'Easy', shortName: 'E', description: '6-8 letras', icon: '🌿' },
  3: { name: 'Inter.', shortName: 'I', description: 'Frases cortas', icon: '🌳' },
  4: { name: 'Adv.', shortName: 'A', description: 'Frases largas', icon: '🍀' },
  5: { name: 'Expert', shortName: 'X', description: 'Párrafos', icon: '🏆' },
}

export function LevelSelector({ selectedLevel, onLevelChange }: LevelSelectorProps) {
  return (
    <>
      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-5 gap-3">
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

      {/* Mobile: horizontal scroll tabs */}
      <div className="lg:hidden overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          {(Object.keys(levelInfo) as unknown as number[]).map((level) => (
            <motion.button
              key={level}
              whileTap={{ scale: 0.92 }}
              onClick={() => onLevelChange(level)}
              className={`flex-shrink-0 w-20 h-24 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                selectedLevel === level
                  ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
                  : 'border-[var(--card-border)] bg-[var(--secondary)] hover:opacity-90'
              }`}
            >
              <div className="text-2xl">{levelInfo[level as keyof typeof levelInfo].icon}</div>
              <div className="font-bold text-[var(--foreground)] text-sm">{levelInfo[level as keyof typeof levelInfo].shortName}</div>
              <div className="text-[10px] text-[var(--muted)] leading-tight">{levelInfo[level as keyof typeof levelInfo].description}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  )
}

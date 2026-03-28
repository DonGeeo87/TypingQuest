import { motion } from 'framer-motion'

interface StatsDisplayProps {
  wpm: number
  accuracy: number
  combo: number
  errors: number
  progress: number
}

export function StatsDisplay({ wpm, accuracy, combo, errors, progress }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-3 md:p-4 text-center"
      >
        <div className="text-2xl md:text-3xl font-bold text-indigo-400">{wpm}</div>
        <div className="text-xs md:text-sm text-[var(--muted)]">WPM</div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-3 md:p-4 text-center"
      >
        <div className="text-2xl md:text-3xl font-bold text-violet-400">{accuracy}%</div>
        <div className="text-xs md:text-sm text-[var(--muted)]">Accuracy</div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-3 md:p-4 text-center"
      >
        <div className="text-2xl md:text-3xl font-bold text-amber-400">{combo}</div>
        <div className="text-xs md:text-sm text-[var(--muted)]">Combo</div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-3 md:p-4 text-center"
      >
        <div className="text-2xl md:text-3xl font-bold text-red-400">{errors}</div>
        <div className="text-xs md:text-sm text-[var(--muted)]">Errors</div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="col-span-1 md:col-span-1 glass-card p-3 md:p-4 text-center"
      >
        <div className="text-2xl md:text-3xl font-bold text-green-400">{Math.round(progress)}%</div>
        <div className="text-xs md:text-sm text-[var(--muted)]">Progress</div>
      </motion.div>
    </div>
  )
}

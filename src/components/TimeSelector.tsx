import { motion } from 'framer-motion'

interface TimeSelectorProps {
  selectedTime: number
  onTimeChange: (time: number) => void
}

const timeOptions = [
  { value: 30, label: '30s', description: 'Quick game', icon: '⚡' },
  { value: 60, label: '60s', description: 'Standard', icon: '⏱️' },
  { value: 90, label: '90s', description: 'Extended', icon: '🕐' },
  { value: 120, label: '120s', description: 'Marathon', icon: '🔥' },
]

export function TimeSelector({ selectedTime, onTimeChange }: TimeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {timeOptions.map((option) => (
        <motion.button
          key={option.value}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTimeChange(option.value)}
          className={`p-4 rounded-xl border-2 transition-all ${
            selectedTime === option.value
              ? 'border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/20'
              : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
          }`}
        >
          <div className="text-3xl mb-2">{option.icon}</div>
          <div className="font-semibold text-white">{option.label}</div>
          <div className="text-xs text-zinc-400 mt-1">
            {option.description}
          </div>
        </motion.button>
      ))}
    </div>
  )
}

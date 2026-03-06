import { motion } from 'framer-motion'

interface TypingAreaProps {
  text: string
  currentIndex: number
  typedChars: string[]
  isPlaying: boolean
  timeRemaining?: number
}

export function TypingArea({ text, currentIndex, typedChars, isPlaying, timeRemaining }: TypingAreaProps) {
  // Check if time is running low (less than 10 seconds)
  const isTimeLow = timeRemaining !== undefined && timeRemaining <= 10 && timeRemaining > 0
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative">
      {/* Time Display */}
      {timeRemaining !== undefined && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            ...(isTimeLow ? {
              animate: {
                opacity: [1, 0.3, 1],
              },
              transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }
            } : {})
          }}
          className={`text-center mb-4 ${
            isTimeLow ? 'text-red-500' : 'text-violet-400'
          }`}
        >
          <div className={`text-5xl md:text-6xl font-bold ${isTimeLow ? 'animate-pulse' : ''}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-zinc-500 text-sm mt-1">
            {isTimeLow ? '⚠️ Time Running Low!' : 'Time Remaining'}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 min-h-[200px] flex flex-wrap content-start gap-1 text-2xl md:text-3xl font-mono leading-relaxed"
      >
        {text.split('').map((char, index) => {
          let charClass = 'char-pending transition-colors duration-100 px-1 rounded'

          if (index < typedChars.length) {
            const typedChar = typedChars[index]
            if (typedChar === char) {
              charClass = 'char-correct transition-colors duration-100 px-1 rounded'
            } else {
              charClass = 'char-incorrect transition-colors duration-100 px-1 rounded'
            }
          } else if (index === currentIndex && isPlaying) {
            charClass = 'char-current animate-pulse px-1 rounded'
          }

          return (
            <span key={index} className={charClass}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </motion.div>

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / text.length) * 100}%` }}
          transition={{ duration: 0.1 }}
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
        />
      </div>
    </div>
  )
}

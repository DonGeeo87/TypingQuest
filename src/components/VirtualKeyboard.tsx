import { motion } from 'framer-motion'

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void
  disabled?: boolean
}

export function VirtualKeyboard({ onKeyPress, disabled = false }: VirtualKeyboardProps) {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ]

  const handleKeyPress = (key: string) => {
    if (disabled) return
    onKeyPress(key)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--card-bg)] backdrop-blur-xl border-t border-[var(--card-border)] p-2 z-50 safe-area-bottom">
      <div className="max-w-3xl mx-auto space-y-2">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex justify-center gap-2 ${rowIndex === 1 ? 'pl-4' : rowIndex === 2 ? 'pl-8' : ''}`}
          >
            {row.map((key) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleKeyPress(key)}
                className="
                  flex-1 min-w-[2.75rem] h-14 rounded-lg
                  bg-[var(--secondary)]
                  text-[var(--foreground)] font-bold text-lg
                  border border-[var(--card-border)]
                  shadow-lg shadow-black/10
                  active:opacity-90
                  disabled:opacity-50 disabled:cursor-not-allowed
                  touch-manipulation select-none
                "
              >
                {key}
              </motion.button>
            ))}
          </div>
        ))}

        {/* Backspace + Space row */}
        <div className="flex justify-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress('\b')}
            className="
              min-w-[4rem] h-14 rounded-lg
              bg-[var(--secondary)]
              text-[var(--foreground)] font-bold text-xl
              border border-[var(--card-border)]
              shadow-lg shadow-black/10
              active:opacity-90
              touch-manipulation select-none
            "
          >
            ⌫
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onKeyPress(' ')}
            className="
              flex-1 max-w-[14rem] h-14 rounded-lg
              bg-[var(--secondary)]
              text-[var(--foreground)] font-bold text-sm
              border border-[var(--card-border)]
              shadow-lg shadow-black/10
              active:opacity-90
              touch-manipulation select-none
            "
          >
            ESPACIO
          </motion.button>
        </div>
      </div>
    </div>
  )
}

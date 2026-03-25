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
            className="flex justify-center gap-1"
            style={{ paddingLeft: rowIndex === 1 ? '1rem' : rowIndex === 2 ? '2rem' : '0' }}
          >
            {row.map((key) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleKeyPress(key)}
                className="
                  flex-1 max-w-[2.5rem] h-12 rounded-lg
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
        
        {/* Fila de espacio y enter */}
        <div className="flex justify-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onKeyPress(' ')}
            className="
              flex-1 max-w-[12rem] h-12 rounded-lg
              bg-[var(--secondary)]
              text-[var(--foreground)] font-bold
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

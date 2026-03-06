import { motion, AnimatePresence } from 'framer-motion'

interface ComboIndicatorProps {
  combo: number
  show: boolean
}

export function ComboIndicator({ combo, show }: ComboIndicatorProps) {
  if (!show || combo < 5) return null

  const getComboMessage = () => {
    if (combo >= 50) return { text: 'GODLIKE!', color: 'text-amber-400', scale: 1.5 }
    if (combo >= 30) return { text: 'LEGENDARY!', color: 'text-violet-400', scale: 1.3 }
    if (combo >= 20) return { text: 'AMAZING!', color: 'text-indigo-400', scale: 1.2 }
    if (combo >= 10) return { text: 'GREAT!', color: 'text-green-400', scale: 1.1 }
    return { text: `Combo x${combo}`, color: 'text-blue-400', scale: 1 }
  }

  const { text, color, scale } = getComboMessage()

  return (
    <AnimatePresence>
      {show && combo >= 5 && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale, opacity: 1, y: 0 }}
          exit={{ scale: 1.5, opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-1/4 left-1/2 -translate-x-1/2 font-bold ${color} pointer-events-none z-50`}
          style={{ 
            fontSize: `${2 * scale}rem`,
            textShadow: `0 0 20px currentColor, 0 0 40px currentColor`,
          }}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

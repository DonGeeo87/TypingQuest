import { motion, AnimatePresence } from 'framer-motion'

interface ComboIndicatorProps {
  combo: number
  show: boolean
  language?: 'en' | 'es'
}

export function ComboIndicator({ combo, show, language = 'en' }: ComboIndicatorProps) {
  if (!show || combo < 5) return null

  const getComboMessage = () => {
    if (combo >= 50) return { text: language === 'en' ? 'GODLIKE!' : '¡DIOS!', color: 'text-amber-400', scale: 1.5 }
    if (combo >= 30) return { text: language === 'en' ? 'LEGENDARY!' : '¡LEGENDARIO!', color: 'text-violet-400', scale: 1.3 }
    if (combo >= 20) return { text: language === 'en' ? 'AMAZING!' : '¡INCREÍBLE!', color: 'text-indigo-400', scale: 1.2 }
    if (combo >= 10) return { text: language === 'en' ? 'GREAT!' : '¡BIEN!', color: 'text-green-400', scale: 1.1 }
    return { text: `Combo x${combo}`, color: 'text-blue-400', scale: 1 }
  }

  const { text, color, scale } = getComboMessage()

  return (
    <AnimatePresence>
      {show && combo >= 5 && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -20 }}
          animate={{ scale, opacity: 1, y: 0 }}
          exit={{ scale: 1.5, opacity: 0, y: -30 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-2 left-1/2 -translate-x-1/2 font-bold ${color} pointer-events-none z-40`}
          style={{
            fontSize: `${1.5 * scale}rem`,
            textShadow: `0 0 20px currentColor, 0 0 40px currentColor`,
          }}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

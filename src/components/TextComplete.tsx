import { motion, AnimatePresence } from 'framer-motion'

interface TextCompleteProps {
  isActive: boolean
  text?: string
}

export function TextComplete({ isActive, text = '' }: TextCompleteProps) {
  if (!isActive) return null

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 0 }}
          animate={{ scale: 1, opacity: 1, y: -10 }}
          exit={{ scale: 0.8, opacity: 0, y: -30 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <div
            className="px-5 py-2 bg-gradient-to-r from-indigo-600/90 to-violet-600/90 rounded-xl shadow-lg backdrop-blur-sm"
            style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
          >
            <div className="text-lg font-bold text-white text-center whitespace-nowrap">
              ✨ {text || '¡Completado!'}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

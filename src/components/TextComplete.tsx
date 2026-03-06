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
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0, y: -50 }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          {/* Efecto de brillo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"
            style={{
              filter: 'blur(20px)',
            }}
          />

          {/* Texto de completado */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-2xl"
            style={{
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.6), 0 0 80px rgba(139, 92, 246, 0.4)',
            }}
          >
            <div className="text-3xl md:text-4xl font-bold text-white text-center">
              <span className="inline-block animate-bounce">✨</span>
              {' '}
              {text || '¡Completado!'}
              {' '}
              <span className="inline-block animate-bounce">✨</span>
            </div>

            {/* Partículas decorativas */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-ping delay-100" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-ping delay-200" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping delay-300" />
          </motion.div>

          {/* Rayos de luz */}
          <motion.div
            initial={{ rotate: 0, scale: 0.5 }}
            animate={{ rotate: 180, scale: 1.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-20 bg-gradient-to-t from-indigo-500/50 to-transparent origin-bottom"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-100%)`,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

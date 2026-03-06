import { motion, AnimatePresence } from 'framer-motion'

interface ErrorShakeProps {
  isActive: boolean
  children?: React.ReactNode
}

export function ErrorShake({ isActive, children }: ErrorShakeProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ x: 0 }}
          animate={{
            x: [-10, 10, -10, 10, -10, 10, 0],
          }}
          exit={{ x: 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1],
          }}
          className="inline-block"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

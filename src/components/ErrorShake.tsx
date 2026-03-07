import { motion } from 'framer-motion'

interface ErrorShakeProps {
  isActive: boolean
  children?: React.ReactNode
}

export function ErrorShake({ isActive, children }: ErrorShakeProps) {
  return (
    <motion.div
      animate={isActive ? {
        x: [-4, 4, -4, 4, 0],
      } : { x: 0 }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

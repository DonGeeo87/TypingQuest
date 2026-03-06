import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={`glass-card p-6 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 ${className}`}
    >
      {children}
    </motion.div>
  )
}

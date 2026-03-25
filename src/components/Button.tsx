import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90',
    secondary: 'bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--card-border)] hover:opacity-90',
    accent: 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90',
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}

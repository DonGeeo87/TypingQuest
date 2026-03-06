import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConfettiProps {
  isActive: boolean
}

interface Particle {
  id: number
  x: number
  color: string
  size: number
  rotation: number
  delay: number
  duration: number
}

const COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#ec4899', // pink
  '#14b8a6', // teal
]

export function Confetti({ isActive }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (isActive) {
      // Generar 150 partículas de confeti
      const newParticles: Particle[] = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // posición horizontal en porcentaje
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 5, // tamaño entre 5 y 15px
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        duration: Math.random() * 2 + 2, // duración entre 2 y 4 segundos
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              y: -20,
              x: `${particle.x}%`,
              rotate: particle.rotation,
              opacity: 1,
              scale: 0,
            }}
            animate={{
              y: '110vh',
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0],
              scale: [0, 1, 0.5],
              x: [
                `${particle.x}%`,
                `${particle.x + (Math.random() - 0.5) * 20}%`,
                `${particle.x + (Math.random() - 0.5) * 30}%`,
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'easeOut',
              times: [0, 0.2, 0.5, 1],
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              left: 0,
              boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

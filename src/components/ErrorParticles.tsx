import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ErrorParticlesProps {
  isActive: boolean
  position?: {
    x: number
    y: number
  }
}

interface Particle {
  id: number
  angle: number
  velocity: number
  size: number
  delay: number
}

export function ErrorParticles({ isActive, position }: ErrorParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (isActive) {
      // Generar 20 partículas que explotan desde el punto de error
      const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        angle: (i / 20) * 360, // distribuidas en círculo
        velocity: Math.random() * 100 + 80, // velocidad de explosión
        size: Math.random() * 8 + 4, // tamaño entre 4 y 12px
        delay: Math.random() * 0.1,
      }))
      setParticles(newParticles)

      // Limpiar partículas después de la animación
      const timer = setTimeout(() => {
        setParticles([])
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!isActive || particles.length === 0) return null

  // Posición por defecto (centro de la pantalla) si no se proporciona
  const startX = position?.x || window.innerWidth / 2
  const startY = position?.y || window.innerHeight / 2

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => {
          const radians = (particle.angle * Math.PI) / 180
          const endX = Math.cos(radians) * particle.velocity
          const endY = Math.sin(radians) * particle.velocity

          return (
            <motion.div
              key={particle.id}
              initial={{
                x: startX,
                y: startY,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: startX + endX,
                y: startY + endY + 50, // agregar gravedad
                opacity: [1, 1, 0],
                scale: [0, 1, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: particle.delay,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                width: particle.size,
                height: particle.size,
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                boxShadow: '0 0 10px #ef4444, 0 0 20px #ef444480',
              }}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

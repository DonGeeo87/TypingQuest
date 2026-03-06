import { motion } from 'framer-motion'

interface ParticleBackgroundProps {
  isActive?: boolean
}

export function ParticleBackground({ isActive = false }: ParticleBackgroundProps) {
  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: `${particle.x}%`, 
            y: `${particle.y}%`,
            opacity: 0.3,
          }}
          animate={{
            y: isActive ? [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`] : `${particle.y}%`,
            opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
    </div>
  )
}

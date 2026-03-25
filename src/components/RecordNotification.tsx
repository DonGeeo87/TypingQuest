import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './Card'
import type { RealtimeRankingUpdate } from '../types'
import { getDurationCategory } from '../services/supabaseService'

interface RecordNotificationProps {
  notification: RealtimeRankingUpdate | null
  onDismiss: () => void
}

export function RecordNotification({ notification, onDismiss }: RecordNotificationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setVisible(true)
      
      // Auto-dismiss después de 5 segundos
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onDismiss, 300) // Esperar la animación de salida
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [notification, onDismiss])

  if (!notification) return null

  const durationCategory = getDurationCategory(notification.durationCategory || 60)

  const getNotificationConfig = () => {
    switch (notification.type) {
      case 'overtake':
        return {
          icon: '🚨',
          title: '¡Récord Superado!',
          subtitle: `${notification.username} ha superado tu récord en ${durationCategory?.label}`,
          color: 'from-red-600/30 to-orange-600/30',
          borderColor: 'border-red-500/50',
          textColor: 'text-red-400',
        }
      case 'new_record':
        return {
          icon: '🔥',
          title: '¡Nuevo Récord Global!',
          subtitle: `${notification.username} estableció un nuevo récord en ${durationCategory?.label}`,
          color: 'from-emerald-600/30 to-green-600/30',
          borderColor: 'border-emerald-500/50',
          textColor: 'text-emerald-400',
        }
      case 'rank_change':
        return {
          icon: '📊',
          title: 'Cambio en el Ranking',
          subtitle: `Has subido al puesto #${notification.newRank}`,
          color: 'from-blue-600/30 to-indigo-600/30',
          borderColor: 'border-blue-500/50',
          textColor: 'text-blue-400',
        }
      default:
        return {
          icon: '📢',
          title: 'Actualización',
          subtitle: 'Nueva actividad en el ranking',
          color: 'from-zinc-600/30 to-gray-600/30',
          borderColor: 'border-zinc-500/50',
          textColor: 'text-zinc-400',
        }
    }
  }

  const config = getNotificationConfig()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <Card className={`${config.color} ${config.borderColor} border shadow-2xl`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold ${config.textColor}`}>
                  {config.title}
                </h4>
                <p className="text-[var(--muted)] text-sm mt-1">
                  {config.subtitle}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--secondary)] text-[var(--muted)]">
                    {notification.score} puntos
                  </span>
                  {notification.durationCategory && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--secondary)] text-[var(--muted)]">
                      {durationCategory?.label}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setVisible(false)
                  setTimeout(onDismiss, 300)
                }}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                ✕
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RecordNotification

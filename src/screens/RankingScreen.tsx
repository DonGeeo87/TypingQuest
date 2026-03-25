import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components'
import {
  getDurationRanking,
  getPersonalBests,
  getUserDurationRank,
  subscribeToDurationRanking,
  DURATION_CATEGORIES,
} from '../services/supabaseService'
import { getCurrentUser } from '../lib/supabase'
import type { RankedGame, PersonalBest, RealtimeRankingUpdate } from '../types'

interface RankingScreenProps {
  onNavigate: (screen: string) => void
}

export function RankingScreen({ onNavigate }: RankingScreenProps) {
  const [rankings, setRankings] = useState<Record<number, RankedGame[]>>({})
  const [personalBests, setPersonalBests] = useState<PersonalBest | null>(null)
  const [userRanks, setUserRanks] = useState<Record<number, { rank: number; total: number }>>({})
  const [loading, setLoading] = useState(true)
  const [selectedDuration, setSelectedDuration] = useState<number>(60)
  const [userId, setUserId] = useState<string | null>(null)
  const [liveUpdate, setLiveUpdate] = useState<RealtimeRankingUpdate | null>(null)

  const loadUserId = useCallback(async () => {
    const id = await getCurrentUser()
    setUserId(id)
  }, [])

  const loadRankings = useCallback(async (duration: number) => {
    setLoading(true)
    const data = await getDurationRanking(duration, 50)
    setRankings(prev => ({
      ...prev,
      [duration]: data,
    }))
    setLoading(false)
  }, [])

  const loadPersonalBests = useCallback(async (id: string) => {
    const bests = await getPersonalBests(id)
    setPersonalBests(bests)
  }, [])

  const loadUserRanks = useCallback(async (id: string) => {
    const ranks: Record<number, { rank: number; total: number }> = {}

    for (const category of DURATION_CATEGORIES) {
      const result = await getUserDurationRank(id, category.value)
      ranks[category.value] = {
        rank: result.rank,
        total: result.total,
      }
    }

    setUserRanks(ranks)
  }, [])

  useEffect(() => {
    void loadUserId()
  }, [loadUserId])

  useEffect(() => {
    if (userId) {
      void loadRankings(selectedDuration)
      void loadPersonalBests(userId)
      void loadUserRanks(userId)
    }
  }, [userId, selectedDuration, loadPersonalBests, loadRankings, loadUserRanks])

  // Suscribirse a actualizaciones en tiempo real
  useEffect(() => {
    if (!userId) return

    let timeoutId: number | undefined
    const unsubscribe = subscribeToDurationRanking(selectedDuration, (update) => {
      setLiveUpdate(update)
      
      // Recargar rankings después de 2 segundos para mostrar la notificación primero
      timeoutId = window.setTimeout(() => {
        void loadRankings(selectedDuration)
        setLiveUpdate(null)
      }, 2000)
    })

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [userId, selectedDuration, loadRankings])

  const currentRanking = rankings[selectedDuration] || []
  const currentPersonalBest = (() => {
    if (!personalBests) return null
    switch (selectedDuration) {
      case 30:
        return personalBests.duration_30
      case 60:
        return personalBests.duration_60
      case 90:
        return personalBests.duration_90
      case 120:
        return personalBests.duration_120
      default:
        return null
    }
  })()
  const currentUserRank = userRanks[selectedDuration]

  const getDurationCategory = (duration: number) => {
    return DURATION_CATEGORIES.find(cat => cat.value === duration)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={() => onNavigate('home')} variant="secondary">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gradient">🏆 Rankings</h1>
          <div className="w-20" />
        </div>

        {/* Notificación de actualización en vivo */}
        <AnimatePresence>
          {liveUpdate && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-500/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔴</span>
                  <div>
                    <p className="text-emerald-400 font-semibold">
                      ¡Nuevo récord en tiempo real!
                    </p>
                    <p className="text-[var(--muted)] text-sm">
                      {liveUpdate.username} logró {liveUpdate.score} puntos en {liveUpdate.durationCategory}s
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selector de Duración */}
        <Card className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Selecciona la Categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DURATION_CATEGORIES.map((category) => {
              const userRank = userRanks[category.value]
              const isSelected = selectedDuration === category.value
              
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedDuration(category.value)}
                  className={`relative p-4 rounded-xl font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-[var(--secondary)] text-[var(--muted)] hover:text-[var(--foreground)] hover:opacity-90'
                  }`}
                >
                  <div className="text-2xl font-bold">{category.label}</div>
                  <div className="text-xs opacity-80">{category.description}</div>
                  {userRank && userRank.rank > 0 && (
                    <div className={`text-xs mt-2 ${isSelected ? 'text-indigo-200' : 'text-zinc-500'}`}>
                      #{userRank.rank} de {userRank.total}
                    </div>
                  )}
                  {isSelected && (
                    <motion.div
                      layoutId="selectedDuration"
                      className="absolute inset-0 border-2 border-white/30 rounded-xl"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </Card>

        {/* Mejor Tiempo Personal */}
        {currentPersonalBest && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">👑</div>
                  <div>
                    <h3 className="text-amber-400 font-bold text-lg">Tu Mejor Marca</h3>
                    <p className="text-[var(--muted)] text-sm">
                      {selectedDuration}s - {getDurationCategory(selectedDuration)?.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-400">
                    {currentPersonalBest.standardized_score || 0}
                  </div>
                  <div className="text-[var(--muted)] text-sm">puntos</div>
                  {currentUserRank && currentUserRank.rank > 0 && (
                    <div className="text-amber-300 text-sm mt-1">
                      #{currentUserRank.rank} global
                    </div>
                  )}
                </div>
              </div>
              
              {/* Stats detallados */}
              <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-amber-500/20">
                <div className="text-center">
                  <div className="text-amber-400 font-bold">{currentPersonalBest.wpm}</div>
                  <div className="text-[var(--muted)] text-xs">WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-400 font-bold">{currentPersonalBest.accuracy}%</div>
                  <div className="text-[var(--muted)] text-xs">Precisión</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-400 font-bold">{currentPersonalBest.errors}</div>
                  <div className="text-[var(--muted)] text-xs">Errores</div>
                </div>
                <div className="text-center">
                  <div className="text-amber-400 font-bold">{currentPersonalBest.words_completed || 0}</div>
                  <div className="text-[var(--muted)] text-xs">Palabras</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tabla de Rankings */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Top Jugadores - {getDurationCategory(selectedDuration)?.label} {getDurationCategory(selectedDuration)?.description}
            </h2>
            {loading && (
              <div className="text-[var(--muted)] text-sm">Cargando...</div>
            )}
          </div>

          {currentRanking.length === 0 ? (
            <div className="text-center py-12 text-[var(--muted)]">
              No hay registros aún para esta categoría. ¡Sé el primero! 🎮
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--card-border)]">
                    <th className="text-left py-3 px-4 text-[var(--muted)] font-medium">#</th>
                    <th className="text-left py-3 px-4 text-[var(--muted)] font-medium">Jugador</th>
                    <th className="text-center py-3 px-4 text-[var(--muted)] font-medium">Score</th>
                    <th className="text-center py-3 px-4 text-[var(--muted)] font-medium">WPM</th>
                    <th className="text-center py-3 px-4 text-[var(--muted)] font-medium">Precisión</th>
                    <th className="text-center py-3 px-4 text-[var(--muted)] font-medium">Palabras</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRanking.map((entry, index) => {
                    const isUserEntry = entry.user_id === userId
                    const isPersonalBest = currentPersonalBest?.id === entry.id
                    
                    return (
                      <motion.tr
                        key={entry.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-[var(--card-border)] transition-colors ${
                          isUserEntry ? 'bg-indigo-600/20' : ''
                        } ${
                          index < 3 ? 'bg-gradient-to-r from-indigo-500/10 to-transparent' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && (
                            <span className={isUserEntry ? 'text-indigo-400 font-bold' : 'text-[var(--muted)]'}>
                              {index + 1}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {entry.avatar_url ? (
                              <img
                                src={entry.avatar_url}
                                alt={entry.username || 'Jugador'}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                isUserEntry ? 'bg-indigo-600 text-white' : 'bg-[var(--secondary)] text-[var(--muted)]'
                              }`}>
                                {entry.username?.[0]?.toUpperCase() || '?'}
                              </div>
                            )}
                            <span className={`font-semibold ${
                              isUserEntry ? 'text-indigo-400' : 'text-[var(--foreground)]'
                            }`}>
                              {entry.username || 'Anónimo'}
                              {isPersonalBest && ' 👑'}
                            </span>
                            {index < 3 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                                Top {index + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-bold text-lg ${
                            isUserEntry ? 'text-indigo-400' : 'text-emerald-400'
                          }`}>
                            {entry.standardized_score || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-[var(--muted)]">
                          {entry.wpm}
                        </td>
                        <td className="py-3 px-4 text-center text-[var(--muted)]">
                          {entry.accuracy}%
                        </td>
                        <td className="py-3 px-4 text-center text-[var(--muted)]">
                          {entry.words_completed || '-'}
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Leyenda de Score */}
        <Card className="bg-[var(--secondary)]">
          <h3 className="text-sm font-semibold text-[var(--muted)] mb-2">📊 Fórmula de Puntuación</h3>
          <p className="text-[var(--muted)] text-sm font-mono">
            Score = (palabras × 100) + (WPM × precisión) - (errores × 10)
          </p>
          <p className="text-[var(--muted)] text-xs mt-2">
            Esta fórmula asegura una comparación justa entre jugadores, considerando velocidad, precisión y cantidad de palabras completadas.
          </p>
        </Card>
      </div>
    </div>
  )
}

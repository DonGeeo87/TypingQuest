import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components'
import {
  getAllDurationRankings,
  getPersonalBests,
  getUserDurationRank,
  DURATION_CATEGORIES,
} from '../services/supabaseService'
import { getCurrentUser } from '../lib/supabase'
import type { RankedGame, PersonalBest } from '../types'
import { t } from '../i18n'
import { useGameStore } from '../store/gameStore'

interface RankingScreenProps {
  onNavigate: (screen: string) => void
}

export function RankingScreen({ onNavigate }: RankingScreenProps) {
  const [rankings, setRankings] = useState<Record<number, RankedGame[]>>({})
  const [personalBests, setPersonalBests] = useState<PersonalBest | null>(null)
  const [userRanks, setUserRanks] = useState<Record<number, { rank: number; total: number }>>({})
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const { language } = useGameStore()

  const loadAll = useCallback(async () => {
    setLoading(true)
    const id = await getCurrentUser()
    setUserId(id)

    const allRankings = await getAllDurationRankings(10)
    setRankings(allRankings)

    if (id) {
      const bests = await getPersonalBests(id)
      setPersonalBests(bests)

      const ranks: Record<number, { rank: number; total: number }> = {}
      for (const cat of DURATION_CATEGORIES) {
        const result = await getUserDurationRank(id, cat.value)
        ranks[cat.value] = { rank: result.rank, total: result.total }
      }
      setUserRanks(ranks)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const getPersonalBestForDuration = (duration: number) => {
    if (!personalBests) return null
    switch (duration) {
      case 30: return personalBests.duration_30
      case 60: return personalBests.duration_60
      case 90: return personalBests.duration_90
      case 120: return personalBests.duration_120
      default: return null
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={() => onNavigate('home')} variant="secondary">
            ← {t(language, 'ranking.back')}
          </Button>
          <h1 className="text-3xl font-bold text-gradient">🏆 {t(language, 'ranking.title')}</h1>
          <div className="w-20" />
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--muted)]">{t(language, 'ranking.loading')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {DURATION_CATEGORIES.map((category) => {
              const catRanking = rankings[category.value] || []
              const personalBest = getPersonalBestForDuration(category.value)
              const userRank = userRanks[category.value]

              return (
                <motion.div
                  key={category.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: DURATION_CATEGORIES.indexOf(category) * 0.08 }}
                >
                  <Card className="h-full flex flex-col gap-3">
                    {/* Column Header */}
                    <div className="text-center pb-2 border-b border-[var(--card-border)]">
                      <div className="text-2xl font-bold text-[var(--foreground)]">{category.label}</div>
                      <div className="text-xs text-[var(--muted)]">{category.description}</div>
                      {userRank && userRank.rank > 0 && (
                        <div className="text-xs text-indigo-400 mt-1">
                          {t(language, 'ranking.yourPosition')}: #{userRank.rank} {t(language, 'ranking.of')} {userRank.total}
                        </div>
                      )}
                    </div>

                    {/* Personal Best */}
                    {personalBest && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-center">
                        <div className="text-xs text-amber-400 font-semibold">👑 {t(language, 'ranking.yourBest')}</div>
                        <div className="text-lg font-bold text-amber-400">
                          {personalBest.standardized_score || 0}
                        </div>
                        <div className="text-xs text-[var(--muted)]">
                          {personalBest.wpm} WPM · {personalBest.accuracy}%
                        </div>
                      </div>
                    )}

                    {/* Ranking List */}
                    <div className="flex-1 space-y-1">
                      {catRanking.length === 0 ? (
                        <div className="text-center py-6 text-[var(--muted)] text-sm">
                          {t(language, 'ranking.noRecords')}
                        </div>
                      ) : (
                        catRanking.map((entry, index) => {
                          const isUser = entry.user_id === userId
                          return (
                            <div
                              key={entry.id || index}
                              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                                isUser ? 'bg-indigo-600/20' : index < 3 ? 'bg-[var(--secondary)]/50' : ''
                              }`}
                            >
                              {/* Rank */}
                              <span className="w-6 text-center shrink-0">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (
                                  <span className={`text-xs ${isUser ? 'text-indigo-400 font-bold' : 'text-[var(--muted)]'}`}>
                                    {index + 1}
                                  </span>
                                )}
                              </span>

                              {/* Avatar */}
                              {entry.avatar_url ? (
                                <img src={entry.avatar_url} alt="" className="w-6 h-6 rounded-full shrink-0" />
                              ) : (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isUser ? 'bg-indigo-600 text-white' : 'bg-[var(--secondary)] text-[var(--muted)]'
                                }`}>
                                  {entry.username?.[0]?.toUpperCase() || '?'}
                                </div>
                              )}

                              {/* Name */}
                              <span className={`flex-1 truncate text-xs font-medium ${
                                isUser ? 'text-indigo-400' : 'text-[var(--foreground)]'
                              }`}>
                                {entry.username || 'Anónimo'}
                              </span>

                              {/* Score */}
                              <span className={`font-bold text-sm shrink-0 ${
                                isUser ? 'text-indigo-400' : 'text-emerald-400'
                              }`}>
                                {entry.standardized_score || 0}
                              </span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Score Formula */}
        <AnimatePresence>
          {!loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="bg-[var(--secondary)] text-center">
                <p className="text-[var(--muted)] text-xs font-mono">
                  {t(language, 'ranking.scoreFormula')}
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

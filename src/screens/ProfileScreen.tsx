import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components'
import { linkEmailToCurrentUser } from '../lib/supabase'
import { getProfile, getUserGameResults, getUserMissions, getUserAchievements, signOut } from '../services/supabaseService'
import { RegistrationScreen } from './RegistrationScreen'
import { useAuthStore } from '../store/authStore'
import { log } from '../utils/logger'
import type { Profile, GameResult, UserMission, UserAchievement } from '../types'

interface ProfileScreenProps {
  onNavigate: (screen: string) => void
  onRegistrationComplete?: () => void
}

export function ProfileScreen({ onNavigate, onRegistrationComplete }: ProfileScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recentGames, setRecentGames] = useState<GameResult[]>([])
  const [missions, setMissions] = useState<UserMission[]>([])
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [needsRegistration, setNeedsRegistration] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [linkEmail, setLinkEmail] = useState('')
  const [linking, setLinking] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)
  const { userId, isAnonymous, email, signOut: storeSignOut } = useAuthStore()

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      onNavigate('auth')
      return
    }

    const [profileData, gamesData, missionsData, achievementsData] = await Promise.all([
      getProfile(userId),
      getUserGameResults(userId, 5),
      getUserMissions(userId),
      getUserAchievements(userId),
    ])

    setProfile(profileData)
    setRecentGames(gamesData)
    setMissions(missionsData)
    setAchievements(achievementsData)

    // Verificar si necesita registrarse (no tiene username)
    if (!profileData?.username || profileData.username.trim().length === 0) {
      setNeedsRegistration(true)
    }

    setLoading(false)
  }, [userId, onNavigate])

  useEffect(() => {
    void loadProfile()
  }, [loadProfile])

  const handleRegistrationComplete = () => {
    setNeedsRegistration(false)
    setShowRegistration(false)
    void loadProfile() // Recargar el perfil con el nuevo username
    if (onRegistrationComplete) {
      onRegistrationComplete()
    }
  }

  const handleSignOut = () => {
    setShowSignOutConfirm(true)
  }

  const confirmSignOut = async () => {
    setShowSignOutConfirm(false)

    try {
      await signOut()
      await storeSignOut()
      window.location.reload()
    } catch (error) {
      log.error('Error al cerrar sesión:', error)
    }
  }

  const handleLinkEmail = useCallback(async () => {
    const clean = linkEmail.trim().toLowerCase()
    if (!clean || !clean.includes('@')) {
      setLinkError('Ingresa un email válido.')
      return
    }

    setLinkError(null)
    setLinking(true)
    try {
      await linkEmailToCurrentUser(clean, window.location.origin)
      setLinkSent(true)
    } catch (e) {
      setLinkError(e instanceof Error ? e.message : 'No se pudo vincular el email')
    } finally {
      setLinking(false)
    }
  }, [linkEmail])

  if (showRegistration) {
    return (
      <RegistrationScreen
        onComplete={handleRegistrationComplete}
        onBack={() => setShowRegistration(false)}
        onRecoverAccount={() => onNavigate('auth')}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Cargando perfil...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={() => onNavigate('home')} variant="secondary">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-gradient">👤 Profile</h1>
          <div className="w-20" />
        </div>

        {/* Profile Stats */}
        <Card className="space-y-6">
          {needsRegistration && (
            <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-amber-600 text-sm">
                  Tu perfil no tiene apodo todavía. Puedes seguir jugando como invitado o elegir uno para aparecer en rankings.
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onNavigate('auth')}>
                    Iniciar sesión
                  </Button>
                  <Button variant="accent" onClick={() => setShowRegistration(true)}>
                    Elegir apodo
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-20 h-20 rounded-full border-2 border-indigo-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">{profile?.username || 'Invitado'}</h2>
              <p className="text-[var(--muted)]">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
              <div className="text-3xl font-bold text-indigo-400">{profile?.total_games || 0}</div>
              <div className="text-[var(--muted)] text-sm">Games Played</div>
            </div>
            <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
              <div className="text-3xl font-bold text-green-400">{profile?.total_wins || 0}</div>
              <div className="text-[var(--muted)] text-sm">Wins</div>
            </div>
            <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
              <div className="text-3xl font-bold text-amber-400">{profile?.best_wpm || 0}</div>
              <div className="text-[var(--muted)] text-sm">Best WPM</div>
            </div>
            <div className="text-center p-4 bg-[var(--secondary)] rounded-lg">
              <div className="text-3xl font-bold text-violet-400">{profile?.best_accuracy || 0}%</div>
              <div className="text-[var(--muted)] text-sm">Best Accuracy</div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-xl font-bold text-[var(--foreground)]">🔐 Cuenta</h3>

          {isAnonymous ? (
            <div className="space-y-3">
              <div className="text-[var(--muted)] text-sm">
                Estás jugando en modo anónimo. Si cambias de dispositivo o borras datos, no podrás recuperar tu progreso.
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <input
                  value={linkEmail}
                  onChange={(e) => setLinkEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
                />
                <Button onClick={handleLinkEmail} disabled={linking || linkSent}>
                  {linkSent ? 'Revisa tu email' : linking ? 'Enviando…' : 'Vincular email'}
                </Button>
              </div>

              {linkSent && (
                <div className="text-emerald-300 text-sm">
                  Te enviamos un enlace. Ábrelo para confirmar y convertir tu cuenta en recuperable.
                </div>
              )}

              <AnimatePresence>
                {linkError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm"
                  >
                    {linkError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-[var(--muted)] text-sm">
              Sesión activa{email ? `: ${email}` : ''}.
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleSignOut}>Cerrar sesión</Button>
          </div>
        </Card>

        {/* Recent Games */}
        <Card>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">🎮 Recent Games</h3>
          {recentGames.length === 0 ? (
            <p className="text-[var(--muted)] text-center py-8">No games played yet. Start playing!</p>
          ) : (
            <div className="space-y-2">
              {recentGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-[var(--secondary)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${game.language === 'en' ? '' : ''}`}>
                      {game.language === 'en' ? '🇬🇧' : '🇪🇸'}
                    </span>
                    <span className="text-[var(--foreground)] font-medium">Level {game.level}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-indigo-400 font-bold">{game.wpm} WPM</span>
                    <span className="text-violet-400">{game.accuracy}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Missions */}
        <Card>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">📋 Missions</h3>
          {missions.length === 0 ? (
            <p className="text-[var(--muted)] text-center py-8">No active missions. Play games to get missions!</p>
          ) : (
            <div className="space-y-3">
              {missions.map((mission, index) => (
                <motion.div
                  key={mission.mission_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${mission.completed
                    ? 'border-green-500/50 bg-green-500/10'
                    : 'border-[var(--card-border)] bg-[var(--secondary)]'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[var(--foreground)]">Mission</div>
                      <div className="text-sm text-[var(--muted)]">Progress: {mission.progress}</div>
                    </div>
                    {mission.completed && (
                      <span className="text-green-400 font-bold">✓ Complete</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Achievements */}
        <Card>
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">🏅 Achievements</h3>
          {achievements.length === 0 ? (
            <p className="text-[var(--muted)] text-center py-8">No achievements yet. Keep playing!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.achievement_id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30"
                >
                  <div className="text-3xl mb-2">🏅</div>
                  <div className="text-xs text-[var(--muted)]">
                    Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Arcade Style Sign Out */}
        <div className="flex justify-center pt-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSignOut}
              variant="secondary"
              className="bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400 px-8 py-4 rounded-xl flex items-center gap-3 font-black tracking-widest uppercase italic shadow-lg shadow-red-500/10"
            >
              <span>🕹️ END SESSION</span>
              <span className="text-[10px] opacity-50 bg-red-400/20 px-2 py-0.5 rounded">PRESS TO RESET</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowSignOutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[var(--card-bg)] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-red-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="text-5xl mb-2">🕹️</div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">¿END SESSION?</h2>
                <p className="text-[var(--muted)] text-sm">
                  Tu progreso se guardará en el ranking, pero para volver a jugar deberás crear un nuevo apodo y avatar.
                </p>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowSignOutConfirm(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={confirmSignOut}
                    variant="accent"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    YES, RESET
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

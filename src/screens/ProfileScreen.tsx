import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button, Card } from '../components'
import { signInAnonymously, getCurrentUser } from '../lib/supabase'
import { getProfile, getUserGameResults, getUserMissions, getUserAchievements } from '../services/supabaseService'
import { RegistrationScreen } from './RegistrationScreen'
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

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    let id = await getCurrentUser()

    if (!id) {
      id = await signInAnonymously()
    }

    if (!id) return

    const [profileData, gamesData, missionsData, achievementsData] = await Promise.all([
      getProfile(id),
      getUserGameResults(id, 5),
      getUserMissions(id),
      getUserAchievements(id),
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
  }

  const handleRegistrationComplete = () => {
    setNeedsRegistration(false)
    loadProfile() // Recargar el perfil con el nuevo username
    if (onRegistrationComplete) {
      onRegistrationComplete()
    }
  }

  // Mostrar pantalla de registro si no tiene username
  if (needsRegistration) {
    return <RegistrationScreen onComplete={handleRegistrationComplete} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">Loading profile...</div>
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
              <h2 className="text-2xl font-bold text-white">{profile?.username || 'Anonymous'}</h2>
              <p className="text-zinc-400">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-3xl font-bold text-indigo-400">{profile?.total_games || 0}</div>
              <div className="text-zinc-400 text-sm">Games Played</div>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-3xl font-bold text-green-400">{profile?.total_wins || 0}</div>
              <div className="text-zinc-400 text-sm">Wins</div>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-3xl font-bold text-amber-400">{profile?.best_wpm || 0}</div>
              <div className="text-zinc-400 text-sm">Best WPM</div>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-3xl font-bold text-violet-400">{profile?.best_accuracy || 0}%</div>
              <div className="text-zinc-400 text-sm">Best Accuracy</div>
            </div>
          </div>
        </Card>

        {/* Recent Games */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">🎮 Recent Games</h3>
          {recentGames.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">No games played yet. Start playing!</p>
          ) : (
            <div className="space-y-2">
              {recentGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${game.language === 'en' ? '' : ''}`}>
                      {game.language === 'en' ? '🇬🇧' : '🇪🇸'}
                    </span>
                    <span className="text-white font-medium">Level {game.level}</span>
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
          <h3 className="text-xl font-bold text-white mb-4">📋 Missions</h3>
          {missions.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">No active missions. Play games to get missions!</p>
          ) : (
            <div className="space-y-3">
              {missions.map((mission, index) => (
                <motion.div
                  key={mission.mission_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    mission.completed
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-zinc-700 bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Mission</div>
                      <div className="text-sm text-zinc-400">Progress: {mission.progress}</div>
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
          <h3 className="text-xl font-bold text-white mb-4">🏅 Achievements</h3>
          {achievements.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">No achievements yet. Keep playing!</p>
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
                  <div className="text-xs text-zinc-400">
                    Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

import { supabase } from '../lib/supabase'
import type {
  GameResult,
  Profile,
  PvPMatch,
  Mission,
  UserMission,
  Achievement,
  UserAchievement,
  RankingEntry,
  RankedGame,
  PersonalBest,
  RealtimeRankingUpdate,
  DurationCategory,
} from '../types'

// ============================================
// DURATION CATEGORIES
// ============================================

export const DURATION_CATEGORIES: DurationCategory[] = [
  { value: 30, label: '30s', description: 'Sprint' },
  { value: 60, label: '60s', description: 'Estándar' },
  { value: 90, label: '90s', description: 'Resistencia' },
  { value: 120, label: '120s', description: 'Maratón' },
]

export function getDurationCategory(duration: number): DurationCategory | undefined {
  return DURATION_CATEGORIES.find(cat => cat.value === duration)
}

// ============================================
// SCORE CALCULATION
// ============================================

/**
 * Calcula el score estandarizado para ranking justo
 * Fórmula: score = (wordsCompleted * 100) + (wpm * accuracy) - (errors * 10)
 */
export function calculateStandardizedScore(
  wordsCompleted: number,
  wpm: number,
  accuracy: number,
  errors: number
): number {
  const baseScore = wordsCompleted * 100
  const performanceScore = wpm * (accuracy / 100)
  const penaltyScore = errors * 10
  
  return Math.round(baseScore + performanceScore - penaltyScore)
}

/**
 * Calcula el score normalizado por tiempo para ranking justo
 * Fórmula: (wpm * accuracy) / duration_factor
 */
export function calculateTimeNormalizedScore(
  wpm: number,
  accuracy: number,
  durationSeconds: number
): number {
  // Factor de duración: normalizamos a 60 segundos como base
  const durationFactor = durationSeconds / 60
  
  // Evitar división por cero
  if (durationFactor <= 0) return 0
  
  const normalizedScore = (wpm * (accuracy / 100)) / durationFactor
  
  return Math.round(normalizedScore * 100) // Multiplicamos por 100 para tener enteros
}

// ============================================
// PROFILES
// ============================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
  await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
}

export async function incrementGamesPlayed(userId: string): Promise<void> {
  await supabase.rpc('increment_games_played', { user_id: userId })
}

// ============================================
// GAME RESULTS
// ============================================

export async function saveGameResult(result: Omit<GameResult, 'id' | 'created_at'>): Promise<GameResult | null> {
  // Calcular standardized score si tenemos words_completed
  const standardizedScore = result.words_completed 
    ? calculateStandardizedScore(
        result.words_completed,
        result.wpm,
        result.accuracy,
        result.errors
      )
    : undefined

  // Calcular time normalized score
  const timeNormalizedScore = result.duration
    ? calculateTimeNormalizedScore(result.wpm, result.accuracy, result.duration)
    : undefined

  const { data, error } = await supabase
    .from('game_results')
    .insert({
      ...result,
      standardized_score: standardizedScore,
      time_normalized_score: timeNormalizedScore,
    })
    .select()
    .single()

  if (error) return null
  return data
}

export async function getUserGameResults(userId: string, limit = 10): Promise<GameResult[]> {
  const { data } = await supabase
    .from('game_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

// ============================================
// RANKINGS
// ============================================

export async function getGlobalWPMRanking(limit = 100): Promise<RankingEntry[]> {
  const { data } = await supabase
    .from('global_wpm_ranking')
    .select('*')
    .limit(limit)

  return data || []
}

export async function getLanguageLevelRanking(
  language: 'en' | 'es',
  level: number,
  limit = 50
): Promise<RankingEntry[]> {
  const { data } = await supabase
    .from('language_level_ranking')
    .select('*')
    .eq('language', language)
    .eq('level', level)
    .limit(limit)

  return data || []
}

export async function getUserRank(userId: string): Promise<number> {
  const { data } = await supabase
    .from('global_wpm_ranking')
    .select('id', { count: 'exact' })
    .gte('best_wpm', 0)

  if (!data) return 0

  const userPosition = data.findIndex(entry => entry.id === userId)
  return userPosition + 1
}

// ============================================
// DURATION-BASED RANKINGS
// ============================================

/**
 * Obtiene el ranking para una categoría de duración específica
 */
export async function getDurationRanking(
  duration: number,
  limit = 50
): Promise<RankedGame[]> {
  const { data } = await supabase
    .from('game_results')
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq('game_duration', duration)
    .order('standardized_score', { ascending: false })
    .limit(limit)

  return (data || []).map((game: any) => ({
    ...game,
    time_normalized_score: game.time_normalized_score || 0,
    duration_category: getDurationCategory(game.game_duration)?.label || 'Unknown',
  }))
}

/**
 * Obtiene todos los rankings agrupados por duración
 */
export async function getAllDurationRankings(limit = 50): Promise<Record<number, RankedGame[]>> {
  const rankings: Record<number, RankedGame[]> = {}
  
  for (const category of DURATION_CATEGORIES) {
    rankings[category.value] = await getDurationRanking(category.value, limit)
  }
  
  return rankings
}

/**
 * Obtiene el mejor resultado personal para cada categoría de duración
 */
export async function getPersonalBests(userId: string): Promise<PersonalBest> {
  const { data } = await supabase
    .from('game_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!data || data.length === 0) {
    return {
      duration_30: null,
      duration_60: null,
      duration_90: null,
      duration_120: null,
      overall_best: null,
    }
  }

  const personalBests: PersonalBest = {
    duration_30: null,
    duration_60: null,
    duration_90: null,
    duration_120: null,
    overall_best: null,
  }

  let bestScore = -1

  for (const game of data) {
    const duration = game.game_duration
    const score = game.standardized_score || 0

    // Actualizar mejor por duración
    if (duration === 30 && !personalBests.duration_30) {
      personalBests.duration_30 = game
    } else if (duration === 60 && !personalBests.duration_60) {
      personalBests.duration_60 = game
    } else if (duration === 90 && !personalBests.duration_90) {
      personalBests.duration_90 = game
    } else if (duration === 120 && !personalBests.duration_120) {
      personalBests.duration_120 = game
    }

    // Actualizar mejor overall
    if (score > bestScore) {
      bestScore = score
      personalBests.overall_best = game
    }
  }

  return personalBests
}

/**
 * Obtiene el ranking del usuario para una categoría específica
 */
export async function getUserDurationRank(
  userId: string,
  duration: number
): Promise<{ rank: number; total: number; personalBest: GameResult | null }> {
  // Obtener todos los juegos de esta duración
  const { data: allGames, count } = await supabase
    .from('game_results')
    .select('user_id, standardized_score', { count: 'exact' })
    .eq('game_duration', duration)
    .order('standardized_score', { ascending: false })

  // Obtener mejor juego del usuario
  const { data: userBest } = await supabase
    .from('game_results')
    .select('*')
    .eq('user_id', userId)
    .eq('game_duration', duration)
    .order('standardized_score', { ascending: false })
    .limit(1)

  if (!allGames || allGames.length === 0) {
    return { rank: 0, total: 0, personalBest: userBest?.[0] || null }
  }

  const userScore = userBest?.[0]?.standardized_score || 0
  const rank = allGames.findIndex(g => g.user_id === userId && g.standardized_score === userScore) + 1

  return {
    rank: rank > 0 ? rank : allGames.length + 1,
    total: count || allGames.length,
    personalBest: userBest?.[0] || null,
  }
}

// ============================================
// REALTIME RANKINGS
// ============================================

/**
 * Suscribe a actualizaciones en tiempo real del ranking global
 */
export function subscribeToGlobalRanking(
  callback: (update: RealtimeRankingUpdate) => void
): () => void {
  const channel = supabase
    .channel('global_ranking')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_results',
      },
      async (payload) => {
        const newGame = payload.new as GameResult
        
        // Obtener información del perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', newGame.user_id)
          .single()

        if (profile) {
          callback({
            type: 'new_record',
            userId: newGame.user_id || '',
            username: profile.username,
            score: newGame.standardized_score || 0,
            durationCategory: newGame.game_duration,
            timestamp: newGame.created_at || new Date().toISOString(),
          })
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Suscribe a actualizaciones de ranking para una duración específica
 */
export function subscribeToDurationRanking(
  duration: number,
  callback: (update: RealtimeRankingUpdate) => void
): () => void {
  const channel = supabase
    .channel(`duration_ranking_${duration}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_results',
        filter: `game_duration=eq.${duration}`,
      },
      async (payload) => {
        const newGame = payload.new as GameResult
        
        // Obtener información del perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', newGame.user_id)
          .single()

        if (profile) {
          callback({
            type: 'new_record',
            userId: newGame.user_id || '',
            username: profile.username,
            score: newGame.standardized_score || 0,
            durationCategory: duration,
            timestamp: newGame.created_at || new Date().toISOString(),
          })
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Verifica si un nuevo score supera el récord personal
 */
export async function checkNewPersonalRecord(
  userId: string,
  duration: number,
  newScore: number
): Promise<boolean> {
  const { data } = await supabase
    .from('game_results')
    .select('standardized_score')
    .eq('user_id', userId)
    .eq('game_duration', duration)
    .order('standardized_score', { ascending: false })
    .limit(1)

  if (!data || data.length === 0) {
    return true // Primer récord
  }

  const currentBest = data[0].standardized_score || 0
  return newScore > currentBest
}

/**
 * Suscribe a notificaciones cuando alguien supera tu récord
 */
export function subscribeToRecordNotifications(
  userId: string,
  callback: (notification: RealtimeRankingUpdate) => void
): () => void {
  // Suscribirse a todas las categorías de duración
  const channels: (() => void)[] = []

  for (const category of DURATION_CATEGORIES) {
    const channel = supabase
      .channel(`record_notify_${userId}_${category.value}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_results',
          filter: `game_duration=eq.${category.value}`,
        },
        async (payload) => {
          const newGame = payload.new as GameResult
          
          // Verificar si este score supera el récord del usuario
          const { data: userBest } = await supabase
            .from('game_results')
            .select('standardized_score')
            .eq('user_id', userId)
            .eq('game_duration', category.value)
            .order('standardized_score', { ascending: false })
            .limit(1)

          const userScore = userBest?.[0]?.standardized_score || 0
          const newScore = newGame.standardized_score || 0

          if (newScore > userScore && newGame.user_id !== userId) {
            // Obtener información del perfil
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', newGame.user_id)
              .single()

            if (profile) {
              callback({
                type: 'overtake',
                userId: newGame.user_id || '',
                username: profile.username,
                score: newScore,
                durationCategory: category.value,
                timestamp: newGame.created_at || new Date().toISOString(),
              })
            }
          }
        }
      )
      .subscribe()

    channels.push(() => supabase.removeChannel(channel))
  }

  return () => {
    channels.forEach(unsubscribe => unsubscribe())
  }
}

// ============================================
// PVP MATCHES
// ============================================

export async function createPvPMatch(player1Id: string): Promise<PvPMatch | null> {
  const { data, error } = await supabase
    .from('pvp_matches')
    .insert({
      player1_id: player1Id,
      status: 'waiting',
    })
    .select()
    .single()

  if (error) return null
  return data
}

export async function joinPvPMatch(matchId: string, player2Id: string): Promise<boolean> {
  const { error } = await supabase
    .from('pvp_matches')
    .update({
      player2_id: player2Id,
      status: 'playing',
      started_at: new Date().toISOString(),
    })
    .eq('id', matchId)
    .eq('status', 'waiting')

  return !error
}

export async function finishPvPMatch(
  matchId: string,
  winnerId: string,
  player1Wpm: number,
  player2Wpm: number,
  player1Accuracy: number,
  player2Accuracy: number
): Promise<void> {
  await supabase
    .from('pvp_matches')
    .update({
      winner_id: winnerId,
      player1_wpm: player1Wpm,
      player2_wpm: player2Wpm,
      player1_accuracy: player1Accuracy,
      player2_accuracy: player2Accuracy,
      status: 'finished',
      finished_at: new Date().toISOString(),
    })
    .eq('id', matchId)
}

export async function getWaitingMatches(): Promise<PvPMatch[]> {
  const { data } = await supabase
    .from('pvp_matches')
    .select('*')
    .eq('status', 'waiting')
    .order('created_at', { ascending: false })

  return data || []
}

export async function subscribeToMatch(
  matchId: string,
  callback: (match: PvPMatch) => void
): Promise<() => void> {
  const channel = supabase
    .channel(`pvp_match:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'pvp_matches',
        filter: `id=eq.${matchId}`,
      },
      (payload) => {
        callback(payload.new as PvPMatch)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// ============================================
// MISSIONS
// ============================================

export async function getActiveMissions(): Promise<Mission[]> {
  const { data } = await supabase
    .from('missions')
    .select('*')
    .eq('is_active', true)
    .order('is_daily', { ascending: false })

  return data || []
}

export async function getUserMissions(userId: string): Promise<UserMission[]> {
  const { data } = await supabase
    .from('user_missions')
    .select('*')
    .eq('user_id', userId)

  return data || []
}

export async function updateUserMissionProgress(
  userId: string,
  missionId: string,
  progress: number,
  completed: boolean
): Promise<void> {
  await supabase
    .from('user_missions')
    .upsert({
      user_id: userId,
      mission_id: missionId,
      progress,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
}

export async function claimMissionReward(userId: string, missionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('user_missions')
    .update({ claimed: true })
    .eq('user_id', userId)
    .eq('mission_id', missionId)
    .eq('completed', true)

  return !error
}

// ============================================
// ACHIEVEMENTS
// ============================================

export async function getAllAchievements(): Promise<Achievement[]> {
  const { data } = await supabase
    .from('achievements')
    .select('*')
    .order('category')

  return data || []
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const { data } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)

  return data || []
}

export async function unlockAchievement(userId: string, achievementId: string): Promise<void> {
  await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievementId,
    })
}

// ============================================
// USERNAME MANAGEMENT
// ============================================

/**
 * Verifica si un nombre de usuario está disponible
 */
export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username.trim())
    .single()

  // Si no hay datos, el username está disponible
  return !data
}

/**
 * Obtiene un perfil por nombre de usuario
 */
export async function getUserByUsername(username: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username.trim())
    .single()

  if (!data) return null
  return data
}

/**
 * Actualiza el nombre de usuario de un perfil
 */
export async function updateUsername(userId: string, username: string): Promise<void> {
  await supabase
    .from('profiles')
    .update({ 
      username: username.trim(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
}

/**
 * Verifica si un usuario tiene un nombre de usuario configurado
 */
export async function hasUsername(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single()

  return !!data?.username && data.username.trim().length > 0
}

// ============================================
// AUTH HELPERS
// ============================================

export async function signInAnonymously(): Promise<string | null> {
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) return null
  return data.user?.id || null
}

export async function getCurrentUser(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data.user?.id || null
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

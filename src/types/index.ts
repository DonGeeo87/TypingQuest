// Tipos principales de TypingQuest

export type Language = 'en' | 'es'

export type GameLevel = 1 | 2 | 3 | 4 | 5

export type GameStatus = 'idle' | 'playing' | 'paused' | 'finished'

export type MatchStatus = 'waiting' | 'playing' | 'finished'

export interface WordData {
  word: string
  translation?: string
  difficulty: GameLevel
}

export interface PhraseData {
  phrase: string
  translation?: string
  difficulty: GameLevel
}

export interface ParagraphData {
  paragraph: string
  translation?: string
  difficulty: GameLevel
}

export interface GameState {
  language: Language
  level: GameLevel
  status: GameStatus
  currentText: string
  currentIndex: number
  typedChars: string[]
  correctChars: number
  incorrectChars: number
  errors: number
  combo: number
  maxCombo: number
  startTime: number | null
  endTime: number | null
  wpm: number
  accuracy: number
  gameDuration: number
  timeRemaining: number
  wordsCompleted: number
  totalWords: number
  totalCorrectChars: number
  totalTypedChars: number
}

export interface GameResult {
  id?: string
  user_id?: string
  language: Language
  level: GameLevel
  wpm: number
  accuracy: number
  errors: number
  combo_max: number
  duration: number
  game_duration?: number  // Duración total del juego en segundos (30, 60, 90, 120)
  standardized_score?: number  // Score estandarizado para ranking justo
  words_completed?: number  // Número de palabras completadas
  created_at?: string
}

export interface RankedGame extends GameResult {
  time_normalized_score: number
  duration_category: string
  rank_position?: number
  username?: string
  avatar_url?: string
}

export interface PersonalBest {
  duration_30: GameResult | null
  duration_60: GameResult | null
  duration_90: GameResult | null
  duration_120: GameResult | null
  overall_best: GameResult | null
}

export interface Profile {
  id: string
  username: string
  avatar_url?: string
  total_games: number
  total_wins: number
  best_wpm: number
  best_accuracy: number
  created_at: string
  updated_at: string
}

export interface PvPMatch {
  id: string
  player1_id: string
  player2_id?: string
  winner_id?: string
  player1_wpm?: number
  player2_wpm?: number
  player1_accuracy?: number
  player2_accuracy?: number
  status: MatchStatus
  created_at: string
  started_at?: string
  finished_at?: string
}

export interface Mission {
  id: string
  title: string
  description: string
  type: string
  target_value: number
  reward: number
  is_daily: boolean
  is_active: boolean
  created_at: string
}

export interface UserMission {
  user_id: string
  mission_id: string
  progress: number
  completed: boolean
  completed_at?: string
  claimed: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon_url?: string
  category: string
  requirement_type: string
  requirement_value: number
  created_at: string
}

export interface UserAchievement {
  user_id: string
  achievement_id: string
  unlocked_at: string
}

export interface RankingEntry {
  id: string
  username: string
  avatar_url?: string
  best_wpm: number
  total_games: number
  avg_wpm?: number
  language?: Language
  level?: GameLevel
  games_played?: number
  avg_accuracy?: number
}

export interface GameSettings {
  language: Language
  level: GameLevel
  soundEnabled: boolean
  musicEnabled: boolean
  showFeedback: boolean
  theme: 'light' | 'dark'
}

export interface DifficultyState {
  baseWpm: number
  currentMultiplier: number
  currentLevel: number
  wordsCompleted: number
  nextLevelThreshold: number
}

export interface DurationCategory {
  value: number
  label: string
  description: string
}

export interface RealtimeRankingUpdate {
  type: 'new_record' | 'rank_change' | 'overtake'
  userId: string
  username: string
  score: number
  previousRank?: number
  newRank?: number
  durationCategory?: number
  timestamp: string
}

export type MultiplayerRoomStatus = 'lobby' | 'running' | 'finished'

export type MultiplayerRoundStatus = 'scheduled' | 'running' | 'finished'

export interface MultiplayerRoom {
  id: string
  pin: string
  host_id: string
  status: MultiplayerRoomStatus
  language: Language
  level: GameLevel
  round_duration: number
  current_round: number
  created_at: string
  started_at?: string
  ended_at?: string
}

export interface MultiplayerRoomPlayer {
  room_id: string
  user_id: string
  username: string
  is_host: boolean
  joined_at: string
  last_seen: string
}

export interface MultiplayerRound {
  id: string
  room_id: string
  round_number: number
  prompt: string
  duration_seconds: number
  status: MultiplayerRoundStatus
  starts_at?: string
  ends_at?: string
  created_at: string
}

export interface MultiplayerSubmission {
  id: string
  room_id: string
  round_id: string
  user_id: string
  wpm: number
  accuracy: number
  errors: number
  words_completed: number
  score: number
  submitted_at: string
}

/**
 * Sistema de Dificultad Progresiva para TypingQuest
 * 
 * A medida que el usuario completa palabras, la velocidad requerida aumenta.
 * Cada 5 palabras completadas, se incrementa un 5% la velocidad requerida.
 */

export interface DifficultyState {
  baseWpm: number
  currentMultiplier: number
  wordsCompleted: number
  currentLevel: number
  nextLevelThreshold: number
}

export interface DifficultyLevel {
  level: number
  multiplier: number
  requiredWpm: number
  wordsCompleted: number
}

/**
 * Calcula el estado de dificultad actual basado en las palabras completadas
 */
export function calculateDifficultyState(
  baseWpm: number,
  wordsCompleted: number
): DifficultyState {
  // Cada 5 palabras, aumentar 5% la velocidad requerida
  const levelIncrease = Math.floor(wordsCompleted / 5)
  const currentMultiplier = 1 + (levelIncrease * 0.05)
  const currentLevel = levelIncrease + 1
  const nextLevelThreshold = currentLevel * 5
  
  return {
    baseWpm,
    currentMultiplier,
    wordsCompleted,
    currentLevel,
    nextLevelThreshold,
  }
}

/**
 * Calcula la velocidad requerida (WPM) basada en el nivel de dificultad
 */
export function getRequiredWpm(baseWpm: number, wordsCompleted: number): number {
  const state = calculateDifficultyState(baseWpm, wordsCompleted)
  return Math.round(baseWpm * state.currentMultiplier)
}

/**
 * Obtiene el nivel de dificultad actual como información detallada
 */
export function getDifficultyLevel(baseWpm: number, wordsCompleted: number): DifficultyLevel {
  const state = calculateDifficultyState(baseWpm, wordsCompleted)
  const requiredWpm = Math.round(baseWpm * state.currentMultiplier)
  
  return {
    level: state.currentLevel,
    multiplier: state.currentMultiplier,
    requiredWpm,
    wordsCompleted: state.wordsCompleted,
  }
}

/**
 * Calcula el porcentaje de progreso hacia el siguiente nivel de dificultad
 */
export function getProgressToNextLevel(wordsCompleted: number): number {
  const wordsInCurrentLevel = wordsCompleted % 5
  return (wordsInCurrentLevel / 5) * 100
}

/**
 * Verifica si el usuario ha alcanzado un nuevo nivel de dificultad
 */
export function checkLevelUp(previousWords: number, currentWords: number): boolean {
  const previousLevel = Math.floor(previousWords / 5) + 1
  const currentLevel = Math.floor(currentWords / 5) + 1
  return currentLevel > previousLevel
}

/**
 * Obtiene el mensaje de nivel de dificultad actual
 */
export function getDifficultyMessage(level: number, multiplier: number): string {
  const messages: Record<number, string> = {
    1: '🟢 Normal',
    2: '🔵 Acelerado',
    3: '🟡 Rápido',
    4: '🟠 Muy Rápido',
    5: '🔴 Extremo',
    6: '🟣 Legendario',
    7: '💀 Imposible',
  }
  
  return messages[level] || `🔥 Nivel ${level} (x${multiplier.toFixed(2)})`
}

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

/**
 * Hook personalizado para React que maneja el estado de dificultad
 * (Se puede usar en componentes React)
 */
export function useDifficultyTracker(
  baseWpm: number,
  wordsCompleted: number
) {
  const difficulty = getDifficultyLevel(baseWpm, wordsCompleted)
  const progress = getProgressToNextLevel(wordsCompleted)
  const message = getDifficultyMessage(difficulty.level, difficulty.multiplier)

  return {
    difficulty,
    progress,
    message,
    requiredWpm: difficulty.requiredWpm,
  }
}

export default {
  calculateDifficultyState,
  getRequiredWpm,
  getDifficultyLevel,
  getProgressToNextLevel,
  checkLevelUp,
  getDifficultyMessage,
  calculateStandardizedScore,
  calculateTimeNormalizedScore,
}

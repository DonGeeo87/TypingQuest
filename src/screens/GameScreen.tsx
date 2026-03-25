import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { useMobile } from '../hooks/useMobile'
import { TypingArea, StatsDisplay, ComboIndicator, Button, Card, Confetti, ErrorShake, ErrorParticles, TextComplete, AudioToggle, DynamicBackground } from '../components'
import type { ContentMeta } from '../data/words'
import { selectTextForLevel } from '../data/words'
import { getCurrentUser } from '../lib/supabase'
import { saveGameResult, checkNewPersonalRecord, DURATION_CATEGORIES, submitAssignmentAttempt } from '../services/supabaseService'
import {
  getDifficultyLevel,
  getProgressToNextLevel,
  checkLevelUp,
  getDifficultyMessage,
  calculateStandardizedScore,
} from '../utils/difficultyScaler'
import { useContentStore } from '../store/contentStore'

interface GameScreenProps {
  onGameEnd: () => void
  onNavigate: (screen: string) => void
}

export function GameScreen({ onGameEnd, onNavigate }: GameScreenProps) {
  const {
    language,
    level,
    status,
    currentText,
    currentIndex,
    typedChars,
    combo,
    maxCombo,
    errors,
    wpm,
    accuracy,
    startTime,
    endTime,
    gameDuration,
    timeRemaining,
    wordsCompleted,
    totalWords,
    setStatus,
    setCurrentIndex,
    addTypedChar,
    updateCombo,
    incrementError,
    setStartTime,
    setEndTime,
    calculateStats,
    initializeGame,
    decrementTime,
    incrementWordsCompletedBy,
    resetCurrentPhrase,
    advanceToNextText,
    totalCorrectChars,
    totalTypedChars,
    assignmentId,
    setAssignmentId,
  } = useGameStore()

  const [liveWpm, setLiveWpm] = useState(0)
  const [liveAccuracy, setLiveAccuracy] = useState(100)
  const [showCombo, setShowCombo] = useState(false)

  // Estados para las animaciones
  const [showConfetti, setShowConfetti] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showTextComplete, setShowTextComplete] = useState(false)
  const [errorPosition, setErrorPosition] = useState<{ x: number; y: number } | null>(null)
  const [lastCompletedWord, setLastCompletedWord] = useState('')

  // Estados para dificultad progresiva
  const [difficultyLevel, setDifficultyLevel] = useState(1)
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1)
  const [difficultyProgress, setDifficultyProgress] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [localWordsCompleted, setLocalWordsCompleted] = useState(0)
  const [mobileInputValue, setMobileInputValue] = useState('')
  const [contentMeta, setContentMeta] = useState<ContentMeta | null>(null)
  const isMobile = useMobile()

  // Hook de sonido
  const { playKeySound, playErrorSound, playCompleteSound, playVictorySound, playTimeWarning, playLevelUpSound } = useSound()

  const typingAreaRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const prevErrorsRef = useRef(errors)
  const prevWordsCompletedRef = useRef(wordsCompleted)
  const lastPlayedTimeWarningRef = useRef<number>(11)
  const rememberContentKey = useContentStore((s) => s.rememberKey)
  const buildContentKey = useContentStore((s) => s.buildKey)

  // Initialize game text
  useEffect(() => {
    const recentKeys = useContentStore.getState().recentKeys
    const selection = selectTextForLevel(language, level, 'classic', recentKeys)
    const compositeKey = buildContentKey('classic', language, level, selection.meta.pool, selection.meta.key)
    rememberContentKey(compositeKey)
    setContentMeta(selection.meta)
    initializeGame(selection.text, language, level)

    // Resetear estados
    setDifficultyLevel(1)
    setDifficultyMultiplier(1)
    setDifficultyProgress(0)
    setIsNewRecord(false)
    setLocalWordsCompleted(0)
  }, [language, level, initializeGame, rememberContentKey, buildContentKey])

  // Countdown timer con sonido de advertencia
  useEffect(() => {
    if (status !== 'playing' || timeRemaining <= 0) return

    const timer = setInterval(() => {
      decrementTime()

      if (timeRemaining <= 10 && timeRemaining > 0) {
        const currentRef = lastPlayedTimeWarningRef.current
        if ((timeRemaining === 10 && currentRef >= 10) ||
          (timeRemaining === 5 && currentRef > 5)) {
          playTimeWarning()
          lastPlayedTimeWarningRef.current = timeRemaining
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [status, timeRemaining, decrementTime, playTimeWarning])

  // Actualizar estado de dificultad progresiva
  useEffect(() => {
    if (status !== 'playing') return

    const difficulty = getDifficultyLevel(liveWpm || 30, wordsCompleted)
    setDifficultyLevel(difficulty.level)
    setDifficultyMultiplier(difficulty.multiplier)
    setDifficultyProgress(getProgressToNextLevel(wordsCompleted))

    // Detectar level up
    if (checkLevelUp(prevWordsCompletedRef.current, wordsCompleted)) {
      setShowLevelUp(true)
      playLevelUpSound?.()
      setTimeout(() => setShowLevelUp(false), 2000)
    }
  }, [wordsCompleted, liveWpm, status, playLevelUpSound])

  const saveResult = useCallback(async () => {
    const userId = await getCurrentUser()

    if (!userId) return

    const finalWpm = status === 'finished' ? wpm : liveWpm
    const finalAccuracy = status === 'finished' ? accuracy : liveAccuracy

    const standardizedScore = calculateStandardizedScore(
      wordsCompleted,
      finalWpm,
      finalAccuracy,
      errors
    )

    const duration = gameDuration || 60

    const saved = await saveGameResult({
      user_id: userId,
      language,
      level,
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors,
      combo_max: maxCombo,
      duration: startTime && endTime ? (endTime - startTime) / 1000 : gameDuration,
      game_duration: duration,
      words_completed: wordsCompleted,
      standardized_score: standardizedScore,
      content_seed: contentMeta?.seed,
      content_pool: contentMeta?.pool,
      content_version: contentMeta?.version,
      content_key: contentMeta?.key,
    })

    if (assignmentId && saved?.id) {
      await submitAssignmentAttempt({
        assignmentId,
        userId,
        gameResultId: saved.id,
        wpm: finalWpm,
        accuracy: finalAccuracy,
        errors,
        wordsCompleted,
        score: standardizedScore,
      })
      setAssignmentId(null)
    }

    const isNewRecordResult = await checkNewPersonalRecord(userId, duration, standardizedScore)
    setIsNewRecord(isNewRecordResult)
  }, [
    accuracy,
    assignmentId,
    contentMeta,
    endTime,
    errors,
    gameDuration,
    language,
    level,
    liveAccuracy,
    liveWpm,
    maxCombo,
    setAssignmentId,
    startTime,
    status,
    wpm,
    wordsCompleted,
  ])

  const processKey = useCallback((pressedChar: string) => {
    if (status === 'finished') return

    if (status === 'idle') {
      setStatus('playing')
      setStartTime(Date.now())
    }

    if (status !== 'playing') return

    const expectedChar = currentText[currentIndex]

    if (pressedChar === 'Backspace') {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
      return
    }

    if (pressedChar.length > 1 && pressedChar !== ' ') return

    const isCorrect = pressedChar === expectedChar

    addTypedChar(pressedChar, isCorrect)
    updateCombo(isCorrect)

    if (isCorrect) {
      playKeySound()
      setCurrentIndex(currentIndex + 1)

      if (currentIndex + 1 >= currentText.length) {
        const recentKeys = useContentStore.getState().recentKeys
        const selection = selectTextForLevel(language, level, 'classic', recentKeys)
        const compositeKey = buildContentKey('classic', language, level, selection.meta.pool, selection.meta.key)
        rememberContentKey(compositeKey)
        setContentMeta(selection.meta)
        advanceToNextText(selection.text)
        setLocalWordsCompleted(0)
      }
    } else {
      incrementError()
      resetCurrentPhrase()
      setLocalWordsCompleted(0)
    }
  }, [
    status,
    currentIndex,
    currentText,
    setStatus,
    setStartTime,
    setCurrentIndex,
    addTypedChar,
    updateCombo,
    playKeySound,
    advanceToNextText,
    language,
    level,
    buildContentKey,
    rememberContentKey,
    incrementError,
    resetCurrentPhrase,
  ])

  // Handle game end when time runs out
  useEffect(() => {
    if (timeRemaining <= 0 && status === 'playing') {
      setEndTime(Date.now())
      setStatus('finished')
      calculateStats()
      void saveResult()
    }
  }, [timeRemaining, status, calculateStats, saveResult, setEndTime, setStatus])

  // Calculate live stats - OPTIMIZADO para reducir renders
  useEffect(() => {
    if (!startTime || status !== 'playing') return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 60000 // minutes
      // Usar totalCorrectChars para WPM real que no baja al resetear
      const wordsTyped = totalCorrectChars / 5
      const currentWpm = elapsed > 0 ? Math.max(0, Math.round(wordsTyped / elapsed)) : 0

      // Usar totalTypedChars para precisión real histórica
      const currentAccuracy = totalTypedChars > 0 ? Math.round((totalCorrectChars / totalTypedChars) * 100) : 100

      setLiveWpm(currentWpm)
      setLiveAccuracy(currentAccuracy)
    }, 1000) // Cambiado de 500ms a 1000ms para mejor rendimiento

    return () => clearInterval(interval)
  }, [startTime, status, totalCorrectChars, totalTypedChars])

  useEffect(() => {
    if (status !== 'finished') return
    setLiveWpm(wpm)
    setLiveAccuracy(accuracy)
  }, [accuracy, status, wpm])

  // Handle combo display - OPTIMIZADO
  useEffect(() => {
    if (combo >= 5 && combo % 5 === 0) { // Solo mostrar en múltiplos de 5
      setShowCombo(true)
      const timer = setTimeout(() => setShowCombo(false), 800)
      return () => clearTimeout(timer)
    }
  }, [combo])

  useEffect(() => {
    if (status !== 'playing') return

    // Solo detectar palabra completada cuando se pulsa ESPACIO o al final del texto
    const lastChar = typedChars[typedChars.length - 1]
    const isEndOfWord = lastChar === ' ' || currentIndex >= currentText.length

    if (!isEndOfWord) return

    const textUpToIndex = currentText.substring(0, currentIndex)
    const completedWordsCount = textUpToIndex.trim().split(/\s+/).filter(w => w.length > 0).length

    if (completedWordsCount > localWordsCompleted) {
      const diff = completedWordsCount - localWordsCompleted
      if (diff > 0) {
        incrementWordsCompletedBy(diff)
        setLocalWordsCompleted(completedWordsCount)
        playCompleteSound()

        const words = currentText.split(/\s+/)
        const currentWordIndex = completedWordsCount - 1
        if (currentWordIndex >= 0 && currentWordIndex < words.length) {
          setLastCompletedWord(words[currentWordIndex])
          setShowTextComplete(true)
          setTimeout(() => setShowTextComplete(false), 1000)
        }
      }
    }
  }, [currentIndex, status, currentText, localWordsCompleted, incrementWordsCompletedBy, playCompleteSound, typedChars])

  // Detectar errores y mostrar animación con sonido - OPTIMIZADO
  useEffect(() => {
    if (errors > prevErrorsRef.current && status === 'playing') {
      playErrorSound()

      if (typingAreaRef.current) {
        const rect = typingAreaRef.current.getBoundingClientRect()
        setErrorPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }

      setShowError(true)
      setTimeout(() => setShowError(false), 500)
    }

    prevErrorsRef.current = errors
    prevWordsCompletedRef.current = wordsCompleted
  }, [errors, status, playErrorSound, wordsCompleted])

  // Mostrar confetti cuando el juego termina exitosamente con sonido de victoria
  useEffect(() => {
    if (status === 'finished' && timeRemaining > 0) {
      setShowConfetti(true)
      playVictorySound()
      setTimeout(() => setShowConfetti(false), 4000)
    }
  }, [status, timeRemaining, playVictorySound])

  // Handle keyboard input con sonidos
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    void event
    processKey(event.key)
  }, [processKey])

  // Attach keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    if (!isMobile) return
    if (status === 'finished') return
    window.setTimeout(() => {
      mobileInputRef.current?.focus()
    }, 0)
  }, [isMobile, status])

  const handleMobileChange = useCallback((value: string) => {
    if (!value) return
    for (const ch of value) {
      processKey(ch)
    }
    setMobileInputValue('')
  }, [processKey])

  const progress = (currentIndex / currentText.length) * 100
  const displayedWpm = status === 'finished' ? wpm : liveWpm
  const displayedAccuracy = status === 'finished' ? accuracy : liveAccuracy
  const displayedScore = calculateStandardizedScore(wordsCompleted, displayedWpm, displayedAccuracy, errors)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Obtener categoría de duración actual
  const durationCategory = DURATION_CATEGORIES.find(cat => cat.value === gameDuration)

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Fondo Dinámico Reactivo */}
      <DynamicBackground
        isError={showError}
        combo={combo}
        status={status}
      />

      <Confetti isActive={showConfetti} />
      <ErrorParticles isActive={showError} position={errorPosition || undefined} />
      <TextComplete isActive={showTextComplete} text={lastCompletedWord} />
      <ComboIndicator combo={combo} show={showCombo} />

      {/* Audio Toggle */}
      <AudioToggle position="top-right" compact={false} />

      {/* Notificación de Level Up */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500/50 px-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  🔥 ¡Nivel {difficultyLevel} Alcanzado!
                </div>
                <div className="text-purple-300 text-sm mt-1">
                  Velocidad requerida: +{((difficultyMultiplier - 1) * 100).toFixed(0)}%
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificación de Nuevo Récord */}
      <AnimatePresence>
        {isNewRecord && status === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-gradient-to-r from-amber-600/30 to-orange-600/30 border-amber-500/50 px-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  👑 ¡Nuevo Récord Personal!
                </div>
                <div className="text-amber-300 text-sm mt-1">
                  {durationCategory?.label} - {gameDuration}s
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button onClick={onGameEnd} variant="secondary">
            ← Back
          </Button>
          <div className="flex gap-3 items-center flex-wrap justify-center">
            {/* Temporizador */}
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${timeRemaining <= 10
              ? 'bg-red-600/20 text-red-400 animate-pulse'
              : 'bg-violet-600/20 text-violet-400'
              }`}>
              ⏱️ {formatTime(timeRemaining)}
            </span>

            {/* Idioma */}
            <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm">
              {language === 'en' ? '🇬🇧 English' : '🇪🇸 Español'}
            </span>

            {/* Nivel */}
            <span className="px-3 py-1 bg-violet-600/20 text-violet-400 rounded-full text-sm">
              Level {level}
            </span>

            {/* Duración */}
            <span className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-full text-sm">
              {durationCategory?.label || `${gameDuration}s`}
            </span>
          </div>
        </div>

        {/* Indicador de Dificultad Progresiva */}
        {status === 'playing' && (
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {difficultyLevel <= 2 ? '🟢' : difficultyLevel <= 4 ? '🟡' : difficultyLevel <= 6 ? '🟠' : '🔴'}
                </span>
                <div>
                  <div className="text-purple-300 font-bold">
                    {getDifficultyMessage(difficultyLevel, difficultyMultiplier)}
                  </div>
                  <div className="text-[var(--muted)] text-xs">
                    Palabras: {wordsCompleted} | WPM requerido: {Math.round((liveWpm || 30) * difficultyMultiplier)}
                  </div>
                </div>
              </div>

              {/* Barra de progreso hacia el siguiente nivel */}
              <div className="flex-1 max-w-[200px] ml-4">
                <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                  <span>Nivel {difficultyLevel}</span>
                  <span>Nivel {difficultyLevel + 1}</span>
                </div>
                <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${difficultyProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-center text-xs text-purple-400 mt-1">
                  {5 - (wordsCompleted % 5)} palabras para el siguiente nivel
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <StatsDisplay
          wpm={status === 'finished' ? wpm : liveWpm}
          accuracy={status === 'finished' ? accuracy : liveAccuracy}
          combo={combo}
          errors={errors}
          progress={progress}
        />

        {/* Typing Area con ErrorShake */}
        <ErrorShake isActive={showError}>
          <div
            ref={typingAreaRef}
            onPointerDown={() => {
              if (!isMobile) return
              mobileInputRef.current?.focus()
            }}
          >
            {isMobile && (
              <input
                ref={mobileInputRef}
                value={mobileInputValue}
                onChange={(e) => handleMobileChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    e.preventDefault()
                    processKey('Backspace')
                  }
                }}
                inputMode="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="fixed -left-[9999px] top-0 opacity-0"
              />
            )}
            <TypingArea
              text={currentText}
              currentIndex={currentIndex}
              typedChars={typedChars}
              isPlaying={status === 'playing' || status === 'idle'}
              timeRemaining={timeRemaining}
            />
          </div>
        </ErrorShake>

        {/* Word Progress */}
        <div className="text-center text-[var(--muted)]">
          Words: {wordsCompleted} / {totalWords}
        </div>

        {/* Status Messages */}
        {status === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center bg-violet-600/10 border border-violet-500/30 rounded-xl p-4"
          >
            <p className="text-violet-400 text-lg font-bold animate-pulse">
              ⌨️ Escribe la primera letra para comenzar...
            </p>
          </motion.div>
        )}

        {/* Time's Up */}
        {status === 'finished' && timeRemaining <= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gradient">⏰ Time's Up!</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-4xl font-bold text-indigo-400">{displayedWpm}</div>
                  <div className="text-[var(--muted)]">WPM</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-violet-400">{displayedAccuracy}%</div>
                  <div className="text-[var(--muted)]">Accuracy</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-amber-400">{maxCombo}</div>
                  <div className="text-[var(--muted)]">Max Combo</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-red-400">{errors}</div>
                  <div className="text-[var(--muted)]">Errors</div>
                </div>
              </div>

              {/* Score Estandarizado */}
              <div className="bg-[var(--secondary)] rounded-lg p-4">
                <div className="text-[var(--muted)] text-sm mb-1">Score Estandarizado</div>
                <div className="text-3xl font-bold text-emerald-400">
                  {displayedScore}
                </div>
                <div className="text-[var(--muted)] text-xs mt-1">
                  ({wordsCompleted} palabras × 100) + (WPM × precisión) - (errores × 10)
                </div>
              </div>

              <div className="text-[var(--muted)]">
                Words completed: {wordsCompleted} / {totalWords}
              </div>

              <div className="flex gap-4 justify-center pt-4 flex-wrap">
                <Button onClick={onGameEnd} variant="primary">
                  Play Again
                </Button>
                <Button onClick={() => onNavigate('ranking')} variant="accent">
                  View Rankings
                </Button>
                <Button onClick={() => onNavigate('home')} variant="secondary">
                  Home
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Game Over - Text Completed */}
        {status === 'finished' && timeRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gradient">🎉 Complete!</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-4xl font-bold text-indigo-400">{displayedWpm}</div>
                  <div className="text-[var(--muted)]">WPM</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-violet-400">{displayedAccuracy}%</div>
                  <div className="text-[var(--muted)]">Accuracy</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-amber-400">{maxCombo}</div>
                  <div className="text-[var(--muted)]">Max Combo</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-red-400">{errors}</div>
                  <div className="text-[var(--muted)]">Errors</div>
                </div>
              </div>

              {/* Score Estandarizado */}
              <div className="bg-[var(--secondary)] rounded-lg p-4">
                <div className="text-[var(--muted)] text-sm mb-1">Score Estandarizado</div>
                <div className="text-3xl font-bold text-emerald-400">
                  {displayedScore}
                </div>
                <div className="text-[var(--muted)] text-xs mt-1">
                  ({wordsCompleted} palabras × 100) + (WPM × precisión) - (errores × 10)
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4 flex-wrap">
                <Button onClick={onGameEnd} variant="primary">
                  Play Again
                </Button>
                <Button onClick={() => onNavigate('ranking')} variant="accent">
                  View Rankings
                </Button>
                <Button onClick={() => onNavigate('home')} variant="secondary">
                  Home
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Instructions */}
        {status === 'playing' && (
          <div className="text-center text-[var(--muted)] text-sm">
            Keep typing! Focus on accuracy over speed. 🔥
          </div>
        )}
      </div>
    </div>
  )
}

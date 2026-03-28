import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, AudioToggle, Confetti } from '../components'
import { useSound } from '../hooks/useSound'
import { selectTapTapWords } from '../data/words'
import { useContentStore } from '../store/contentStore'
import { useGameStore } from '../store/gameStore'
import type { Language, GameLevel } from '../types'
import { t } from '../i18n'

interface TapTapGameProps {
  language: Language
  level: GameLevel
  onBack: () => void
}

interface WordCard {
  id: number
  word: string
  x: number
  y: number
  selected: boolean
  matched: boolean
}

export function TapTapGame({ language, level, onBack }: TapTapGameProps) {
  const ui = useGameStore((s) => s.language)
  const { playKeySound, playErrorSound, playCompleteSound, playVictorySound } = useSound()
  
  const [targetLetter, setTargetLetter] = useState<string>('')
  const [wordCards, setWordCards] = useState<WordCard[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [errors, setErrors] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [showConfetti, setShowConfetti] = useState(false)
  const [wordsMatched, setWordsMatched] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const rememberContentKey = useContentStore((s) => s.rememberKey)
  const buildContentKey = useContentStore((s) => s.buildKey)

  // Generar palabras aleatorias
  const generateWords = useCallback(() => {
    const recentKeys = useContentStore.getState().recentKeys
    const selection = selectTapTapWords(language, level, 'taptap', recentKeys, 12)
    const compositeKey = buildContentKey('taptap', language, level, selection.meta.pool, selection.meta.key)
    rememberContentKey(compositeKey)
    
    const cards: WordCard[] = selection.words.map((word, index) => ({
      id: index,
      word,
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 60 + 20, // 20-80%
      selected: false,
      matched: false,
    }))
    
    setWordCards(cards)
    setTotalWords(cards.length)
    const letters = Array.from(new Set(cards.map((c) => (c.word[0] || '').toLowerCase()).filter(Boolean)))
    if (letters.length > 0) {
      const letter = letters[Math.floor(Math.random() * letters.length)]
      setTargetLetter(letter)
    }
  }, [language, level, rememberContentKey, buildContentKey])

  // Iniciar juego
  const startGame = () => {
    generateWords()
    setGameStatus('playing')
    setScore(0)
    setCombo(0)
    setErrors(0)
    setWordsMatched(0)
    setTimeRemaining(60)
  }

  // Manejar click en palabra
  const handleWordClick = (cardId: number) => {
    if (gameStatus !== 'playing') return

    const card = wordCards.find(c => c.id === cardId)
    if (!card || card.matched) return

    const startsWithLetter = card.word.toLowerCase().startsWith(targetLetter.toLowerCase())

    if (startsWithLetter) {
      // Correcto!
      playKeySound()
      setWordCards(prev => prev.map(c => 
        c.id === cardId ? { ...c, matched: true } : c
      ))
      setScore(prev => prev + 10 + (combo * 2))
      setCombo(prev => {
        const newCombo = prev + 1
        setMaxCombo(max => Math.max(max, newCombo))
        return newCombo
      })
      setWordsMatched(prev => prev + 1)

      // Verificar si todas las palabras fueron encontradas
      const remaining = wordCards.filter(c => c.id !== cardId && !c.matched)
      const matchingRemaining = remaining.filter(c => 
        c.word.toLowerCase().startsWith(targetLetter.toLowerCase())
      )

      if (matchingRemaining.length === 0 || remaining.length === 0) {
        // Nueva ronda
        setTimeout(() => {
          playCompleteSound()
          generateWords()
        }, 500)
      }
    } else {
      // Incorrecto!
      playErrorSound()
      setErrors(prev => prev + 1)
      setCombo(0)
      
      // Feedback visual de error
      setWordCards(prev => prev.map(c => 
        c.id === cardId ? { ...c, selected: true } : c
      ))
      setTimeout(() => {
        setWordCards(prev => prev.map(c => 
          c.id === cardId ? { ...c, selected: false } : c
        ))
      }, 300)
    }
  }

  // Timer del juego
  useEffect(() => {
    if (gameStatus !== 'playing') return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameStatus('finished')
          setShowConfetti(true)
          playVictorySound()
          setTimeout(() => setShowConfetti(false), 4000)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStatus, playVictorySound])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <Confetti isActive={showConfetti} />
      <AudioToggle position="top-right" compact={false} />
      
      {/* Header — compact for mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <Button onClick={onBack} variant="secondary" className="text-xs px-3 py-1.5">
            ← {t(ui, 'taptap.back')}
          </Button>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 rounded-full text-xs">
              {language === 'en' ? '🇬🇧' : '🇪🇸'}
            </span>
            <span className="px-2 py-0.5 bg-violet-600/20 text-violet-400 rounded-full text-xs">
              Lv.{level}
            </span>
          </div>
        </div>

        {/* Stats Bar — single row compact */}
        <div className="flex items-center justify-between glass px-3 py-2 rounded-xl gap-2">
          <div className="text-center flex-1">
            <div className={`text-lg font-bold ${timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-violet-400'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="text-center flex-1 border-x border-white/10">
            <div className="text-lg font-bold text-amber-400">{wordsMatched}/{totalWords}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-lg font-bold text-emerald-400">x{combo}</div>
          </div>
          <div className="text-center flex-1 border-x border-white/10">
            <div className="text-lg font-bold text-indigo-400">{score}</div>
          </div>
        </div>
      </div>

      {/* Área de Juego */}
      {gameStatus === 'playing' && (
        <>
          {/* Letra Objetivo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed left-1/2 -translate-x-1/2 z-40"
            style={{ top: 'max(12rem, calc(80px + 1rem))' }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-4 border-white/20">
              <span className="text-4xl md:text-5xl font-black text-white">{targetLetter.toUpperCase()}</span>
            </div>
            <div className="text-center mt-1 text-[var(--foreground)] font-bold text-xs bg-[var(--glass-bg)] px-3 py-0.5 rounded-full">
              {t(ui, 'taptap.targetLetter')}
            </div>
          </motion.div>

          {/* Tarjetas de Palabras — compact mobile layout */}
          <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-36 overflow-y-auto">
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <AnimatePresence>
                {wordCards.map((card) => (
                  !card.matched && (
                    <motion.div
                      key={card.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleWordClick(card.id)}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center
                        cursor-pointer select-none touch-manipulation
                        transition-all duration-200
                        ${card.selected
                          ? 'bg-red-500/50 border-red-500 scale-95'
                          : 'bg-gradient-to-br from-indigo-600/90 to-purple-600/90 border-white/20'
                        }
                        border-2 backdrop-blur-sm shadow-xl active:brightness-110
                      `}
                    >
                      <span className="text-white font-bold text-center px-1 text-sm md:text-base leading-tight">
                        {card.word}
                      </span>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}

      {/* Pantalla de Inicio */}
      {gameStatus === 'idle' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full backdrop-blur-xl p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">👆</div>
              <h1 className="text-4xl font-black text-gradient">
                {t(ui, 'taptap.title')} {language === 'en' ? 'English' : 'Español'}
              </h1>
              <p className="text-[var(--muted)]">
                {t(ui, 'taptap.targetLetter')}
              </p>
            </div>

            <div className="space-y-3 bg-[var(--secondary)] rounded-xl p-4">
              <div className="flex items-center gap-3 text-[var(--foreground)]">
                <span className="text-2xl">🎯</span>
                <span className="text-sm">{t(ui, 'taptap.instruction1')}</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--foreground)]">
                <span className="text-2xl">⏱️</span>
                <span className="text-sm">{t(ui, 'taptap.instruction2')}</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--foreground)]">
                <span className="text-2xl">🔥</span>
                <span className="text-sm">{t(ui, 'taptap.instruction3')}</span>
              </div>
            </div>

            <Button onClick={startGame} variant="accent" className="w-full py-4 text-lg font-bold">
              {t(ui, 'taptap.playNow')}
            </Button>
          </Card>
        </div>
      )}

      {/* Game Over */}
      {gameStatus === 'finished' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full backdrop-blur-xl p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-bold text-gradient">{t(ui, 'taptap.gameOver')}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[var(--secondary)] rounded-xl">
                <div className="text-4xl font-bold text-indigo-400">{score}</div>
                <div className="text-[var(--muted)] text-sm">{t(ui, 'taptap.points')}</div>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-xl">
                <div className="text-4xl font-bold text-amber-400">{wordsMatched}</div>
                <div className="text-[var(--muted)] text-sm">{t(ui, 'taptap.words')}</div>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-xl">
                <div className="text-4xl font-bold text-emerald-400">x{maxCombo}</div>
                <div className="text-[var(--muted)] text-sm">{t(ui, 'taptap.maxCombo')}</div>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-xl">
                <div className="text-4xl font-bold text-red-400">{errors}</div>
                <div className="text-[var(--muted)] text-sm">{t(ui, 'taptap.errors')}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={startGame} variant="accent" className="flex-1">
                {t(ui, 'taptap.playAgain')}
              </Button>
              <Button onClick={onBack} variant="secondary" className="flex-1">
                {t(ui, 'taptap.mainMenu')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

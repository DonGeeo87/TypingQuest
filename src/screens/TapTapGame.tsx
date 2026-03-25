import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, AudioToggle, Confetti } from '../components'
import { useSound } from '../hooks/useSound'
import { getWordsForLevel } from '../data/words'
import type { Language, GameLevel } from '../types'

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

  // Generar palabras aleatorias
  const generateWords = useCallback(() => {
    const words = getWordsForLevel(language, level)
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 12)
    
    const cards: WordCard[] = shuffled.map((word, index) => ({
      id: index,
      word,
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 60 + 20, // 20-80%
      selected: false,
      matched: false,
    }))
    
    setWordCards(cards)
    setTotalWords(cards.length)
  }, [language, level])

  // Seleccionar letra objetivo
  const selectTargetLetter = useCallback(() => {
    const alphabet = language === 'en' 
      ? 'abcdefghijklmnopqrstuvwxyz'
      : 'abcdefghijklmnñopqrstuvwxyz'
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)]
    setTargetLetter(letter)
  }, [language])

  // Iniciar juego
  const startGame = () => {
    generateWords()
    selectTargetLetter()
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
          selectTargetLetter()
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
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 p-4 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={onBack} variant="secondary" className="text-sm px-4 py-2">
              ← Volver
            </Button>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm">
                {language === 'en' ? '🇬🇧 English' : '🇪🇸 Español'}
              </span>
              <span className="px-3 py-1 bg-violet-600/20 text-violet-400 rounded-full text-sm">
                Nivel {level}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 glass p-3 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400">{score}</div>
              <div className="text-xs text-[var(--muted)]">Puntos</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-violet-400'}`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-[var(--muted)]">Tiempo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{wordsMatched}/{totalWords}</div>
              <div className="text-xs text-[var(--muted)]">Palabras</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">x{combo}</div>
              <div className="text-xs text-[var(--muted)]">Combo</div>
            </div>
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
            className="fixed top-40 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-4 border-white/20">
              <span className="text-5xl font-black text-white">{targetLetter.toUpperCase()}</span>
            </div>
            <div className="text-center mt-2 text-[var(--foreground)] font-bold text-sm bg-[var(--glass-bg)] px-4 py-1 rounded-full">
              Busca palabras con esta letra
            </div>
          </motion.div>

          {/* Tarjetas de Palabras */}
          <div className="absolute inset-0 pt-80 pb-20 px-4 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <AnimatePresence>
                  {wordCards.map((card) => (
                    !card.matched && (
                      <motion.div
                        key={card.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleWordClick(card.id)}
                        className={`
                          aspect-square rounded-2xl flex items-center justify-center
                          cursor-pointer select-none touch-manipulation
                          transition-all duration-200
                          ${card.selected 
                            ? 'bg-red-500/50 border-red-500 scale-95' 
                            : 'bg-gradient-to-br from-indigo-600/80 to-purple-600/80 border-white/20 hover:border-white/40'
                          }
                          border-2 backdrop-blur-sm shadow-xl
                        `}
                      >
                        <span className="text-white font-bold text-center px-2 text-sm md:text-base">
                          {card.word}
                        </span>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
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
                TapTap {language === 'en' ? 'English' : 'Español'}
              </h1>
              <p className="text-[var(--muted)]">
                ¡Toca las palabras que comienzan con la letra mostrada!
              </p>
            </div>

            <div className="space-y-3 bg-[var(--secondary)] rounded-xl p-4">
              <div className="flex items-center gap-3 text-[var(--foreground)]">
                <span className="text-2xl">🎯</span>
                <span className="text-sm">Busca palabras con la letra objetivo</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--foreground)]">
                <span className="text-2xl">⏱️</span>
                <span className="text-sm">Tienes 60 segundos</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--foreground)]">
                <span className="text-2xl">🔥</span>
                <span className="text-sm">Acumula combo para más puntos</span>
              </div>
            </div>

            <Button onClick={startGame} variant="accent" className="w-full py-4 text-lg font-bold">
              ¡Jugar Ahora!
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
              <h2 className="text-3xl font-bold text-gradient">¡Tiempo Terminado!</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[var(--secondary)] rounded-xl">
                <div className="text-4xl font-bold text-indigo-400">{score}</div>
                <div className="text-[var(--muted)] text-sm">Puntos</div>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-xl">
                <div className="text-4xl font-bold text-amber-400">{wordsMatched}</div>
                <div className="text-[var(--muted)] text-sm">Palabras</div>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-xl">
                <div className="text-4xl font-bold text-emerald-400">x{maxCombo}</div>
                <div className="text-[var(--muted)] text-sm">Max Combo</div>
              </div>
              <div className="text-center p-4 bg-[var(--secondary)] rounded-xl">
                <div className="text-4xl font-bold text-red-400">{errors}</div>
                <div className="text-[var(--muted)] text-sm">Errores</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={startGame} variant="accent" className="flex-1">
                Jugar de Nuevo
              </Button>
              <Button onClick={onBack} variant="secondary" className="flex-1">
                Menú Principal
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

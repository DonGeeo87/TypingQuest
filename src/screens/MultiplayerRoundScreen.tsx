import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, TypingArea } from '../components'
import { useMobile } from '../hooks/useMobile'

export interface MultiplayerRoundResult {
  wpm: number
  accuracy: number
  errors: number
  wordsCompleted: number
}

interface MultiplayerRoundScreenProps {
  prompt: string
  durationSeconds: number
  onComplete: (result: MultiplayerRoundResult) => void
  onBack: () => void
}

export function MultiplayerRoundScreen({ prompt, durationSeconds, onComplete, onBack }: MultiplayerRoundScreenProps) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'finished'>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedChars, setTypedChars] = useState<string[]>([])
  const [errors, setErrors] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [mobileInputValue, setMobileInputValue] = useState('')

  const isMobile = useMobile()
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const expectedChar = prompt[currentIndex]

  const correctChars = useMemo(() => {
    let correct = 0
    for (let i = 0; i < typedChars.length; i++) {
      if (typedChars[i] === prompt[i]) correct++
    }
    return correct
  }, [typedChars, prompt])

  const totalTypedChars = typedChars.length

  const wordsCompleted = useMemo(() => {
    const textUpToIndex = prompt.substring(0, currentIndex)
    return textUpToIndex.trim().split(/\s+/).filter(w => w.length > 0).length
  }, [prompt, currentIndex])

  const finish = useCallback(() => {
    if (status === 'finished') return
    setStatus('finished')

    const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : durationSeconds
    const minutes = Math.max(elapsedSeconds / 60, 1 / 60)
    const wpm = Math.round((correctChars / 5) / minutes)
    const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 10000) / 100 : 0

    onComplete({
      wpm,
      accuracy,
      errors,
      wordsCompleted,
    })
  }, [status, startTime, durationSeconds, correctChars, totalTypedChars, onComplete, errors, wordsCompleted])

  useEffect(() => {
    if (status !== 'playing') return
    if (timeRemaining <= 0) {
      finish()
      return
    }

    const id = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [status, timeRemaining, finish])

  const processKey = useCallback((key: string) => {
    if (status === 'finished') return

    if (status === 'idle') {
      setStatus('playing')
      setStartTime(Date.now())
      setTimeRemaining(durationSeconds)
    }

    if (status !== 'playing') return

    if (key === 'Backspace') {
      if (currentIndex <= 0) return
      setCurrentIndex(currentIndex - 1)
      setTypedChars(prev => prev.slice(0, -1))
      return
    }

    if (key.length > 1 && key !== ' ') return

    const isCorrect = key === expectedChar

    setTypedChars(prev => [...prev, key])
    setCurrentIndex(currentIndex + 1)

    if (!isCorrect) {
      setErrors(prev => prev + 1)
    }

    if (currentIndex + 1 >= prompt.length) {
      finish()
    }
  }, [status, durationSeconds, currentIndex, expectedChar, prompt.length, finish])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      processKey(e.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [processKey])

  useEffect(() => {
    if (!isMobile) return
    if (status === 'finished') return
    window.setTimeout(() => {
      mobileInputRef.current?.focus()
    }, 0)
  }, [isMobile, status])

  const handleMobileChange = useCallback((value: string) => {
    if (!value) return
    for (const ch of value) processKey(ch)
    setMobileInputValue('')
  }, [processKey])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={onBack}>Volver</Button>
          <div className="text-[var(--muted)] font-semibold">
            {status === 'finished' ? 'Finalizado' : status === 'playing' ? 'En curso' : 'Listo'}
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[var(--muted)]">Tiempo</div>
            <motion.div
              key={timeRemaining}
              initial={{ scale: 1.05, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[var(--foreground)] text-2xl font-bold tabular-nums"
            >
              {timeRemaining}s
            </motion.div>
          </div>

          <div
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
              text={prompt}
              currentIndex={currentIndex}
              typedChars={typedChars}
              isPlaying={status !== 'finished'}
              timeRemaining={timeRemaining}
            />
          </div>
        </Card>

        {status === 'finished' && (
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[var(--muted)] text-sm">WPM</div>
                <div className="text-[var(--foreground)] font-bold text-xl">
                  {Math.round((correctChars / 5) / Math.max(((startTime ? (Date.now() - startTime) / 1000 : durationSeconds) / 60), 1 / 60))}
                </div>
              </div>
              <div>
                <div className="text-[var(--muted)] text-sm">Precisión</div>
                <div className="text-[var(--foreground)] font-bold text-xl">{totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 0}%</div>
              </div>
              <div>
                <div className="text-[var(--muted)] text-sm">Errores</div>
                <div className="text-[var(--foreground)] font-bold text-xl">{errors}</div>
              </div>
              <div>
                <div className="text-[var(--muted)] text-sm">Palabras</div>
                <div className="text-[var(--foreground)] font-bold text-xl">{wordsCompleted}</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

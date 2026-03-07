import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const RANDOM_WORDS = [
    'typing', 'quest', 'speed', 'accuracy', 'focus', 'flow', 'perfect', 'combo',
    'master', 'pixel', 'avatar', 'rank', 'expert', 'legend', 'hero', 'swift',
    'keyboard', 'code', 'data', 'logic', 'system', 'react', 'vite', 'web',
    'challenge', 'victory', 'score', 'player', 'multiplayer', 'tourney'
]

interface FloatingWord {
    id: number
    text: string
    x: number
    y: number
    size: number
    duration: number
    delay: number
}

// Sub-componente para el efecto de tipeo
function TypedWord({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState('')

    useEffect(() => {
        let current = ''
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                if (current.length < text.length) {
                    current = text.slice(0, current.length + 1)
                    setDisplayText(current)
                } else {
                    clearInterval(interval)
                }
            }, 100)
            return () => clearInterval(interval)
        }, Math.random() * 2000)

        return () => clearTimeout(timeout)
    }, [text])

    return <span>{displayText}</span>
}

export function FloatingWords() {
    const [words, setWords] = useState<FloatingWord[]>([])

    useEffect(() => {
        const initialWords = Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            text: RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)],
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * (1.2 - 0.7) + 0.7,
            duration: Math.random() * (30 - 15) + 15,
            delay: Math.random() * 5
        }))
        setWords(initialWords)

        // Ciclo de reemplazo para mantener el fondo vivo
        const interval = setInterval(() => {
            setWords(prev => {
                const newWords = [...prev]
                const indexToReplace = Math.floor(Math.random() * newWords.length)
                newWords[indexToReplace] = {
                    id: Date.now(),
                    text: RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)],
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * (1.2 - 0.7) + 0.7,
                    duration: Math.random() * (30 - 15) + 15,
                    delay: 0
                }
                return newWords
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0 select-none">
            <AnimatePresence>
                {words.map((word) => (
                    <motion.div
                        key={word.id}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            y: '-10vh',
                            x: `${word.x}vw`
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: word.duration,
                            delay: word.delay,
                            ease: "linear",
                            repeat: Infinity
                        }}
                        className="absolute text-indigo-500 font-mono tracking-widest whitespace-nowrap"
                        style={{
                            fontSize: `${word.size}rem`,
                            top: `${word.y}vh`,
                            left: 0,
                            textShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
                        }}
                    >
                        <TypedWord text={word.text} />
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="inline-block w-2 bg-indigo-500 ml-1 h-[1em] translate-y-1"
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface DynamicBackgroundProps {
    isError: boolean
    combo: number
    status: string
}

export function DynamicBackground({ isError, combo, status }: DynamicBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<{ x: number, y: number, size: number, speedX: number, speedY: number, hue: number }[]>([])
    const comboRef = useRef(combo)
    comboRef.current = combo

    // Inicializar partículas ambientales - REDUCIDO de 40 a 25 para mejor rendimiento
    useEffect(() => {
        particlesRef.current = Array.from({ length: 25 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.4 - 0.2,
            speedY: Math.random() * 0.4 - 0.2,
            hue: 200 + Math.random() * 100
        }))
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const characters = '01<>/{}[]#$*+'
        const fontSize = 16
        const columns = Math.ceil(canvas.width / fontSize)
        const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * 50)

        let animationId: number
        let frameCount = 0

        const draw = () => {
            frameCount++
            
            // Limpiar con menos frecuencia para mejor rendimiento
            const isLight = document.documentElement.dataset.theme === 'light'
            ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.35)' : 'rgba(10, 10, 15, 0.25)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Partículas sutiles - actualizar siempre pero con cálculo simplificado
            const comboMultiplier = 1 + Math.min(comboRef.current / 30, 2) // Cap en 3x
            particlesRef.current.forEach(p => {
                ctx.fillStyle = isLight
                  ? `hsla(${p.hue}, 70%, 35%, 0.12)`
                  : `hsla(${p.hue}, 70%, 70%, 0.15)`
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
                p.x += p.speedX * comboMultiplier
                p.y += p.speedY * comboMultiplier
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0
            })

            // Matrix rain - solo actualizar cada 2 frames para mejor rendimiento
            if (status === 'playing' && frameCount % 2 === 0) {
                const hue = Math.min(300, 220 + comboRef.current * 1.5)
                ctx.fillStyle = isLight
                  ? `hsla(${hue}, 80%, 30%, 0.10)`
                  : `hsla(${hue}, 80%, 60%, 0.15)`
                ctx.font = `bold ${fontSize}px monospace`

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length))
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize)
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
                        drops[i] = 0
                    }
                    drops[i] += (0.5 + Math.random() * 0.5) * (1 + Math.min(comboRef.current / 20, 3))
                }
            }

            animationId = requestAnimationFrame(draw)
        }

        draw()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)
        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', handleResize)
        }
    }, [status]) // Eliminado combo de las dependencias

    // Intensidad del brillo central basado en el combo - con cap para rendimiento
    const glowOpacity = Math.min(0.3, combo / 60)
    const glowScale = 1 + Math.min(0.3, combo / 150)

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--background)]">
            {/* Capa de Canvas para la Lluvia de Código */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 opacity-40"
            />

            {/* Resplandor de bordes para combos altos - simplificado */}
            {combo >= 10 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: Math.min(0.4, (combo - 10) / 50),
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        boxShadow: `inset 0 0 ${Math.min(80, combo)}px hsla(${220 + Math.min(combo, 100)}, 70%, 50%, 0.3)`
                    }}
                />
            )}

            {/* Brillo Central que pulsa con el combo - simplificado */}
            <motion.div
                animate={{
                    scale: glowScale,
                    opacity: glowOpacity,
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <div
                    className="w-[600px] h-[600px] rounded-full blur-[100px]"
                    style={{
                        background: `radial-gradient(circle, hsla(${220 + Math.min(combo, 100)}, 70%, 50%, 0.3) 0%, transparent 70%)`
                    }}
                />
            </motion.div>

            {/* Flash de Error (Vignette roja) */}
            <AnimatePresence>
                {isError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 ring-[40px] ring-red-500/30 inset-shadow-red-500/20 blur-xl"
                    />
                )}
            </AnimatePresence>

            {/* Elementos SVG decorativos flotantes - siempre visibles pero sutiles */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
                <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-96 h-96 text-indigo-500"
                    viewBox="0 0 100 100"
                >
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 10" />
                    <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </motion.svg>
                <motion.svg
                    animate={{ rotate: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -right-40 w-[500px] h-[500px] text-violet-500"
                    viewBox="0 0 100 100"
                >
                    <path d="M10,50 Q50,10 90,50 T10,50" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </motion.svg>
            </div>

            {/* Grid sutil de fondo */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.18) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    )
}

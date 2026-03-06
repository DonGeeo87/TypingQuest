import { useCallback, useRef, useEffect } from 'react'
import { useAudioStore } from '../store/audioStore'

/**
 * Hook personalizado para manejar efectos de sonido usando Audio API con osciladores
 * No requiere archivos externos, todos los sonidos se generan sintéticamente
 */
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const { enabled, volume, muted } = useAudioStore()

  // Inicializar AudioContext (se crea bajo demanda para evitar problemas con autoplay policies)
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  // Limpiar AudioContext al desmontar
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  /**
   * Reproduce un tono simple con oscilador
   */
  const playTone = useCallback((
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volumeMultiplier = 1
  ) => {
    if (!enabled || muted) return

    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // Envolvente de volumen (ADSR simplificado)
    const actualVolume = volume * volumeMultiplier
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(actualVolume, ctx.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(actualVolume * 0.5, ctx.currentTime + duration * 0.5)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [enabled, muted, volume, getAudioContext])

  /**
   * Sonido de tecla correcta - click suave y corto
   */
  const playKeySound = useCallback(() => {
    // Tono alto y corto tipo "click"
    playTone(800, 0.05, 'sine', 0.3)
  }, [playTone])

  /**
   * Sonido de error - buzz corto y grave
   */
  const playErrorSound = useCallback(() => {
    if (!enabled || muted) return

    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sawtooth'
    
    // Frecuencia que baja rápidamente (efecto de error)
    oscillator.frequency.setValueAtTime(150, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2)

    // Envolvente de volumen
    const actualVolume = volume * 0.4
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(actualVolume, ctx.currentTime + 0.02)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }, [enabled, muted, volume, getAudioContext])

  /**
   * Sonido de palabra completada - ding brillante
   */
  const playCompleteSound = useCallback(() => {
    if (!enabled || muted) return

    const ctx = getAudioContext()
    
    // Crear acorde brillante con múltiples frecuencias
    const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5 (acorde mayor)
    
    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime)

      // Envolvente de volumen con delay escalonado
      const actualVolume = volume * 0.3
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(actualVolume, ctx.currentTime + 0.02 + index * 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.4)
    })
  }, [enabled, muted, volume, getAudioContext])

  /**
   * Sonido de juego completado - fanfarria victoriosa
   */
  const playVictorySound = useCallback(() => {
    if (!enabled || muted) return

    const ctx = getAudioContext()
    
    // Secuencia de notas victoriosas (arpegio ascendente)
    const notes = [
      { freq: 523.25, time: 0 },      // C5
      { freq: 659.25, time: 0.1 },    // E5
      { freq: 783.99, time: 0.2 },    // G5
      { freq: 1046.50, time: 0.3 },   // C6
      { freq: 1318.51, time: 0.4 },   // E6
      { freq: 1567.98, time: 0.5 },   // G6
      { freq: 2093.00, time: 0.6 },   // C7 (nota final alta)
    ]

    notes.forEach((note) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)

      // Envolvente de volumen
      const actualVolume = volume * 0.4
      const noteStartTime = ctx.currentTime + note.time
      gainNode.gain.setValueAtTime(0, noteStartTime)
      gainNode.gain.linearRampToValueAtTime(actualVolume, noteStartTime + 0.03)
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteStartTime + 0.3)

      oscillator.start(noteStartTime)
      oscillator.stop(noteStartTime + 0.3)
    })

    // Agregar un "boom" final grave
    const boomOscillator = ctx.createOscillator()
    const boomGain = ctx.createGain()
    
    boomOscillator.connect(boomGain)
    boomGain.connect(ctx.destination)
    
    boomOscillator.type = 'sine'
    boomOscillator.frequency.setValueAtTime(100, ctx.currentTime + 0.6)
    boomOscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 1)
    
    const boomVolume = volume * 0.5
    boomGain.gain.setValueAtTime(0, ctx.currentTime + 0.6)
    boomGain.gain.linearRampToValueAtTime(boomVolume, ctx.currentTime + 0.65)
    boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
    
    boomOscillator.start(ctx.currentTime + 0.6)
    boomOscillator.stop(ctx.currentTime + 1)
  }, [enabled, muted, volume, getAudioContext])

  /**
   * Sonido de tiempo agotándose - beep de advertencia
   */
  const playTimeWarning = useCallback(() => {
    // Dos beeps rápidos y urgentes
    playTone(1000, 0.1, 'square', 0.2)
    setTimeout(() => {
      playTone(1000, 0.1, 'square', 0.2)
    }, 150)
  }, [playTone])

  /**
   * Sonido de nivel alcanzado - fanfarria épica
   */
  const playLevelUpSound = useCallback(() => {
    if (!enabled || muted) return

    const ctx = getAudioContext()

    // Secuencia épica de level up (notas ascendentes con efecto de poder)
    const notes = [
      { freq: 440, time: 0 },         // A4
      { freq: 554.37, time: 0.1 },    // C#5
      { freq: 659.25, time: 0.2 },    // E5
      { freq: 880, time: 0.3 },       // A5
      { freq: 1108.73, time: 0.4 },   // C#6
      { freq: 1318.51, time: 0.5 },   // E6
    ]

    notes.forEach((note, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = index % 2 === 0 ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)

      // Envolvente de volumen
      const actualVolume = volume * 0.35
      const noteStartTime = ctx.currentTime + note.time
      gainNode.gain.setValueAtTime(0, noteStartTime)
      gainNode.gain.linearRampToValueAtTime(actualVolume, noteStartTime + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteStartTime + 0.25)

      oscillator.start(noteStartTime)
      oscillator.stop(noteStartTime + 0.25)
    })

    // Agregar efecto de "power up" final
    const powerOscillator = ctx.createOscillator()
    const powerGain = ctx.createGain()

    powerOscillator.connect(powerGain)
    powerGain.connect(ctx.destination)

    powerOscillator.type = 'sawtooth'
    powerOscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.5)
    powerOscillator.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.8)

    const powerVolume = volume * 0.25
    powerGain.gain.setValueAtTime(0, ctx.currentTime + 0.5)
    powerGain.gain.linearRampToValueAtTime(powerVolume, ctx.currentTime + 0.55)
    powerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)

    powerOscillator.start(ctx.currentTime + 0.5)
    powerOscillator.stop(ctx.currentTime + 0.8)
  }, [enabled, muted, volume, getAudioContext])

  return {
    playKeySound,
    playErrorSound,
    playCompleteSound,
    playVictorySound,
    playTimeWarning,
    playLevelUpSound,
  }
}

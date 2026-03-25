import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, AvatarSelector } from '../components'
import { checkUsernameAvailable, updateProfile } from '../services/supabaseService'
import { getCurrentUser } from '../lib/supabase'
import { log } from '../utils/logger'

interface RegistrationScreenProps {
  onComplete: () => void
  onBack?: () => void
}

export function RegistrationScreen({ onComplete, onBack }: RegistrationScreenProps) {
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1) // 1: Avatar, 2: Nickname

  // Validación del username en tiempo real
  const validateUsername = (value: string): string | null => {
    if (value.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres'
    }
    if (value.length > 20) {
      return 'El nombre debe tener máximo 20 caracteres'
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Solo se permiten letras, números y guiones bajos'
    }
    return null
  }

  const validationError = validateUsername(username)

  // Efecto para verificar disponibilidad cuando el username es válido
  useEffect(() => {
    const checkAvailability = async () => {
      if (!validationError && username.length >= 3) {
        setIsValidating(true)
        setIsAvailable(null)

        // Debounce de 500ms
        const timeoutId = setTimeout(async () => {
          try {
            const available = await checkUsernameAvailable(username)
            setIsAvailable(available)
            if (!available) {
              setError('Este nombre de usuario ya está en uso')
            } else {
              setError(null)
            }
          } catch (err) {
            log.error('Error checking username:', err)
            setError('Error al verificar disponibilidad')
          } finally {
            setIsValidating(false)
          }
        }, 500)

        return () => clearTimeout(timeoutId)
      } else {
        setIsAvailable(null)
        if (username.length > 0) {
          setError(validationError)
        }
      }
    }

    checkAvailability()
  }, [username, validationError])

  const handleSave = async () => {
    if (step === 1) {
      if (!avatarUrl) {
        setError('Por favor elige un avatar')
        return
      }
      setStep(2)
      setError(null)
      return
    }

    const validationErr = validateUsername(username)
    if (validationErr) {
      setError(validationErr)
      return
    }

    if (isAvailable === false) {
      setError('Este nombre de usuario ya está en uso')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const userId = await getCurrentUser()
      if (!userId) {
        setError('Error: No hay usuario autenticado')
        setIsSaving(false)
        return
      }

      await updateProfile(userId, {
        username: username.trim(),
        avatar_url: avatarUrl || undefined,
        updated_at: new Date().toISOString()
      })
      onComplete()
    } catch (err) {
      log.error('Error saving profile:', err)
      setError('Error al guardar el perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const isFormValid = step === 1
    ? avatarUrl !== null
    : !validationError && isAvailable === true && username.trim().length > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header del Juego Animado */}
        <div className="text-center space-y-2 mb-12">
          <motion.h1
            initial={{ scale: 0.8, filter: 'blur(10px)', opacity: 0 }}
            animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="text-6xl md:text-8xl font-black text-gradient tracking-tighter"
          >
            TypingQuest
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-zinc-500 font-medium italic tracking-widest"
          >
            INSERT COIN TO START 🕹️
          </motion.p>
        </div>

        <Card className="space-y-6 bg-zinc-900/80 backdrop-blur-xl border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              key={step === 1 ? 'avatar-icon' : 'user-icon'}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              {step === 1 ? '🎨' : '👤'}
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient">
              {step === 1 ? 'Elige tu Avatar' : 'Tu Apodo'}
            </h1>
            <p className="text-zinc-400">
              {step === 1
                ? 'Personaliza tu presencia en el ranking'
                : '¿Cómo quieres que te llamen en TypingQuest?'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <AvatarSelector
                  selectedAvatar={avatarUrl}
                  onSelect={(url) => {
                    setAvatarUrl(url)
                    setError(null)
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Input de Username */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ej: TypingMaster"
                      maxLength={20}
                      autoComplete="off"
                      autoFocus
                      className={`
                        w-full px-4 py-3 bg-zinc-900/50 border-2 rounded-lg
                        text-white placeholder-zinc-500
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900
                        transition-all duration-200
                        ${validationError || isAvailable === false
                          ? 'border-red-500 focus:ring-red-500'
                          : isAvailable === true
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-zinc-700 focus:ring-indigo-500'
                        }
                      `}
                    />

                    {/* Indicador de validación */}
                    <AnimatePresence>
                      {isValidating && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>{username.length}/20 caracteres</span>
                    <span>3-20 caracteres, alfanumérico</span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/50 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-zinc-300">Resumen de perfil:</p>
                  <div className="flex items-center gap-4">
                    <img src={avatarUrl!} alt="Avatar" className="w-12 h-12 rounded-lg bg-zinc-700" />
                    <div>
                      <p className="text-white font-bold">{username || '...'}</p>
                      <p className="text-xs text-zinc-500">Nivel 1 • Jugador Novato</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensajes de error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            {step === 2 && (
              <Button
                onClick={() => setStep(1)}
                variant="secondary"
                className="flex-1"
                disabled={isSaving}
              >
                Atrás
              </Button>
            )}
            {step === 1 && onBack && (
              <Button
                onClick={onBack}
                variant="secondary"
                className="flex-1"
                disabled={isSaving}
              >
                Volver
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              className="flex-[2]"
              variant="accent"
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </span>
              ) : (
                step === 1 ? 'Siguiente' : '¡Empezar Aventura!'
              )}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-zinc-500">
            Podrás cambiar tu nombre y avatar más tarde en tu perfil
          </p>
        </Card>
      </div>
    </div>
  )
}

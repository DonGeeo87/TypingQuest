import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components'
import { checkUsernameAvailable, updateUsername } from '../services/supabaseService'
import { getCurrentUser } from '../lib/supabase'

interface RegistrationScreenProps {
  onComplete: () => void
}

export function RegistrationScreen({ onComplete }: RegistrationScreenProps) {
  const [username, setUsername] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
            console.error('Error checking username:', err)
            setError('Error al verificar disponibilidad')
          } finally {
            setIsValidating(false)
          }
        }, 500)

        return () => clearTimeout(timeoutId)
      } else {
        setIsAvailable(null)
        setError(validationError)
      }
    }

    checkAvailability()
  }, [username, validationError])

  const handleSave = async () => {
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

      await updateUsername(userId, username.trim())
      onComplete()
    } catch (err) {
      console.error('Error saving username:', err)
      setError('Error al guardar el nombre de usuario')
    } finally {
      setIsSaving(false)
    }
  }

  const isFormValid = !validationError && isAvailable === true && username.trim().length > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              👤
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient">
              ¡Bienvenido a TypingQuest!
            </h1>
            <p className="text-zinc-400">
              Elige un nombre de usuario para comenzar tu aventura
            </p>
          </div>

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
                autoCapitalize="off"
                spellCheck={false}
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
                
                {isAvailable === true && !isValidating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
                
                {isAvailable === false && !isValidating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contador de caracteres */}
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{username.length}/20 caracteres</span>
              <span>3-20 caracteres, alfanumérico</span>
            </div>
          </div>

          {/* Mensajes de error/éxito */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-lg text-sm ${
                  isAvailable === false || validationError
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                }`}
              >
                {error}
              </motion.div>
            )}

            {isAvailable === true && !error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 rounded-lg text-sm bg-green-500/10 border border-green-500/30 text-green-400"
              >
                ✓ ¡Nombre disponible!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reglas */}
          <div className="p-4 bg-zinc-800/50 rounded-lg space-y-2">
            <p className="text-sm font-medium text-zinc-300">El nombre debe:</p>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  username.length >= 3 ? 'bg-green-500 text-white' : 'bg-zinc-700'
                }`}>
                  {username.length >= 3 ? '✓' : ''}
                </span>
                Tener al menos 3 caracteres
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  username.length <= 20 ? 'bg-green-500 text-white' : 'bg-zinc-700'
                }`}>
                  {username.length <= 20 ? '✓' : ''}
                </span>
                Tener máximo 20 caracteres
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  /^[a-zA-Z0-9_]*$/.test(username) ? 'bg-green-500 text-white' : 'bg-zinc-700'
                }`}>
                  {/^[a-zA-Z0-9_]*$/.test(username) ? '✓' : ''}
                </span>
                Contener solo letras, números y guiones bajos
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isAvailable === true ? 'bg-green-500 text-white' : 'bg-zinc-700'
                }`}>
                  {isAvailable === true ? '✓' : ''}
                </span>
                Estar disponible
              </li>
            </ul>
          </div>

          {/* Botón de guardar */}
          <Button
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            className="w-full"
            variant="accent"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              'Guardar y Continuar'
            )}
          </Button>

          {/* Footer */}
          <p className="text-xs text-center text-zinc-500">
            Podrás cambiar tu nombre de usuario más tarde en la configuración
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components'
import { signInWithEmailMagicLink } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

interface AuthScreenProps {
  onContinue: () => void
}

export function AuthScreen({ onContinue }: AuthScreenProps) {
  const { signInAnonymously } = useAuthStore()
  const [email, setEmail] = useState('')
  const [loadingAnon, setLoadingAnon] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = useMemo(() => window.location.origin, [])

  const handleAnonymous = useCallback(async () => {
    setError(null)
    setLoadingAnon(true)
    try {
      await signInAnonymously()
      onContinue()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar en modo anónimo')
    } finally {
      setLoadingAnon(false)
    }
  }, [signInAnonymously, onContinue])

  const handleEmail = useCallback(async () => {
    const clean = email.trim().toLowerCase()
    if (!clean || !clean.includes('@')) {
      setError('Ingresa un email válido.')
      return
    }

    setError(null)
    setLoadingEmail(true)
    try {
      await signInWithEmailMagicLink(clean, redirectTo)
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar el enlace')
    } finally {
      setLoadingEmail(false)
    }
  }, [email, redirectTo])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight"
          >
            Bienvenido a TypingQuest
          </motion.h1>
          <p className="text-[var(--muted)]">
            Puedes jugar anónimo o crear una cuenta en segundos para recuperar tu progreso.
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-[var(--foreground)] text-lg font-bold">Jugar anónimo</h2>
              <p className="text-[var(--muted)] text-sm mt-1">
                Rápido, sin registro. Te avisaremos que no podrás recuperar el avance si cambias de dispositivo o limpias datos.
              </p>
            </div>
            <Button onClick={handleAnonymous} disabled={loadingAnon}>
              {loadingAnon ? 'Entrando…' : 'Continuar anónimo'}
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-[var(--foreground)] text-lg font-bold">Crear cuenta / Iniciar sesión</h2>
              <p className="text-[var(--muted)] text-sm mt-1">
                Te enviamos un enlace mágico al email. Si ya tienes cuenta, recuperas tu perfil.
              </p>
            </div>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
            />

            <Button onClick={handleEmail} disabled={loadingEmail || sent}>
              {sent ? 'Enlace enviado' : loadingEmail ? 'Enviando…' : 'Enviar enlace'}
            </Button>

            {sent && (
              <div className="text-emerald-300 text-sm">
                Revisa tu correo y abre el enlace. Esta pestaña se actualizará al iniciar sesión.
              </div>
            )}
          </Card>
        </div>

        <div className="text-center text-[var(--muted)] text-xs">
          Al jugar anónimo, tus datos quedan ligados al dispositivo actual.
        </div>
      </div>
    </div>
  )
}

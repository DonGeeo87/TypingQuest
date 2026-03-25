import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components'
import { signInWithEmailMagicLink } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import { t } from '../i18n'

interface AuthScreenProps {
  onContinue: () => void
}

export function AuthScreen({ onContinue }: AuthScreenProps) {
  const { signInAnonymously } = useAuthStore()
  const ui = useGameStore((s) => s.language)
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
      setError(e instanceof Error ? e.message : t(ui, 'common.errorGeneric'))
    } finally {
      setLoadingAnon(false)
    }
  }, [signInAnonymously, onContinue, ui])

  const handleEmail = useCallback(async () => {
    const clean = email.trim().toLowerCase()
    if (!clean || !clean.includes('@')) {
      setError(t(ui, 'common.errorGeneric'))
      return
    }

    setError(null)
    setLoadingEmail(true)
    try {
      await signInWithEmailMagicLink(clean, redirectTo)
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : t(ui, 'common.errorGeneric'))
    } finally {
      setLoadingEmail(false)
    }
  }, [email, redirectTo, ui])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight"
          >
            {t(ui, 'auth.welcome')}
          </motion.h1>
          <p className="text-[var(--muted)]">
            {t(ui, 'auth.welcomeDesc')}
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
              <h2 className="text-[var(--foreground)] text-lg font-bold">{t(ui, 'auth.anonTitle')}</h2>
              <p className="text-[var(--muted)] text-sm mt-1">
                {t(ui, 'auth.anonDesc')}
              </p>
            </div>
            <Button onClick={handleAnonymous} disabled={loadingAnon}>
              {loadingAnon ? t(ui, 'common.loading') : t(ui, 'auth.anonContinue')}
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-[var(--foreground)] text-lg font-bold">{t(ui, 'auth.accountTitle')}</h2>
              <p className="text-[var(--muted)] text-sm mt-1">
                {t(ui, 'auth.accountDesc')}
              </p>
            </div>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(ui, 'auth.emailPlaceholder')}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
            />

            <Button onClick={handleEmail} disabled={loadingEmail || sent}>
              {sent ? 'Enlace enviado' : loadingEmail ? t(ui, 'common.loading') : t(ui, 'auth.sendLink')}
            </Button>

            {sent && (
              <div className="text-emerald-300 text-sm">
                Revisa tu correo y abre el enlace. Esta pestaña se actualizará al iniciar sesión.
              </div>
            )}
          </Card>
        </div>

        <div className="text-center text-[var(--muted)] text-xs">
          {t(ui, 'auth.deviceNote')}
        </div>
      </div>
    </div>
  )
}

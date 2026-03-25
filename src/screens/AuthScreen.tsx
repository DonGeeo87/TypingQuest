import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components'
import { signInWithEmailMagicLink } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import { t } from '../i18n'
import { trackEvent } from '../analytics'

interface AuthScreenProps {
  onContinue: () => void
}

const features = [
  {
    icon: '⚡',
    key: 'speed',
  },
  {
    icon: '🎯',
    key: 'accuracy',
  },
  {
    icon: '🏆',
    key: 'rankings',
  },
  {
    icon: '🧩',
    key: 'multiplayer',
  },
  {
    icon: '🎓',
    key: 'teacher',
  },
] as const

const testimonials = [
  { nameKey: 't1Name', roleKey: 't1Role', quoteKey: 't1Quote' },
  { nameKey: 't2Name', roleKey: 't2Role', quoteKey: 't2Quote' },
  { nameKey: 't3Name', roleKey: 't3Role', quoteKey: 't3Quote' },
] as const

export function AuthScreen({ onContinue }: AuthScreenProps) {
  const { signInAnonymously } = useAuthStore()
  const ui = useGameStore((s) => s.language)
  const [email, setEmail] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [loadingAnon, setLoadingAnon] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingLead, setLoadingLead] = useState(false)
  const [sent, setSent] = useState(false)
  const [leadSent, setLeadSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leadError, setLeadError] = useState<string | null>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const leadRef = useRef<HTMLDivElement | null>(null)

  const redirectTo = useMemo(() => window.location.origin, [])

  const handleAnonymous = useCallback(async () => {
    setError(null)
    setLoadingAnon(true)
    try {
      trackEvent('cta_play_now', { method: 'anonymous' })
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
      trackEvent('auth_magic_link_request')
      await signInWithEmailMagicLink(clean, redirectTo)
      setSent(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : t(ui, 'common.errorGeneric'))
    } finally {
      setLoadingEmail(false)
    }
  }, [email, redirectTo, ui])

  const scrollToLead = useCallback(() => {
    trackEvent('cta_get_updates')
    leadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (reduce?.matches) return
    const id = window.setInterval(() => {
      setActiveTestimonial((n) => (n + 1) % testimonials.length)
    }, 6000)
    return () => window.clearInterval(id)
  }, [])

  const handleLead = useCallback(async () => {
    const clean = leadEmail.trim().toLowerCase()
    if (!clean || !clean.includes('@')) {
      setLeadError(t(ui, 'landing.leadInvalid'))
      return
    }
    setLeadError(null)
    setLoadingLead(true)
    try {
      trackEvent('lead_submit')
      const { createLead } = await import('../services/leadService')
      await createLead({ email: clean, source: 'landing' })
      setLeadSent(true)
      setLeadEmail('')
    } catch (e) {
      setLeadError(e instanceof Error ? e.message : t(ui, 'common.errorGeneric'))
    } finally {
      setLoadingLead(false)
    }
  }, [leadEmail, ui])

  const heroStats = useMemo(() => ([
    { value: 60, labelKey: 'statSeconds' },
    { value: 5, labelKey: 'statLevels' },
    { value: 3, labelKey: 'statModes' },
  ]), [])

  return (
    <div className="min-h-screen">
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-32 -left-24 w-[36rem] h-[36rem] rounded-full bg-indigo-600/25 blur-3xl animate-float" />
            <div className="absolute -bottom-40 -right-32 w-[40rem] h-[40rem] rounded-full bg-violet-600/25 blur-3xl animate-float" />
          </div>

          <div className="max-w-6xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-10 md:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="text-left space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-6xl font-black tracking-tight text-[var(--foreground)]"
                >
                  <span className="text-gradient">{t(ui, 'landing.heroTitleA')}</span>{' '}
                  {t(ui, 'landing.heroTitleB')}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="text-[var(--muted)] text-lg leading-relaxed max-w-xl"
                >
                  {t(ui, 'landing.heroSubtitle')}
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleAnonymous} disabled={loadingAnon} className="w-full sm:w-auto">
                    {loadingAnon ? t(ui, 'common.loading') : t(ui, 'landing.ctaPrimary')}
                  </Button>
                  <Button variant="secondary" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto">
                    {t(ui, 'landing.ctaTertiary')}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {heroStats.map((s) => (
                    <div key={s.labelKey} className="glass-card px-4 py-3">
                      <div className="text-2xl font-black text-[var(--foreground)] tabular-nums">{s.value}+</div>
                      <div className="text-xs text-[var(--muted)]">{t(ui, `landing.${s.labelKey}`)}</div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-[var(--muted)]">
                  {t(ui, 'landing.privacyNote')}
                </div>
              </div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6 md:p-8 text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[var(--foreground)] font-black text-xl">{t(ui, 'landing.quickStartTitle')}</div>
                      <div className="text-[var(--muted)] text-sm">{t(ui, 'landing.quickStartSubtitle')}</div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold">{t(ui, 'landing.badgeNew')}</span>
                      <span className="px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-xs font-bold">{t(ui, 'landing.badgeFast')}</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[var(--foreground)] font-bold">{t(ui, 'auth.anonTitle')}</div>
                          <div className="text-[var(--muted)] text-sm mt-1">{t(ui, 'auth.anonDesc')}</div>
                        </div>
                        <div className="text-2xl" aria-hidden="true">🕹️</div>
                      </div>
                      <div className="mt-4">
                        <Button onClick={handleAnonymous} disabled={loadingAnon} className="w-full">
                          {loadingAnon ? t(ui, 'common.loading') : t(ui, 'auth.anonContinue')}
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[var(--foreground)] font-bold">{t(ui, 'auth.accountTitle')}</div>
                          <div className="text-[var(--muted)] text-sm mt-1">{t(ui, 'auth.accountDesc')}</div>
                        </div>
                        <div className="text-2xl" aria-hidden="true">🔐</div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <label className="sr-only" htmlFor="auth-email">{t(ui, 'auth.emailPlaceholder')}</label>
                        <input
                          id="auth-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t(ui, 'auth.emailPlaceholder')}
                          autoComplete="email"
                          inputMode="email"
                          className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />

                        <Button onClick={handleEmail} disabled={loadingEmail || sent} className="w-full">
                          {sent ? t(ui, 'landing.magicLinkSent') : loadingEmail ? t(ui, 'common.loading') : t(ui, 'auth.sendLink')}
                        </Button>

                        {sent && (
                          <div className="text-emerald-300 text-sm">
                            {t(ui, 'landing.magicLinkHelp')}
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300"
                        role="status"
                        aria-live="polite"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="text-left max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black text-[var(--foreground)]">{t(ui, 'landing.featuresTitle')}</h2>
            <p className="text-[var(--muted)] mt-3">{t(ui, 'landing.featuresSubtitle')}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, idx) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card className="p-6 text-left h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[var(--foreground)] font-bold text-lg">{t(ui, `landing.feature.${f.key}.title`)}</div>
                      <div className="text-[var(--muted)] mt-2 text-sm leading-relaxed">{t(ui, `landing.feature.${f.key}.desc`)}</div>
                    </div>
                    <div className="text-2xl" aria-hidden="true">{f.icon}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="border-t border-[var(--card-border)]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="text-left max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-black text-[var(--foreground)]">{t(ui, 'landing.testimonialsTitle')}</h2>
              <p className="text-[var(--muted)] mt-3">{t(ui, 'landing.testimonialsSubtitle')}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="glass-card p-7 text-left h-full"
                  >
                    <div className="text-2xl text-indigo-300 font-black" aria-hidden="true">“</div>
                    <div className="text-[var(--foreground)] text-lg md:text-xl leading-relaxed font-semibold">
                      {t(ui, `landing.testimonials.${testimonials[activeTestimonial].quoteKey}`)}
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[var(--foreground)] font-bold">{t(ui, `landing.testimonials.${testimonials[activeTestimonial].nameKey}`)}</div>
                        <div className="text-[var(--muted)] text-sm">{t(ui, `landing.testimonials.${testimonials[activeTestimonial].roleKey}`)}</div>
                      </div>
                      <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveTestimonial(i)}
                            className={`w-3 h-3 rounded-full border border-[var(--glass-border)] ${i === activeTestimonial ? 'bg-indigo-500' : 'bg-transparent'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            aria-label={t(ui, 'landing.testimonialSelect')}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 gap-5">
                <Card className="p-6 text-left">
                  <div className="text-[var(--foreground)] font-black text-xl">{t(ui, 'landing.promiseTitle')}</div>
                  <ul className="mt-4 space-y-3 text-[var(--muted)] text-sm">
                    <li className="flex gap-3"><span className="text-emerald-400 font-bold" aria-hidden="true">✓</span><span>{t(ui, 'landing.promiseA')}</span></li>
                    <li className="flex gap-3"><span className="text-emerald-400 font-bold" aria-hidden="true">✓</span><span>{t(ui, 'landing.promiseB')}</span></li>
                    <li className="flex gap-3"><span className="text-emerald-400 font-bold" aria-hidden="true">✓</span><span>{t(ui, 'landing.promiseC')}</span></li>
                  </ul>
                </Card>

                <Card className="p-6 text-left">
                  <div className="text-[var(--foreground)] font-black text-xl">{t(ui, 'landing.proTipTitle')}</div>
                  <div className="mt-3 text-[var(--muted)] text-sm leading-relaxed">{t(ui, 'landing.proTipDesc')}</div>
                  <div className="mt-4">
                    <Button variant="secondary" onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>{t(ui, 'landing.proTipCta')}</Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="border-t border-[var(--card-border)]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <Card className="p-7 text-left">
                <div className="text-[var(--foreground)] font-black text-3xl">{t(ui, 'landing.ctaTitle')}</div>
                <div className="text-[var(--muted)] mt-3">{t(ui, 'landing.ctaDesc')}</div>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleAnonymous} disabled={loadingAnon} className="w-full sm:w-auto">
                    {loadingAnon ? t(ui, 'common.loading') : t(ui, 'landing.ctaPrimary')}
                  </Button>
                  <Button variant="secondary" onClick={scrollToLead} className="w-full sm:w-auto">{t(ui, 'landing.ctaSecondary')}</Button>
                </div>
                <div className="mt-6 text-[var(--muted)] text-xs">{t(ui, 'auth.deviceNote')}</div>
              </Card>

              <div ref={leadRef} className="scroll-mt-24">
                <Card className="p-7 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[var(--foreground)] font-black text-2xl">{t(ui, 'landing.leadTitle')}</div>
                      <div className="text-[var(--muted)] mt-2">{t(ui, 'landing.leadDesc')}</div>
                    </div>
                    <div className="text-2xl" aria-hidden="true">📩</div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <label className="sr-only" htmlFor="lead-email">{t(ui, 'landing.leadEmailPlaceholder')}</label>
                    <input
                      id="lead-email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder={t(ui, 'landing.leadEmailPlaceholder')}
                      autoComplete="email"
                      inputMode="email"
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Button onClick={handleLead} disabled={loadingLead || leadSent} className="w-full">
                      {leadSent ? t(ui, 'landing.leadThanks') : loadingLead ? t(ui, 'common.loading') : t(ui, 'landing.leadCta')}
                    </Button>

                    <AnimatePresence>
                      {leadError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm"
                          role="status"
                          aria-live="polite"
                        >
                          {leadError}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="text-[var(--muted)] text-xs">{t(ui, 'landing.leadPrivacy')}</div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[var(--card-border)]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 text-left flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <div className="text-[var(--foreground)] font-black">TypingQuest</div>
              <div className="text-[var(--muted)] text-sm">{t(ui, 'landing.footer')}</div>
            </div>
            <div className="flex gap-2">
              <a className="px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500" href="#features">{t(ui, 'landing.navFeatures')}</a>
              <a className="px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500" href="#cta">{t(ui, 'landing.navStart')}</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

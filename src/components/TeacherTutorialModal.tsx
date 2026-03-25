import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './Card'
import { Button } from './Button'
import { useGameStore } from '../store/gameStore'
import { t } from '../i18n'

export function TeacherTutorialModal(props: { open: boolean; onClose: () => void; onOpenGuide: () => void }) {
  const ui = useGameStore((s) => s.language)
  const [step, setStep] = useState(0)

  const steps = useMemo(() => ([
    { icon: '🏫', title: t(ui, 'tutorial.step1Title'), desc: t(ui, 'tutorial.step1Desc') },
    { icon: '🔑', title: t(ui, 'tutorial.step2Title'), desc: t(ui, 'tutorial.step2Desc') },
    { icon: '📝', title: t(ui, 'tutorial.step3Title'), desc: t(ui, 'tutorial.step3Desc') },
    { icon: '🎮', title: t(ui, 'tutorial.step4Title'), desc: t(ui, 'tutorial.step4Desc') },
    { icon: '📊', title: t(ui, 'tutorial.step5Title'), desc: t(ui, 'tutorial.step5Desc') },
  ]), [ui])

  const close = useCallback(() => {
    props.onClose()
    setStep(0)
  }, [props])

  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), [])
  const next = useCallback(() => setStep((s) => Math.min(steps.length - 1, s + 1)), [steps.length])

  return (
    <AnimatePresence>
      {props.open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label={t(ui, 'tutorial.title')}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            className="w-full max-w-2xl"
          >
            <Card className="p-6 md:p-8 text-left">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[var(--foreground)] font-black text-2xl">{t(ui, 'tutorial.title')}</div>
                  <div className="text-[var(--muted)] mt-2">{step + 1} / {steps.length}</div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="w-10 h-10 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:opacity-90 transition-opacity flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={t(ui, 'common.back')}
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                <div className="md:col-span-3">
                  <div className="glass-card p-6">
                    <div className="text-4xl" aria-hidden="true">{steps[step].icon}</div>
                    <div className="mt-3 text-[var(--foreground)] font-black text-xl">{steps[step].title}</div>
                    <div className="mt-2 text-[var(--muted)] leading-relaxed">{steps[step].desc}</div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  {steps.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => setStep(i)}
                      className={`w-full text-left rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        i === step
                          ? 'border-indigo-500/60 bg-indigo-500/10 text-[var(--foreground)]'
                          : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--foreground)]'
                      }`}
                      aria-current={i === step}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-bold text-sm">{i + 1}. {s.title}</div>
                        <div className="text-lg" aria-hidden="true">{s.icon}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
                <Button variant="secondary" onClick={props.onOpenGuide}>{t(ui, 'tutorial.openGuide')}</Button>
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" onClick={prev} disabled={step === 0}>{t(ui, 'tutorial.prev')}</Button>
                  {step < steps.length - 1 ? (
                    <Button onClick={next}>{t(ui, 'tutorial.next')}</Button>
                  ) : (
                    <Button onClick={close}>{t(ui, 'tutorial.done')}</Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

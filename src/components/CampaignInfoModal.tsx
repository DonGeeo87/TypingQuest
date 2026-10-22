import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './Card'
import { Button } from './Button'
import { t } from '../i18n'
import type { Language } from '../types'

interface CampaignInfoModalProps {
  open: boolean
  language: Language
  onClose: () => void
  onStart: () => void
}

/**
 * Presenta el modo campaña antes de entrar: qué es, cómo se progresa y qué se
 * necesita para cada etapa. Es el modal que HomeScreen ya invocaba.
 */
export function CampaignInfoModal({ open, language, onClose, onStart }: CampaignInfoModalProps) {
  const bloques = [
    { icon: '🗺️', titulo: t(language, 'campaign.stage'), texto: t(language, 'home.campaignDesc') },
    { icon: '⭐', titulo: t(language, 'campaign.stars'), texto: t(language, 'campaign.objectivesMet') },
    { icon: '✨', titulo: t(language, 'campaign.xp'), texto: t(language, 'campaign.totalXp') },
  ]

  const requisitos = [
    t(language, 'campaign.requiredWpm'),
    t(language, 'campaign.requiredAccuracy'),
    t(language, 'campaign.requiredCombo'),
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label={t(language, 'home.campaign')}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            className="w-full max-w-xl"
          >
            <Card className="p-6 md:p-8 text-left">
              <div className="text-[var(--foreground)] font-black text-2xl">{t(language, 'home.campaign')}</div>
              <div className="text-[var(--muted)] mt-2">{t(language, 'home.campaignDesc')}</div>

              <div className="mt-6 space-y-3">
                {bloques.map((b) => (
                  <div key={b.titulo} className="flex items-start gap-3">
                    <div className="text-xl leading-none mt-0.5" aria-hidden="true">{b.icon}</div>
                    <div>
                      <div className="text-[var(--foreground)] font-bold text-sm">{b.titulo}</div>
                      <div className="text-[var(--muted)] text-sm">{b.texto}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {requisitos.map((r) => (
                  <span
                    key={r}
                    className="px-3 py-1 rounded-lg text-xs font-semibold border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--muted)]"
                  >
                    {r}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button variant="secondary" onClick={onClose}>{t(language, 'campaign.back')}</Button>
                <Button variant="primary" onClick={onStart}>{t(language, 'campaign.startStage')}</Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useGameStore } from '../store/gameStore'
import { t } from '../i18n'

export function AppFooter(props: { onNavigate: (screen: string) => void }) {
  const ui = useGameStore((s) => s.language)
  const terms = ui === 'es' ? 'Términos' : 'Terms'
  const privacy = ui === 'es' ? 'Privacidad' : 'Privacy'
  const support = ui === 'es' ? 'Soporte' : 'Support'

  return (
    <footer className="border-t border-[var(--card-border)] mt-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <div className="text-[var(--foreground)] font-black">TypingQuest</div>
          <div className="text-[var(--muted)] text-sm">{t(ui, 'landing.footer')}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => props.onNavigate('terms')}
            className="px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {terms}
          </button>
          <button
            type="button"
            onClick={() => props.onNavigate('privacy')}
            className="px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {privacy}
          </button>
          <button
            type="button"
            onClick={() => props.onNavigate('support')}
            className="px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {support}
          </button>
          <a
            href="https://github.com/DonGeeo87/TypingQuest"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}

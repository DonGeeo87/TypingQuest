import { useMemo, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import { useUiStore } from '../store/uiStore'
import { t } from '../i18n'
import { Button } from './Button'
import { AudioToggle } from './AudioToggle'

function TopbarNavLink(props: {
  currentScreen: string
  screen: string
  label: string
  onNavigate: (screen: string) => void
  onCloseMenu?: () => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        props.onCloseMenu?.()
        props.onNavigate(props.screen)
      }}
      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        props.currentScreen === props.screen
          ? 'bg-indigo-500/15 text-indigo-300'
          : 'text-[var(--muted)] hover:text-[var(--foreground)]'
      }`}
    >
      {props.label}
    </button>
  )
}

export function Topbar(props: { currentScreen: string; onNavigate: (screen: string) => void }) {
  const { profile, isAnonymous } = useAuthStore()
  const { theme, toggleTheme } = useUiStore()
  const ui = useGameStore((s) => s.language)
  const setUi = useGameStore((s) => s.setLanguage)
  const [open, setOpen] = useState(false)

  const displayName = useMemo(() => (isAnonymous ? 'Invitado' : (profile?.username || 'Invitado')), [isAnonymous, profile?.username])

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[color:var(--background)]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => props.onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
        >
          <img src="/logo.svg" width={36} height={36} alt="TypingQuest" className="w-9 h-9 shrink-0 drop-shadow-sm" />
          <div className="hidden sm:block">
            <div className="text-[var(--foreground)] font-black leading-none">TypingQuest</div>
            <div className="text-[var(--muted)] text-xs leading-none">{t(ui, 'landing.tagline')}</div>
          </div>
        </button>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          <TopbarNavLink currentScreen={props.currentScreen} screen="home" label={t(ui, 'common.home')} onNavigate={props.onNavigate} />
          <TopbarNavLink currentScreen={props.currentScreen} screen="ranking" label={t(ui, 'home.rankings')} onNavigate={props.onNavigate} />
          <TopbarNavLink currentScreen={props.currentScreen} screen="teacher" label={t(ui, 'home.teacher')} onNavigate={props.onNavigate} />
          <TopbarNavLink currentScreen={props.currentScreen} screen="teacherGuide" label={t(ui, 'teacherGuide.title')} onNavigate={props.onNavigate} />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-1">
            <button
              type="button"
              onClick={() => setUi('es')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                ui === 'es' ? 'bg-indigo-600 text-white' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
              aria-pressed={ui === 'es'}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setUi('en')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                ui === 'en' ? 'bg-indigo-600 text-white' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
              aria-pressed={ui === 'en'}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:opacity-90 transition-opacity flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>

          <AudioToggle position="static" compact />

          <div className="hidden md:flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm" aria-hidden="true">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-sm font-semibold text-[var(--foreground)] max-w-[160px] truncate">{displayName}</div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:opacity-90 transition-opacity flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Menu"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--card-border)]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex flex-col gap-2">
            <TopbarNavLink currentScreen={props.currentScreen} screen="home" label={t(ui, 'common.home')} onNavigate={props.onNavigate} onCloseMenu={() => setOpen(false)} />
            <TopbarNavLink currentScreen={props.currentScreen} screen="ranking" label={t(ui, 'home.rankings')} onNavigate={props.onNavigate} onCloseMenu={() => setOpen(false)} />
            <TopbarNavLink currentScreen={props.currentScreen} screen="teacher" label={t(ui, 'home.teacher')} onNavigate={props.onNavigate} onCloseMenu={() => setOpen(false)} />
            <TopbarNavLink currentScreen={props.currentScreen} screen="teacherGuide" label={t(ui, 'teacherGuide.title')} onNavigate={props.onNavigate} onCloseMenu={() => setOpen(false)} />
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => setUi('es')} className="flex-1">ES</Button>
              <Button variant="secondary" onClick={() => setUi('en')} className="flex-1">EN</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

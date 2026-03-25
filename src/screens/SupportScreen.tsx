import { Button, Card } from '../components'
import { useGameStore } from '../store/gameStore'

export function SupportScreen(props: { onNavigate: (screen: string) => void }) {
  const ui = useGameStore((s) => s.language)
  const title = ui === 'es' ? 'Soporte' : 'Support'
  const body = ui === 'es'
    ? 'Si algo falla, revisa primero la conexión, variables de entorno de Supabase y vuelve a iniciar sesión. Si persiste, abre un issue en GitHub.'
    : 'If something breaks, check your connection, Supabase environment variables, and sign in again. If it persists, open an issue on GitHub.'

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="secondary" onClick={() => props.onNavigate('home')}>{ui === 'es' ? 'Volver' : 'Back'}</Button>
        <Card className="p-6 text-left space-y-3">
          <div className="text-[var(--foreground)] font-black text-2xl">{title}</div>
          <div className="text-[var(--muted)] leading-relaxed">{body}</div>
          <a
            href="https://github.com/DonGeeo87/TypingQuest/issues"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md inline-block"
          >
            GitHub Issues
          </a>
        </Card>
      </div>
    </div>
  )
}


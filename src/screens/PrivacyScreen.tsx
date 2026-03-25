import { Button, Card } from '../components'
import { useGameStore } from '../store/gameStore'

export function PrivacyScreen(props: { onNavigate: (screen: string) => void }) {
  const ui = useGameStore((s) => s.language)
  const title = ui === 'es' ? 'Política de privacidad' : 'Privacy policy'
  const body = ui === 'es'
    ? 'Guardamos métricas de juego y, si envías tu email, lo usamos solo para novedades de TypingQuest. Puedes darte de baja cuando quieras.'
    : 'We store gameplay metrics and, if you submit your email, we only use it for TypingQuest updates. You can unsubscribe anytime.'

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="secondary" onClick={() => props.onNavigate('home')}>{ui === 'es' ? 'Volver' : 'Back'}</Button>
        <Card className="p-6 text-left space-y-3">
          <div className="text-[var(--foreground)] font-black text-2xl">{title}</div>
          <div className="text-[var(--muted)] leading-relaxed">{body}</div>
        </Card>
      </div>
    </div>
  )
}


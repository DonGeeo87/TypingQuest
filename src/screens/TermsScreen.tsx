import { Button, Card } from '../components'
import { useGameStore } from '../store/gameStore'

export function TermsScreen(props: { onNavigate: (screen: string) => void }) {
  const ui = useGameStore((s) => s.language)
  const title = ui === 'es' ? 'Términos de servicio' : 'Terms of service'
  const body = ui === 'es'
    ? 'TypingQuest se ofrece tal cual. No garantizamos resultados específicos. Usa el servicio de forma responsable.'
    : 'TypingQuest is provided as-is. We do not guarantee specific outcomes. Use the service responsibly.'

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


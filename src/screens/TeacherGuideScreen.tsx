import { Button, Card, TeacherTutorialModal } from '../components'
import { useGameStore } from '../store/gameStore'
import { t } from '../i18n'
import { useState } from 'react'

export function TeacherGuideScreen(props: { onNavigate: (screen: string) => void }) {
  const ui = useGameStore((s) => s.language)
  const [tutorialOpen, setTutorialOpen] = useState(false)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button variant="secondary" onClick={() => props.onNavigate('home')}>{t(ui, 'common.back')}</Button>
          <div className="text-[var(--foreground)] font-black text-xl">{t(ui, 'teacherGuide.title')}</div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setTutorialOpen(true)}>{t(ui, 'tutorial.open')}</Button>
            <Button onClick={() => props.onNavigate('teacher')}>{t(ui, 'common.teacher')}</Button>
          </div>
        </div>

        <Card className="p-6 text-left space-y-4">
          <div className="text-[var(--foreground)] font-bold text-lg">{t(ui, 'teacherGuide.prereqTitle')}</div>
          <ul className="space-y-2 text-[var(--muted)]">
            <li className="flex gap-3"><span className="text-emerald-500 font-bold" aria-hidden="true">✓</span><span>{t(ui, 'teacherGuide.prereqA')}</span></li>
            <li className="flex gap-3"><span className="text-emerald-500 font-bold" aria-hidden="true">✓</span><span>{t(ui, 'teacherGuide.prereqB')}</span></li>
            <li className="flex gap-3"><span className="text-emerald-500 font-bold" aria-hidden="true">✓</span><span>{t(ui, 'teacherGuide.prereqC')}</span></li>
          </ul>
        </Card>

        <Card className="p-6 text-left space-y-4">
          <div className="text-[var(--foreground)] font-bold text-lg">{t(ui, 'teacherGuide.howTitle')}</div>
          <div className="text-[var(--muted)]">{t(ui, 'teacherGuide.howDesc')}</div>
        </Card>

        <Card className="p-6 text-left space-y-4">
          <div className="text-[var(--foreground)] font-bold text-lg">{t(ui, 'teacherGuide.stepsTitle')}</div>
          <ol className="space-y-2 text-[var(--muted)] list-decimal pl-5">
            <li>{t(ui, 'teacherGuide.step1')}</li>
            <li>{t(ui, 'teacherGuide.step2')}</li>
            <li>{t(ui, 'teacherGuide.step3')}</li>
            <li>{t(ui, 'teacherGuide.step4')}</li>
            <li>{t(ui, 'teacherGuide.step5')}</li>
          </ol>
        </Card>

        <Card className="p-6 text-left space-y-4">
          <div className="text-[var(--foreground)] font-bold text-lg">{t(ui, 'teacherGuide.troubleshootingTitle')}</div>
          <ul className="space-y-2 text-[var(--muted)]">
            <li>{t(ui, 'teacherGuide.issueA')}</li>
            <li>{t(ui, 'teacherGuide.issueB')}</li>
            <li>{t(ui, 'teacherGuide.issueC')}</li>
          </ul>
        </Card>
      </div>

      <TeacherTutorialModal
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        onOpenGuide={() => setTutorialOpen(false)}
      />
    </div>
  )
}

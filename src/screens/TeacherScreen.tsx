import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Tooltip } from '../components'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import type { Assignment, AssignmentAttempt, Class, GameLevel, Language } from '../types'
import { t } from '../i18n'
import { isSupabaseConfigured } from '../lib/supabase'
import { log } from '../utils/logger'
import {
  createAssignment,
  createClass,
  joinClassByCode,
  listAssignmentAttempts,
  listAssignments,
  listClassMembers,
  listMyClasses,
} from '../services/supabaseService'

interface TeacherScreenProps {
  onNavigate: (screen: string) => void
}

type View = 'list' | 'class' | 'assignment'

export function TeacherScreen({ onNavigate }: TeacherScreenProps) {
  const { userId } = useAuthStore()
  const { setLanguage, setLevel, setGameDuration, setAssignmentId } = useGameStore()
  const ui = useGameStore((s) => s.language)

  const [view, setView] = useState<View>('list')
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [members, setMembers] = useState<Awaited<ReturnType<typeof listClassMembers>>>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [attempts, setAttempts] = useState<AssignmentAttempt[]>([])

  const [createName, setCreateName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [aTitle, setATitle] = useState('')
  const [aDesc, setADesc] = useState('')
  const [aLang, setALang] = useState<Language>('en')
  const [aLevel, setALevel] = useState<GameLevel>(1)
  const [aDuration, setADuration] = useState(60)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isTeacher = useMemo(() => selectedClass?.teacher_id === userId, [selectedClass?.teacher_id, userId])
  const isLocalUser = useMemo(() => !userId || userId.startsWith('local_') || !/^[0-9a-f]{8}-/i.test(userId), [userId])
  const teacherModeEnabled = Boolean(userId && isSupabaseConfigured && !isLocalUser)

  const refreshClasses = useCallback(async () => {
    if (!userId) return
    try {
      const data = await listMyClasses(userId)
      setClasses(data)
    } catch (e) {
      log.warn('[TeacherMode] refreshClasses falló:', e)
      setError(e instanceof Error ? e.message : 'Error cargando clases')
    }
  }, [userId])

  const openClass = useCallback(async (cls: Class) => {
    setSelectedClass(cls)
    setSelectedAssignment(null)
    setView('class')
    setError(null)
    setLoading(true)
    try {
      const [m, a] = await Promise.all([
        listClassMembers(cls.id),
        listAssignments(cls.id),
      ])
      setMembers(m)
      setAssignments(a)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando clase')
    } finally {
      setLoading(false)
    }
  }, [])

  const openAssignment = useCallback(async (a: Assignment) => {
    setSelectedAssignment(a)
    setView('assignment')
    setError(null)
    setLoading(true)
    try {
      const data = await listAssignmentAttempts(a.id)
      setAttempts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando intentos')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCreateClass = useCallback(async () => {
    if (!teacherModeEnabled || !userId) return
    if (!createName.trim()) return
    setLoading(true)
    setError(null)
    try {
      const cls = await createClass({ teacherId: userId, name: createName.trim() })
      setCreateName('')
      await refreshClasses()
      await openClass(cls)
    } catch (e) {
      log.warn('[TeacherMode] createClass falló:', e)
      setError(e instanceof Error ? e.message : 'Error creando clase')
    } finally {
      setLoading(false)
    }
  }, [createName, openClass, refreshClasses, teacherModeEnabled, userId])

  const handleJoin = useCallback(async () => {
    if (!teacherModeEnabled || !userId) return
    if (!joinCode.trim()) return
    setLoading(true)
    setError(null)
    try {
      const cls = await joinClassByCode({ userId, code: joinCode.trim() })
      setJoinCode('')
      await refreshClasses()
      await openClass(cls)
    } catch (e) {
      log.warn('[TeacherMode] joinClassByCode falló:', e)
      setError(e instanceof Error ? e.message : 'Error uniéndose a clase')
    } finally {
      setLoading(false)
    }
  }, [joinCode, openClass, refreshClasses, teacherModeEnabled, userId])

  const handleCreateAssignment = useCallback(async () => {
    if (!teacherModeEnabled || !userId || !selectedClass) return
    if (!aTitle.trim()) return
    setLoading(true)
    setError(null)
    try {
      await createAssignment({
        classId: selectedClass.id,
        createdBy: userId,
        title: aTitle.trim(),
        description: aDesc.trim() ? aDesc.trim() : undefined,
        language: aLang,
        level: aLevel,
        durationSeconds: aDuration,
      })
      setATitle('')
      setADesc('')
      const a = await listAssignments(selectedClass.id)
      setAssignments(a)
    } catch (e) {
      log.warn('[TeacherMode] createAssignment falló:', e)
      setError(e instanceof Error ? e.message : 'Error creando asignación')
    } finally {
      setLoading(false)
    }
  }, [aDesc, aDuration, aLang, aLevel, aTitle, selectedClass, teacherModeEnabled, userId])

  const handleStartAssignment = useCallback((a: Assignment) => {
    setLanguage(a.language)
    setLevel(a.level)
    setGameDuration(a.duration_seconds)
    setAssignmentId(a.id)
    onNavigate('game')
  }, [onNavigate, setAssignmentId, setGameDuration, setLanguage, setLevel])

  const exportCsv = useCallback(() => {
    if (!selectedAssignment) return
    const headers = ['username', 'wpm', 'accuracy', 'errors', 'words_completed', 'score', 'submitted_at']
    const rows = attempts.map((x) => ([
      x.profiles?.username ?? '',
      String(x.wpm),
      String(x.accuracy),
      String(x.errors),
      String(x.words_completed),
      String(x.score),
      x.submitted_at,
    ]))
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `typingquest-assignment-${selectedAssignment.id}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [attempts, selectedAssignment])

  useEffect(() => {
    void refreshClasses()
  }, [refreshClasses])

  if (!userId) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={() => onNavigate('home')}>{t(ui, 'common.back')}</Button>
          </div>
          <Card className="p-6">
            <div className="text-[var(--foreground)] font-bold text-xl mb-2">{t(ui, 'teacher.title')}</div>
            <div className="text-[var(--muted)]">{t(ui, 'teacher.signInRequired')}</div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              if (view === 'list') onNavigate('home')
              else if (view === 'class') {
                setView('list')
                setSelectedClass(null)
              } else {
                setView('class')
                setSelectedAssignment(null)
              }
            }}
          >
            ← Back
          </Button>
          <div className="text-[var(--foreground)] font-bold text-xl">{t(ui, 'teacher.title')}</div>
        </div>

        {error && (
          <Card className="p-4 border border-red-500/30 bg-red-500/10">
            <div className="text-red-500">{error}</div>
          </Card>
        )}

        {!teacherModeEnabled && userId && (
          <Card className="p-4 border border-amber-500/30 bg-amber-500/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-amber-600">
                Para usar Modo Profesor necesitas iniciar sesión con Supabase (cuenta online).
              </div>
              <Button variant="secondary" onClick={() => onNavigate('auth')}>
                Iniciar sesión
              </Button>
            </div>
          </Card>
        )}

        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[var(--foreground)] font-bold">{t(ui, 'teacher.createClass')}</div>
                <Tooltip content="Crea una clase y comparte el código con tus estudiantes.">
                  <span className="text-[var(--muted)] font-bold">ⓘ</span>
                </Tooltip>
              </div>
              <input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder={t(ui, 'teacher.classNamePlaceholder')}
                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
              />
              <Button onClick={handleCreateClass} disabled={!teacherModeEnabled || loading || !createName.trim()}>
                {t(ui, 'common.create')}
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[var(--foreground)] font-bold">{t(ui, 'teacher.joinClass')}</div>
                <Tooltip content="Únete usando el código. Si eres profe, crea tu clase en la izquierda.">
                  <span className="text-[var(--muted)] font-bold">ⓘ</span>
                </Tooltip>
              </div>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder={t(ui, 'teacher.codePlaceholder')}
                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
              />
              <Button variant="accent" onClick={handleJoin} disabled={!teacherModeEnabled || loading || !joinCode.trim()}>
                {t(ui, 'common.join')}
              </Button>
            </Card>

            <Card className="p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[var(--foreground)] font-bold">{t(ui, 'teacher.myClasses')}</div>
                <Button variant="secondary" onClick={refreshClasses} disabled={loading}>{t(ui, 'common.refresh')}</Button>
              </div>
              {classes.length === 0 ? (
                <div className="text-[var(--muted)]">{t(ui, 'teacher.noClasses')}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {classes.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => void openClass(c)}
                      className="text-left"
                    >
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[var(--foreground)] font-semibold">{c.name}</div>
                            <div className="text-[var(--muted)] text-sm">{t(ui, 'teacher.codeLabel')}: {c.code}</div>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-[var(--secondary)] text-[var(--muted)]">
                            {c.teacher_id === userId ? 'Teacher' : 'Student'}
                          </div>
                        </div>
                      </Card>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {view === 'class' && selectedClass && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-[var(--foreground)] font-bold text-xl">{selectedClass.name}</div>
                  <div className="text-[var(--muted)] text-sm">Código: {selectedClass.code}</div>
                </div>
                <div className="text-[var(--muted)] text-sm">
                  {isTeacher ? 'Eres el profesor' : 'Eres estudiante'}
                </div>
              </div>
            </Card>

            {isTeacher && (
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[var(--foreground)] font-bold">{t(ui, 'teacher.createAssignment')}</div>
                  <Tooltip content="Configura idioma, nivel y duración. Luego tus estudiantes juegan y queda registro de intentos.">
                    <span className="text-[var(--muted)] font-bold">ⓘ</span>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={aTitle}
                    onChange={(e) => setATitle(e.target.value)}
                    placeholder="Título"
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
                  />
                  <input
                    value={aDesc}
                    onChange={(e) => setADesc(e.target.value)}
                    placeholder="Descripción (opcional)"
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={aLang}
                    onChange={(e) => setALang(e.target.value as Language)}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                  <select
                    value={aLevel}
                    onChange={(e) => setALevel(Number(e.target.value) as GameLevel)}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
                  >
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                    <option value={4}>Level 4</option>
                    <option value={5}>Level 5</option>
                  </select>
                  <select
                    value={aDuration}
                    onChange={(e) => setADuration(Number(e.target.value))}
                    className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
                  >
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                    <option value={90}>90s</option>
                    <option value={120}>120s</option>
                  </select>
                </div>
                <Button onClick={handleCreateAssignment} disabled={!teacherModeEnabled || loading || !aTitle.trim()}>
                  {t(ui, 'teacher.createAssignment')}
                </Button>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="text-[var(--foreground)] font-bold mb-3">Estudiantes</div>
                {members.length === 0 ? (
                  <div className="text-[var(--muted)]">Sin miembros.</div>
                ) : (
                  <div className="space-y-2">
                    {members.map((m) => (
                      <div key={m.user_id} className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
                        <div className="text-[var(--foreground)] font-semibold">{m.profiles?.username ?? 'Alumno'}</div>
                        <div className="text-xs px-2 py-1 rounded-full bg-[var(--secondary)] text-[var(--muted)]">
                          {m.role}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[var(--foreground)] font-bold">Asignaciones</div>
                  <Button variant="secondary" disabled={loading} onClick={() => selectedClass && void openClass(selectedClass)}>Refrescar</Button>
                </div>
                {assignments.length === 0 ? (
                  <div className="text-[var(--muted)]">No hay asignaciones.</div>
                ) : (
                  <div className="space-y-2">
                    {assignments.map((a) => (
                      <div key={a.id} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[var(--foreground)] font-semibold">{a.title}</div>
                            <div className="text-[var(--muted)] text-xs">{a.language.toUpperCase()} · L{a.level} · {a.duration_seconds}s</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleStartAssignment(a)}>Iniciar</Button>
                            <Button variant="accent" onClick={() => void openAssignment(a)}>Ver</Button>
                          </div>
                        </div>
                        {a.description && <div className="text-[var(--muted)] text-sm mt-2">{a.description}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {view === 'assignment' && selectedAssignment && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-[var(--foreground)] font-bold text-xl">{selectedAssignment.title}</div>
                  <div className="text-[var(--muted)] text-sm">
                    {selectedAssignment.language.toUpperCase()} · L{selectedAssignment.level} · {selectedAssignment.duration_seconds}s
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={exportCsv} disabled={attempts.length === 0}>CSV</Button>
                  <Button variant="accent" onClick={() => handleStartAssignment(selectedAssignment)}>Iniciar</Button>
                </div>
              </div>
              {selectedAssignment.description && (
                <div className="text-[var(--muted)] mt-3">{selectedAssignment.description}</div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[var(--foreground)] font-bold">Intentos</div>
                <Button variant="secondary" onClick={() => void openAssignment(selectedAssignment)} disabled={loading}>Refrescar</Button>
              </div>
              {attempts.length === 0 ? (
                <div className="text-[var(--muted)]">Sin intentos aún.</div>
              ) : (
                <div className="space-y-2">
                  {attempts.map((x) => (
                    <div key={x.id} className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
                      <div>
                        <div className="text-[var(--foreground)] font-semibold">{x.profiles?.username ?? 'Alumno'}</div>
                        <div className="text-[var(--muted)] text-xs">{new Date(x.submitted_at).toLocaleString()}</div>
                      </div>
                      <div className="flex gap-4 text-sm tabular-nums">
                        <div className="text-[var(--foreground)] font-semibold">{x.wpm} WPM</div>
                        <div className="text-[var(--foreground)] font-semibold">{Math.round(x.accuracy)}%</div>
                        <div className="text-[var(--muted)]">{x.errors} err</div>
                        <div className="text-indigo-400 font-bold">{x.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

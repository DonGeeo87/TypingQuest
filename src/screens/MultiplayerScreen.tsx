import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components'
import { getCurrentUser, signInAnonymously, supabase } from '../lib/supabase'
import { useGameStore } from '../store/gameStore'
import {
  createMultiplayerRoom,
  getMultiplayerRoomByPin,
  getProfile,
  getCurrentMultiplayerRound,
  hostStartMultiplayerRound,
  joinMultiplayerRoom,
  leaveMultiplayerRoom,
  listMultiplayerPlayers,
  listRoundLeaderboard,
  submitMultiplayerResult,
  subscribeToRoom,
} from '../services/supabaseService'
import { selectTextForLevel } from '../data/words'
import type { MultiplayerRoom, MultiplayerRoomPlayer, MultiplayerRound, MultiplayerSubmission } from '../types'
import { MultiplayerRoundScreen, type MultiplayerRoundResult } from './MultiplayerRoundScreen'
import { useContentStore } from '../store/contentStore'

interface MultiplayerScreenProps {
  onNavigate: (screen: string) => void
}

type Mode = 'menu' | 'join' | 'host_lobby' | 'player_lobby' | 'playing' | 'results'

export function MultiplayerScreen({ onNavigate }: MultiplayerScreenProps) {
  const { language, level, gameDuration } = useGameStore()
  const rememberContentKey = useContentStore((s) => s.rememberKey)
  const buildContentKey = useContentStore((s) => s.buildKey)
  const [mode, setMode] = useState<Mode>('menu')
  const [userId, setUserId] = useState<string | null>(null)
  const [room, setRoom] = useState<MultiplayerRoom | null>(null)
  const [players, setPlayers] = useState<MultiplayerRoomPlayer[]>([])
  const [round, setRound] = useState<MultiplayerRound | null>(null)
  const [leaderboard, setLeaderboard] = useState<MultiplayerSubmission[]>([])
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isLocalUser = useMemo(() => !!userId && userId.startsWith('local_'), [userId])

  const refreshRoomState = useCallback(async (roomId: string) => {
    const [playersData, currentRound] = await Promise.all([
      listMultiplayerPlayers(roomId),
      getCurrentMultiplayerRound(roomId),
    ])

    setPlayers(playersData)
    setRound(currentRound)

    const { data: roomData } = await supabase
      .from('mp_rooms')
      .select('*')
      .eq('id', roomId)
      .maybeSingle()

    setRoom((roomData as MultiplayerRoom) || null)
  }, [])

  useEffect(() => {
    const load = async () => {
      let id = await getCurrentUser()
      if (!id) {
        id = await signInAnonymously()
      }
      setUserId(id)
    }
    void load()
  }, [])

  useEffect(() => {
    if (!room?.id) return
    const unsubscribe = subscribeToRoom(room.id, () => {
      void refreshRoomState(room.id)
    })
    return unsubscribe
  }, [room?.id, refreshRoomState])

  useEffect(() => {
    if (!room || !round) return
    if (mode === 'host_lobby' || mode === 'player_lobby') {
      if (room.status === 'running' && round.status === 'running') {
        setMode('playing')
      }
    }
  }, [room, round, mode])

  const handleHostCreate = useCallback(async () => {
    if (!userId) return
    if (isLocalUser) {
      setError('Multijugador requiere conexión a Supabase (no modo local).')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const profile = await getProfile(userId)
      const username = profile?.username?.trim() || 'Anónimo'

      const newRoom = await createMultiplayerRoom({
        hostId: userId,
        username,
        language,
        level,
        roundDuration: gameDuration || 60,
      })

      setRoom(newRoom)
      await refreshRoomState(newRoom.id)
      setMode('host_lobby')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error creando sala')
    } finally {
      setLoading(false)
    }
  }, [userId, isLocalUser, language, level, gameDuration, refreshRoomState])

  const handleJoin = useCallback(async () => {
    if (!userId) return
    if (isLocalUser) {
      setError('Multijugador requiere conexión a Supabase (no modo local).')
      return
    }

    const normalized = pin.replace(/\D/g, '').slice(0, 6)
    if (normalized.length !== 6) {
      setError('Ingresa un PIN de 6 dígitos.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const found = await getMultiplayerRoomByPin(normalized)
      if (!found) {
        setError('Sala no encontrada.')
        return
      }

      const profile = await getProfile(userId)
      const username = profile?.username?.trim() || 'Anónimo'

      await joinMultiplayerRoom({ roomId: found.id, userId, username })
      setRoom(found)
      await refreshRoomState(found.id)
      setMode('player_lobby')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error uniéndose a la sala')
    } finally {
      setLoading(false)
    }
  }, [userId, isLocalUser, pin, refreshRoomState])

  const handleLeave = useCallback(async () => {
    if (!room?.id || !userId) {
      setMode('menu')
      return
    }

    try {
      await leaveMultiplayerRoom({ roomId: room.id, userId })
    } finally {
      setRoom(null)
      setPlayers([])
      setRound(null)
      setLeaderboard([])
      setPin('')
      setMode('menu')
    }
  }, [room?.id, userId])

  const handleStartRound = useCallback(async () => {
    if (!room?.id) return
    setLoading(true)
    setError(null)
    try {
      const recentKeys = useContentStore.getState().recentKeys
      const selection = selectTextForLevel(room.language, room.level, 'multiplayer', recentKeys)
      const compositeKey = buildContentKey('multiplayer', room.language, room.level, selection.meta.pool, selection.meta.key)
      rememberContentKey(compositeKey)
      const newRound = await hostStartMultiplayerRound({
        roomId: room.id,
        prompt: selection.text,
        durationSeconds: room.round_duration,
        content: selection.meta,
      })
      setRound(newRound)
      setMode('playing')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error iniciando ronda')
    } finally {
      setLoading(false)
    }
  }, [room, rememberContentKey, buildContentKey])

  const handleRoundComplete = useCallback(async (result: MultiplayerRoundResult) => {
    if (!room?.id || !round?.id || !userId) return

    setLoading(true)
    setError(null)
    try {
      await submitMultiplayerResult({
        roomId: room.id,
        roundId: round.id,
        userId,
        wpm: result.wpm,
        accuracy: result.accuracy,
        errors: result.errors,
        wordsCompleted: result.wordsCompleted,
      })

      const data = await listRoundLeaderboard(round.id)
      setLeaderboard(data)
      setMode('results')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error enviando resultado')
    } finally {
      setLoading(false)
    }
  }, [room?.id, round?.id, userId])

  if (mode === 'playing' && room && round) {
    return (
      <MultiplayerRoundScreen
        prompt={round.prompt}
        durationSeconds={round.duration_seconds}
        onComplete={handleRoundComplete}
        onBack={handleLeave}
      />
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => onNavigate('home')}>Volver</Button>
          <div className="text-[var(--foreground)] font-bold text-xl">Multijugador</div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {mode === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-[var(--foreground)] text-lg font-bold mb-2">Crear sala</h2>
              <p className="text-[var(--muted)] mb-4">Genera un PIN, comparte y empieza la ronda.</p>
              <Button onClick={handleHostCreate} disabled={loading || !userId}>
                {loading ? 'Creando…' : 'Hostear'}
              </Button>
            </Card>

            <Card className="p-6">
              <h2 className="text-[var(--foreground)] text-lg font-bold mb-2">Unirse</h2>
              <p className="text-[var(--muted)] mb-4">Ingresa el PIN de 6 dígitos.</p>
              <div className="flex gap-3">
                <input
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN (123456)"
                  className="flex-1 bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-indigo-500"
                />
                <Button onClick={handleJoin} disabled={loading || !userId}>
                  {loading ? '…' : 'Entrar'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {(mode === 'host_lobby' || mode === 'player_lobby') && room && (
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-[var(--muted)] text-sm">PIN</div>
                <div className="text-[var(--foreground)] text-3xl font-black tracking-widest">{room.pin}</div>
                <div className="text-[var(--muted)] text-sm mt-1">Jugadores: {players.length}</div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleLeave}>Salir</Button>
                {mode === 'host_lobby' && (
                  <Button onClick={handleStartRound} disabled={loading || players.length < 1}>
                    {loading ? 'Iniciando…' : 'Iniciar ronda'}
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {players.map((p) => (
                <div
                  key={p.user_id}
                  className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3"
                >
                  <div className="text-[var(--foreground)] font-semibold">{p.username}</div>
                  {p.is_host && <div className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">Host</div>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {mode === 'results' && room && round && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[var(--foreground)] text-lg font-bold">Resultados</div>
                <div className="text-[var(--muted)] text-sm">Ronda #{round.round_number}</div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleLeave}>Salir</Button>
                {room.host_id === userId && (
                  <Button onClick={handleStartRound} disabled={loading}>
                    {loading ? '…' : 'Nueva ronda'}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {leaderboard.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[var(--muted)] w-6 text-right tabular-nums">{idx + 1}</div>
                    <div className="text-[var(--foreground)] font-semibold">{players.find(p => p.user_id === s.user_id)?.username || 'Jugador'}</div>
                  </div>
                  <div className="text-[var(--foreground)] font-bold tabular-nums">{s.score}</div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="text-[var(--muted)]">Esperando resultados…</div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect, Suspense, lazy } from 'react'
import { ParticleBackground, FloatingWords } from './components'
import { useGameStore } from './store/gameStore'
import { useAuthStore } from './store/authStore'
import { useAudioStore } from './store/audioStore'
import type { Language, GameLevel } from './types'
import { supabase } from './lib/supabase'
import { useUiStore } from './store/uiStore'
import { resumeAudio, syncBackgroundMusic } from './audio/backgroundMusic'
import './App.css'

type Screen = 'auth' | 'home' | 'game' | 'ranking' | 'profile' | 'registration' | 'taptap' | 'multiplayer' | 'teacher'

const HomeScreen = lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })))
const GameScreen = lazy(() => import('./screens/GameScreen').then(m => ({ default: m.GameScreen })))
const RankingScreen = lazy(() => import('./screens/RankingScreen').then(m => ({ default: m.RankingScreen })))
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })))
const RegistrationScreen = lazy(() => import('./screens/RegistrationScreen').then(m => ({ default: m.RegistrationScreen })))
const TapTapGame = lazy(() => import('./screens/TapTapGame').then(m => ({ default: m.TapTapGame })))
const MultiplayerScreen = lazy(() => import('./screens/MultiplayerScreen').then(m => ({ default: m.MultiplayerScreen })))
const AuthScreen = lazy(() => import('./screens/AuthScreen').then(m => ({ default: m.AuthScreen })))
const TeacherScreen = lazy(() => import('./screens/TeacherScreen').then(m => ({ default: m.TeacherScreen })))

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const { language, level, gameDuration, setLanguage, setLevel, setGameDuration, resetGame } = useGameStore()
  const { theme } = useUiStore()
  const { enabled: audioEnabled, muted: audioMuted, volume: audioVolume } = useAudioStore()
  const {
    userId,
    hasRegisteredUsername,
    isLoading: authLoading,
    initializeAuth,
    setHasRegisteredUsername,
    refreshProfile
  } = useAuthStore()

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    syncBackgroundMusic({ enabled: audioEnabled, muted: audioMuted, volume: audioVolume })
  }, [audioEnabled, audioMuted, audioVolume])

  useEffect(() => {
    const handler = () => {
      void resumeAudio().finally(() => {
        syncBackgroundMusic({ enabled: audioEnabled, muted: audioMuted, volume: audioVolume })
      })
    }

    window.addEventListener('pointerdown', handler, { once: true })
    window.addEventListener('keydown', handler, { once: true })

    return () => {
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [audioEnabled, audioMuted, audioVolume])

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => {
      initializeAuth()
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [initializeAuth])

  // Verificar si necesita registro después de cargar la autenticación
  useEffect(() => {
    if (authLoading) return

    if (!userId) {
      setCurrentScreen('auth')
      return
    }

    if (currentScreen === 'registration' || currentScreen === 'auth') {
      setCurrentScreen('home')
    }
  }, [authLoading, userId, hasRegisteredUsername, currentScreen])

  const handleStartGame = () => {
    setCurrentScreen('game')
  }

  const handleStartTapTap = () => {
    setCurrentScreen('taptap')
  }

  const handleGameEnd = () => {
    resetGame()
    setCurrentScreen('home')
  }

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen)
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  const handleLevelChange = (lvl: GameLevel) => {
    setLevel(lvl)
  }

  const handleGameDurationChange = (duration: number) => {
    setGameDuration(duration)
  }

  const handleRegistrationComplete = () => {
    setHasRegisteredUsername(true)
    refreshProfile()
    setCurrentScreen('home')
  }

  // Mostrar pantalla de carga mientras se inicializa la autenticación
  if (authLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[var(--background)] overflow-hidden">
        <FloatingWords />
        <ParticleBackground isActive={false} />
        <div className="relative z-10 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--muted)]">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
      <FloatingWords />
      <ParticleBackground isActive={currentScreen === 'game'} />

      <div className="relative z-10">
        <Suspense fallback={<div className="p-6 text-zinc-400">Cargando…</div>}>
          {currentScreen === 'auth' && (
            <AuthScreen
              onContinue={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'registration' && (
            <RegistrationScreen
              onComplete={handleRegistrationComplete}
              onBack={() => setCurrentScreen('home')}
              onRecoverAccount={() => setCurrentScreen('auth')}
            />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              language={language}
              level={level}
              gameDuration={gameDuration}
              onLanguageChange={handleLanguageChange}
              onLevelChange={handleLevelChange}
              onGameDurationChange={handleGameDurationChange}
              onStartGame={handleStartGame}
              onStartTapTap={handleStartTapTap}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'game' && (
            <GameScreen
              onGameEnd={handleGameEnd}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'ranking' && (
            <RankingScreen
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              onNavigate={handleNavigate}
              onRegistrationComplete={() => {
                setHasRegisteredUsername(true)
                setCurrentScreen('home')
              }}
            />
          )}

          {currentScreen === 'taptap' && (
            <TapTapGame
              language={language}
              level={level}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'multiplayer' && (
            <MultiplayerScreen
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'teacher' && (
            <TeacherScreen
              onNavigate={handleNavigate}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}

export default App

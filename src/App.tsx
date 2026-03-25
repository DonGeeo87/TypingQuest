import { useState, useEffect, Suspense, lazy } from 'react'
import { ParticleBackground, FloatingWords } from './components'
import { useGameStore } from './store/gameStore'
import { useAuthStore } from './store/authStore'
import type { Language, GameLevel } from './types'
import './App.css'

type Screen = 'home' | 'game' | 'ranking' | 'profile' | 'registration' | 'taptap'

const HomeScreen = lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })))
const GameScreen = lazy(() => import('./screens/GameScreen').then(m => ({ default: m.GameScreen })))
const RankingScreen = lazy(() => import('./screens/RankingScreen').then(m => ({ default: m.RankingScreen })))
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })))
const RegistrationScreen = lazy(() => import('./screens/RegistrationScreen').then(m => ({ default: m.RegistrationScreen })))
const TapTapGame = lazy(() => import('./screens/TapTapGame').then(m => ({ default: m.TapTapGame })))

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const { language, level, gameDuration, setLanguage, setLevel, setGameDuration, resetGame } = useGameStore()
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

  // Verificar si necesita registro después de cargar la autenticación
  useEffect(() => {
    if (!authLoading && userId) {
      if (!hasRegisteredUsername) {
        setCurrentScreen('registration')
      } else if (currentScreen === 'registration') {
        setCurrentScreen('home')
      }
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
      <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        <FloatingWords />
        <ParticleBackground isActive={false} />
        <div className="relative z-10 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <FloatingWords />
      <ParticleBackground isActive={currentScreen === 'game'} />

      <div className="relative z-10">
        <Suspense fallback={<div className="p-6 text-zinc-400">Cargando…</div>}>
          {currentScreen === 'registration' && (
            <RegistrationScreen
              onComplete={handleRegistrationComplete}
              onBack={() => setCurrentScreen('home')}
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
        </Suspense>
      </div>
    </div>
  )
}

export default App

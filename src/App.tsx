import { useState, useEffect, Suspense, lazy } from 'react'
import { ParticleBackground, FloatingWords, Topbar, AppFooter } from './components'
import { useGameStore } from './store/gameStore'
import { useAuthStore } from './store/authStore'
import { useAudioStore } from './store/audioStore'
import { useCampaignStore } from './store/campaignStore'
import type { Language, GameLevel, WordCategory, CampaignStage } from './types'
import { supabase } from './lib/supabase'
import { useUiStore } from './store/uiStore'
import { resumeAudio, syncBackgroundMusic } from './audio/backgroundMusic'
import { t } from './i18n'
import { trackScreen } from './analytics'
import * as campaignService from './services/campaignService'
import './App.css'

type Screen = 'auth' | 'home' | 'game' | 'ranking' | 'profile' | 'registration' | 'taptap' | 'multiplayer' | 'teacher' | 'teacherGuide' | 'terms' | 'privacy' | 'support' | 'campaign' | 'campaign-game'

const HomeScreen = lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })))
const GameScreen = lazy(() => import('./screens/GameScreen').then(m => ({ default: m.GameScreen })))
const RankingScreen = lazy(() => import('./screens/RankingScreen').then(m => ({ default: m.RankingScreen })))
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })))
const RegistrationScreen = lazy(() => import('./screens/RegistrationScreen').then(m => ({ default: m.RegistrationScreen })))
const TapTapGame = lazy(() => import('./screens/TapTapGame').then(m => ({ default: m.TapTapGame })))
const MultiplayerScreen = lazy(() => import('./screens/MultiplayerScreen').then(m => ({ default: m.MultiplayerScreen })))
const AuthScreen = lazy(() => import('./screens/AuthScreen').then(m => ({ default: m.AuthScreen })))
const TeacherScreen = lazy(() => import('./screens/TeacherScreen').then(m => ({ default: m.TeacherScreen })))
const TeacherGuideScreen = lazy(() => import('./screens/TeacherGuideScreen').then(m => ({ default: m.TeacherGuideScreen })))
const TermsScreen = lazy(() => import('./screens/TermsScreen').then(m => ({ default: m.TermsScreen })))
const PrivacyScreen = lazy(() => import('./screens/PrivacyScreen').then(m => ({ default: m.PrivacyScreen })))
const SupportScreen = lazy(() => import('./screens/SupportScreen').then(m => ({ default: m.SupportScreen })))
const CampaignScreen = lazy(() => import('./screens/CampaignScreen').then(m => ({ default: m.CampaignScreen })))
const CampaignGameScreen = lazy(() => import('./screens/CampaignGameScreen').then(m => ({ default: m.CampaignGameScreen })))
const CampaignResultsScreen = lazy(() => import('./screens/CampaignResultsScreen').then(m => ({ default: m.CampaignResultsScreen })))

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [selectedCampaignStage, setSelectedCampaignStage] = useState<CampaignStage | null>(null)
  const { language, level, gameDuration, selectedCategory, setLanguage, setLevel, setGameDuration, setSelectedCategory, resetGame } = useGameStore()
  const ui = language
  const { theme } = useUiStore()
  const { enabled: audioEnabled, muted: audioMuted, volume: audioVolume } = useAudioStore()
  const { 
    loadCampaign, 
    loadProgress,
    setGameContext 
  } = useCampaignStore()
  const {
    userId,
    hasRegisteredUsername,
    isAnonymous,
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
    document.documentElement.lang = ui
  }, [ui])

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

  // Auth: sin usuario → landing. Cuenta con email sin apodo real → registro obligatorio (evita user_xxxxxxxx).
  useEffect(() => {
    if (authLoading) return

    if (!userId) {
      setCurrentScreen('auth')
      return
    }

    if (!hasRegisteredUsername && !isAnonymous) {
      const exempt: Screen[] = ['registration', 'terms', 'privacy', 'support']
      if (!exempt.includes(currentScreen)) {
        setCurrentScreen('registration')
      }
      return
    }

    if (hasRegisteredUsername && (currentScreen === 'registration' || currentScreen === 'auth')) {
      setCurrentScreen('home')
    }
  }, [authLoading, userId, hasRegisteredUsername, isAnonymous, currentScreen])

  useEffect(() => {
    trackScreen(currentScreen)
  }, [currentScreen])

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

  const handleCategoryChange = (category: WordCategory) => {
    setSelectedCategory(category)
  }

  const handleRegistrationComplete = () => {
    setHasRegisteredUsername(true)
    refreshProfile()
    setCurrentScreen('home')
  }

  const handleStartCampaign = async () => {
    if (!userId) return
    try {
      const campaign = await campaignService.getMainCampaign()
      if (campaign) {
        await loadCampaign(campaign.id)
        await loadProgress(campaign.id, userId)
        setCurrentScreen('campaign')
      }
    } catch (err) {
      console.error('Error starting campaign:', err)
    }
  }

  const handleSelectCampaignStage = (stage: CampaignStage) => {
    setSelectedCampaignStage(stage)
    setGameContext({
      campaignId: stage.campaign_id,
      stageId: stage.id,
      stageNumber: stage.stage_number,
      targetWpm: stage.required_wpm,
      targetAccuracy: stage.required_accuracy,
    })
    setCurrentScreen('campaign-game')
  }

  const handleCampaignComplete = () => {
    setSelectedCampaignStage(null)
    setCurrentScreen('campaign')
  }

  // Mostrar pantalla de carga mientras se inicializa la autenticación
  if (authLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[var(--background)] overflow-hidden">
        <FloatingWords />
        <ParticleBackground isActive={false} />
        <div className="relative z-10 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--muted)]">{t(ui, 'common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] overflow-hidden">
      <FloatingWords />
      <ParticleBackground isActive={currentScreen === 'game'} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Topbar currentScreen={currentScreen} onNavigate={handleNavigate} />

        <div className="flex-1">
          <Suspense fallback={<div className="p-6 text-[var(--muted)]">{t(ui, 'common.loading')}</div>}>
          {currentScreen === 'auth' && (
            <AuthScreen
              onContinue={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'registration' && (
            <RegistrationScreen
              lockExit={!isAnonymous && !hasRegisteredUsername}
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
              selectedCategory={selectedCategory}
              onLanguageChange={handleLanguageChange}
              onLevelChange={handleLevelChange}
              onGameDurationChange={handleGameDurationChange}
              onCategoryChange={handleCategoryChange}
              onStartGame={handleStartGame}
              onStartTapTap={handleStartTapTap}
              onStartCampaign={handleStartCampaign}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'game' && (
            <GameScreen
              onGameEnd={handleGameEnd}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'campaign' && (
            <CampaignScreen
              userId={userId || ''}
              onSelectStage={handleSelectCampaignStage}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'campaign-game' && selectedCampaignStage && (
            <CampaignGameScreen
              stage={selectedCampaignStage}
              onComplete={handleCampaignComplete}
              onBack={() => setCurrentScreen('campaign')}
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

          {currentScreen === 'teacherGuide' && (
            <TeacherGuideScreen
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'terms' && (
            <TermsScreen
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'privacy' && (
            <PrivacyScreen
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'support' && (
            <SupportScreen
              onNavigate={handleNavigate}
            />
          )}
        </Suspense>
        </div>

        <AppFooter onNavigate={handleNavigate} />
      </div>
    </div>
  )
}

export default App

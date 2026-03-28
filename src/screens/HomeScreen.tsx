import { motion } from 'framer-motion'
import { LanguageSelector, LevelSelector, CategorySelector, TimeSelector, Button, Card, TeacherTutorialModal } from '../components'
import { useAuthStore } from '../store/authStore'
import { useMobile } from '../hooks/useMobile'
import type { Language, GameLevel, WordCategory } from '../types'
import { t } from '../i18n'
import { useState } from 'react'

interface HomeScreenProps {
  language: Language
  level: GameLevel
  gameDuration: number
  selectedCategory: WordCategory
  onLanguageChange: (language: Language) => void
  onLevelChange: (level: GameLevel) => void
  onGameDurationChange: (duration: number) => void
  onCategoryChange: (category: WordCategory) => void
  onStartGame: () => void
  onStartTapTap: () => void
  onNavigate: (screen: string) => void
}

export function HomeScreen({
  language,
  level,
  gameDuration,
  selectedCategory,
  onLanguageChange,
  onLevelChange,
  onGameDurationChange,
  onCategoryChange,
  onStartGame,
  onStartTapTap,
  onNavigate,
}: HomeScreenProps) {
  const { isAnonymous } = useAuthStore()
  const isMobile = useMobile()
  const ui = language
  const [tutorialOpen, setTutorialOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl space-y-8 relative z-10"
      >
        {isAnonymous && (
          <Card className="p-4 border-amber-500/30 bg-amber-500/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-amber-600 text-sm">
                Estás jugando en modo anónimo. Si cambias de dispositivo o limpias datos, no podrás recuperar tu progreso.
              </div>
              <Button variant="secondary" onClick={() => onNavigate('profile')}>
                Vincular cuenta
              </Button>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center"
          >
            <img src="/logo.svg" width={64} height={64} alt="TypingQuest" className="w-14 h-14 md:w-16 md:h-16 drop-shadow-md" />
          </motion.div>
          <motion.h1
            initial={{ scale: 0.8, filter: 'blur(10px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-5xl md:text-7xl font-black text-gradient tracking-tight leading-tight py-1 px-2 break-words"
          >
            {t(ui, 'home.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-[var(--muted)] font-medium"
          >
            {t(ui, 'home.subtitle')}
          </motion.p>
        </div>

        {/* Main Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => onNavigate('game')} className="cursor-pointer h-full border-indigo-500/20 hover:border-indigo-500/50 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">🎮</div>
              <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{t(ui, 'home.play')}</h3>
              <p className="text-[var(--muted)] text-sm">{t(ui, 'home.playDesc')}</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => onNavigate('ranking')} className="cursor-pointer h-full border-amber-500/20 hover:border-amber-500/50 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">🏆</div>
              <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{t(ui, 'home.rankings')}</h3>
              <p className="text-[var(--muted)] text-sm">{t(ui, 'home.rankingsDesc')}</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => onNavigate('multiplayer')} className="cursor-pointer h-full border-emerald-500/20 hover:border-emerald-500/50 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">🧩</div>
              <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{t(ui, 'home.multiplayer')}</h3>
              <p className="text-[var(--muted)] text-sm">{t(ui, 'home.multiplayerDesc')}</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => onNavigate('profile')} className="cursor-pointer h-full border-violet-500/20 hover:border-violet-500/50 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">👤</div>
              <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{t(ui, 'home.profile')}</h3>
              <p className="text-[var(--muted)] text-sm">{t(ui, 'home.profileDesc')}</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => onNavigate('teacher')} className="cursor-pointer h-full border-sky-500/20 hover:border-sky-500/50 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">🎓</div>
              <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{t(ui, 'home.teacher')}</h3>
              <p className="text-[var(--muted)] text-sm">{t(ui, 'home.teacherDesc')}</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => setTutorialOpen(true)} className="cursor-pointer h-full border-indigo-500/20 hover:border-indigo-500/50 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">🧑‍🏫</div>
              <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{t(ui, 'tutorial.open')}</h3>
              <p className="text-[var(--muted)] text-sm">{t(ui, 'teacherGuide.stepsTitle')}</p>
            </Card>
          </motion.div>
        </div>

        {/* Game Setup Section - Full Width Refactor */}
        <Card className="p-8 space-y-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-9xl font-black italic">CONFIG</div>
          <h2 className="text-3xl font-black text-[var(--foreground)] flex items-center gap-3">
            <span className="w-8 h-1 bg-indigo-500 inline-block"></span>
            {t(ui, 'home.gameSetup')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Language Selection */}
            <div className="space-y-4">
              <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">{t(ui, 'home.practiceLanguage')}</label>
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={onLanguageChange}
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-4">
              <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">{t(ui, 'home.challengeDuration')}</label>
              <TimeSelector
                selectedTime={gameDuration}
                onTimeChange={onGameDurationChange}
              />
            </div>
          </div>

          {/* Level Selection - FULL WIDTH */}
          <div className="space-y-4 border-t border-[var(--card-border)] pt-8">
            <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">{t(ui, 'home.difficultyLevel')}</label>
            <LevelSelector
              selectedLevel={level}
              onLevelChange={(lvl) => onLevelChange(lvl as GameLevel)}
            />
          </div>

          {/* Category Selection - FULL WIDTH */}
          <div className="space-y-4 border-t border-[var(--card-border)] pt-8">
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              language={language}
            />
          </div>

          {/* Start Button */}
          <div className="space-y-4 pt-4">
            {/* Botón TapTap para móviles */}
            {isMobile && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
                <Button
                  onClick={onStartTapTap}
                  variant="accent"
                  className="px-20 py-5 text-xl font-black w-full shadow-2xl shadow-amber-500/30 rounded-2xl relative overflow-hidden group bg-gradient-to-r from-amber-600 to-orange-600"
                >
                  <span className="relative z-10">👆 TapTap {language === 'en' ? 'English' : 'Español'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </motion.div>
            )}

            {/* Botón Clásico */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
              <Button
                onClick={onStartGame}
                variant="accent"
                className="px-20 py-5 text-xl font-black w-full shadow-2xl shadow-indigo-500/30 rounded-2xl relative overflow-hidden group"
              >
                <span className="relative z-10">⌨️ {isMobile ? 'Modo Clásico (Teclado)' : '¡EMPEZAR A TIPEAR!'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </motion.div>

            {isMobile && (
              <p className="text-center text-xs text-[var(--muted)]">
                💡 Tip: TapTap es más fácil de usar en móviles
              </p>
            )}
          </div>
        </Card>

        {/* Features Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pb-12 pt-4">
          <div className="glass p-4 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-1">⚡</div>
            <div className="text-[var(--foreground)] text-xs font-black uppercase tracking-tighter">WPM Tracking</div>
          </div>
          <div className="glass p-4 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-[var(--foreground)] text-xs font-black uppercase tracking-tighter">Accuracy</div>
          </div>
          <div className="glass p-4 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-[var(--foreground)] text-xs font-black uppercase tracking-tighter">Combos</div>
          </div>
          <div className="glass p-4 rounded-2xl backdrop-blur-sm">
            <div className="text-3xl mb-1">🌐</div>
            <div className="text-[var(--foreground)] text-xs font-black uppercase tracking-tighter">Bilingual</div>
          </div>
        </div>
      </motion.div>

      <TeacherTutorialModal
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        onOpenGuide={() => {
          setTutorialOpen(false)
          onNavigate('teacherGuide')
        }}
      />
    </div>
  )
}

import { motion } from 'framer-motion'
import { LanguageSelector, LevelSelector, CategorySelector, TimeSelector, Button, Card, TeacherTutorialModal, CampaignInfoModal } from '../components'
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
  onStartCampaign: () => void
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
  onStartCampaign,
  onNavigate,
}: HomeScreenProps) {
  const { isAnonymous } = useAuthStore()
  const isMobile = useMobile()
  const ui = language
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [campaignModalOpen, setCampaignModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl space-y-4 md:space-y-8 relative z-10"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Card onClick={() => onNavigate('game')} className="cursor-pointer h-full border-indigo-500/20 hover:border-indigo-500/50 transition-all group py-4 px-3">
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">🎮</div>
              <h3 className="text-sm font-black text-[var(--foreground)] mb-1">{t(ui, 'home.play')}</h3>
            </Card>
          </motion.div>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Card onClick={() => onNavigate('ranking')} className="cursor-pointer h-full border-amber-500/20 hover:border-amber-500/50 transition-all group py-4 px-3">
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">🏆</div>
              <h3 className="text-sm font-black text-[var(--foreground)] mb-1">{t(ui, 'home.rankings')}</h3>
            </Card>
          </motion.div>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Card onClick={() => onNavigate('multiplayer')} className="cursor-pointer h-full border-emerald-500/20 hover:border-emerald-500/50 transition-all group py-4 px-3">
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">🧩</div>
              <h3 className="text-sm font-black text-[var(--foreground)] mb-1">{t(ui, 'home.multiplayer')}</h3>
            </Card>
          </motion.div>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Card onClick={() => onNavigate('profile')} className="cursor-pointer h-full border-violet-500/20 hover:border-violet-500/50 transition-all group py-4 px-3">
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">👤</div>
              <h3 className="text-sm font-black text-[var(--foreground)] mb-1">{t(ui, 'home.profile')}</h3>
            </Card>
          </motion.div>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Card onClick={() => onNavigate('teacher')} className="cursor-pointer h-full border-sky-500/20 hover:border-sky-500/50 transition-all group py-4 px-3">
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">🎓</div>
              <h3 className="text-sm font-black text-[var(--foreground)] mb-1">{t(ui, 'home.teacher')}</h3>
            </Card>
          </motion.div>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Card onClick={() => setTutorialOpen(true)} className="cursor-pointer h-full border-indigo-500/20 hover:border-indigo-500/50 transition-all group py-4 px-3">
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">🧑‍🏫</div>
              <h3 className="text-sm font-black text-[var(--foreground)] mb-1">{t(ui, 'tutorial.open')}</h3>
            </Card>
          </motion.div>
        </div>

        {/* Game Setup Section - Full Width Refactor */}
        <Card className="p-4 md:p-6 space-y-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-9xl font-black italic">CONFIG</div>
          <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] flex items-center gap-3">
            <span className="w-8 h-1 bg-indigo-500 inline-block"></span>
            {t(ui, 'home.gameSetup')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Selection */}
            <div className="space-y-3">
              <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">{t(ui, 'home.practiceLanguage')}</label>
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={onLanguageChange}
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">{t(ui, 'home.challengeDuration')}</label>
              <TimeSelector
                selectedTime={gameDuration}
                onTimeChange={onGameDurationChange}
              />
            </div>
          </div>

          {/* Level Selection - FULL WIDTH */}
          <div className="space-y-3 border-t border-[var(--card-border)] pt-6">
            <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">{t(ui, 'home.difficultyLevel')}</label>
            <LevelSelector
              selectedLevel={level}
              onLevelChange={(lvl) => onLevelChange(lvl as GameLevel)}
            />
          </div>

          {/* Category Selection - FULL WIDTH */}
          <div className="space-y-3 border-t border-[var(--card-border)] pt-6">
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              language={language}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Mobile: Classic + TapTap on same row */}
            {isMobile ? (
              <div className="flex gap-2">
                <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    onClick={onStartGame}
                    variant="accent"
                    className="py-3 text-sm font-bold w-full shadow-lg shadow-indigo-500/20 rounded-xl relative overflow-hidden group h-auto"
                  >
                    <span className="relative z-10">⌨️ {t(ui, 'home.mobileClassic')}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    onClick={onStartTapTap}
                    variant="accent"
                    className="py-3 text-sm font-bold w-full shadow-lg shadow-amber-500/20 rounded-xl relative overflow-hidden group h-auto bg-gradient-to-r from-amber-600 to-orange-600"
                  >
                    <span className="relative z-10">👆 TapTap</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>
                </motion.div>
              </div>
            ) : (
              /* Desktop: Classic full width, TapTap hidden */
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button
                  onClick={onStartGame}
                  variant="accent"
                  className="px-8 py-4 text-base font-bold w-full shadow-lg shadow-indigo-500/20 rounded-xl relative overflow-hidden group h-auto"
                >
                  <span className="relative z-10">⌨️ {t(ui, 'home.startTyping')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </motion.div>
            )}

            {/* Campaign button — hidden on mobile, desktop only */}
            {!isMobile && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button
                  onClick={() => setCampaignModalOpen(true)}
                  variant="accent"
                  className="py-3 text-sm font-bold w-full shadow-lg shadow-purple-500/20 rounded-xl relative overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 h-auto"
                >
                  <span className="relative z-10">⚔️ {t(ui, 'home.campaign')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </motion.div>
            )}
          </div>
        </Card>

        {/* Features Footer — compact on mobile */}
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-4 text-center pb-8 md:pb-12 pt-2">
          <div className="glass py-2 px-1 rounded-xl backdrop-blur-sm">
            <div className="text-xl md:text-2xl mb-0.5">⚡</div>
            <div className="text-[var(--foreground)] text-[10px] md:text-xs font-bold uppercase tracking-tight">{t(ui, 'home.featureWpm')}</div>
          </div>
          <div className="glass py-2 px-1 rounded-xl backdrop-blur-sm">
            <div className="text-xl md:text-2xl mb-0.5">🎯</div>
            <div className="text-[var(--foreground)] text-[10px] md:text-xs font-bold uppercase tracking-tight">{t(ui, 'home.featureAccuracy')}</div>
          </div>
          <div className="glass py-2 px-1 rounded-xl backdrop-blur-sm">
            <div className="text-xl md:text-2xl mb-0.5">🔥</div>
            <div className="text-[var(--foreground)] text-[10px] md:text-xs font-bold uppercase tracking-tight">{t(ui, 'home.featureCombo')}</div>
          </div>
          <div className="glass py-2 px-1 rounded-xl backdrop-blur-sm">
            <div className="text-xl md:text-2xl mb-0.5">🌐</div>
            <div className="text-[var(--foreground)] text-[10px] md:text-xs font-bold uppercase tracking-tight">{t(ui, 'home.featureBilingual')}</div>
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

      <CampaignInfoModal
        open={campaignModalOpen}
        language={language}
        onClose={() => setCampaignModalOpen(false)}
        onStart={() => {
          setCampaignModalOpen(false)
          onStartCampaign()
        }}
      />
    </div>
  )
}

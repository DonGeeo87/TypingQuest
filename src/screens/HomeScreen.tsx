import { motion } from 'framer-motion'
import { LanguageSelector, LevelSelector, TimeSelector, Button, Card, AudioToggle } from '../components'
import { useAuthStore } from '../store/authStore'
import { useMobile } from '../hooks/useMobile'
import type { Language, GameLevel } from '../types'

interface HomeScreenProps {
  language: Language
  level: GameLevel
  gameDuration: number
  onLanguageChange: (language: Language) => void
  onLevelChange: (level: GameLevel) => void
  onGameDurationChange: (duration: number) => void
  onStartGame: () => void
  onStartTapTap: () => void
  onNavigate: (screen: string) => void
}

export function HomeScreen({
  language,
  level,
  gameDuration,
  onLanguageChange,
  onLevelChange,
  onGameDurationChange,
  onStartGame,
  onStartTapTap,
  onNavigate,
}: HomeScreenProps) {
  const { profile } = useAuthStore()
  const isMobile = useMobile()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl space-y-8 relative z-10"
      >
        {/* User Badge - Top Bar */}
        <div className="flex justify-between items-center bg-zinc-900/40 backdrop-blur-md p-3 px-6 rounded-full border border-white/10 shadow-2xl">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => onNavigate('profile')}
          >
            <div className="relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 text-xl">👤</div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-base font-bold leading-tight group-hover:text-indigo-300 transition-colors">
                {profile?.username || 'Invitado'}
              </span>
              <span className="text-indigo-400 text-[10px] uppercase tracking-widest font-black">Nivel 1 • Ver Perfil</span>
            </div>
          </motion.div>

          {/* Audio Toggle */}
          <AudioToggle position="static" compact={true} />
        </div>

        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <motion.h1
            initial={{ scale: 0.8, filter: 'blur(10px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-6xl md:text-8xl font-black text-gradient tracking-tighter"
          >
            TypingQuest
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-zinc-400 font-medium"
          >
            Master units of speed & precision 🚀
          </motion.p>
        </div>

        {/* Main Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => onNavigate('game')} className="cursor-pointer h-full border-indigo-500/20 hover:border-indigo-500/50 transition-all bg-zinc-900/60 backdrop-blur-sm group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">🎮</div>
              <h3 className="text-2xl font-black text-white mb-2">Play Game</h3>
              <p className="text-zinc-400 text-sm">Challenge yourself and climb the tiers</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => onNavigate('ranking')} className="cursor-pointer h-full border-amber-500/20 hover:border-amber-500/50 transition-all bg-zinc-900/60 backdrop-blur-sm group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">🏆</div>
              <h3 className="text-2xl font-black text-white mb-2">Rankings</h3>
              <p className="text-zinc-400 text-sm">The world's fastest typists are here</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => onNavigate('profile')} className="cursor-pointer h-full border-violet-500/20 hover:border-violet-500/50 transition-all bg-zinc-900/60 backdrop-blur-sm group">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">👤</div>
              <h3 className="text-2xl font-black text-white mb-2">Profile</h3>
              <p className="text-zinc-400 text-sm">Track your progress and unlocks</p>
            </Card>
          </motion.div>
        </div>

        {/* Game Setup Section - Full Width Refactor */}
        <Card className="p-8 space-y-8 bg-zinc-900/80 backdrop-blur-md border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-9xl font-black italic">CONFIG</div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-indigo-500 inline-block"></span>
            Configuración de Partida
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Language Selection */}
            <div className="space-y-4">
              <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">Idioma de Práctica</label>
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={onLanguageChange}
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-4">
              <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">Duración del Desafío</label>
              <TimeSelector
                selectedTime={gameDuration}
                onTimeChange={onGameDurationChange}
              />
            </div>
          </div>

          {/* Level Selection - FULL WIDTH */}
          <div className="space-y-4 border-t border-white/5 pt-8">
            <label className="text-indigo-400 text-xs font-black uppercase tracking-widest">Nivel de Dificultad</label>
            <LevelSelector
              selectedLevel={level}
              onLevelChange={(lvl) => onLevelChange(lvl as GameLevel)}
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
              <p className="text-center text-xs text-zinc-500">
                💡 Tip: TapTap es más fácil de usar en móviles
              </p>
            )}
          </div>
        </Card>

        {/* Features Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pb-12 pt-4">
          <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
            <div className="text-3xl mb-1">⚡</div>
            <div className="text-white text-xs font-black uppercase tracking-tighter">WPM Tracking</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-white text-xs font-black uppercase tracking-tighter">Accuracy</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-white text-xs font-black uppercase tracking-tighter">Combos</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
            <div className="text-3xl mb-1">🌐</div>
            <div className="text-white text-xs font-black uppercase tracking-tighter">Bilingual</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

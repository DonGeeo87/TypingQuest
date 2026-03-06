import { motion } from 'framer-motion'
import { LanguageSelector, LevelSelector, TimeSelector, Button, Card, AudioToggle } from '../components'
import type { Language, GameLevel } from '../types'

interface HomeScreenProps {
  language: Language
  level: GameLevel
  gameDuration: number
  onLanguageChange: (language: Language) => void
  onLevelChange: (level: GameLevel) => void
  onGameDurationChange: (duration: number) => void
  onStartGame: () => void
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
  onNavigate,
}: HomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-5xl md:text-7xl font-bold text-gradient"
          >
            TypingQuest
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-zinc-400"
          >
            Master typing in English & Español 🚀
          </motion.p>
        </div>

        {/* Audio Toggle en el header */}
        <div className="flex justify-end">
          <AudioToggle position="top-right" compact={true} />
        </div>

        {/* Main Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card onClick={() => onNavigate('game')} className="cursor-pointer">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-xl font-bold text-white mb-2">Play Game</h3>
              <p className="text-zinc-400 text-sm">Practice and improve your typing speed</p>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card onClick={() => onNavigate('ranking')} className="cursor-pointer">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-white mb-2">Rankings</h3>
              <p className="text-zinc-400 text-sm">Compete with players worldwide</p>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card onClick={() => onNavigate('profile')} className="cursor-pointer">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-xl font-bold text-white mb-2">Profile</h3>
              <p className="text-zinc-400 text-sm">View your stats and achievements</p>
            </Card>
          </motion.div>
        </div>

        {/* Game Setup */}
        <Card className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Game Setup</h2>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-zinc-400 text-sm">Select Language</label>
            <LanguageSelector
              selectedLanguage={language}
              onLanguageChange={onLanguageChange}
            />
          </div>

          {/* Level Selection */}
          <div className="space-y-2">
            <label className="text-zinc-400 text-sm">Select Level</label>
            <LevelSelector
              selectedLevel={level}
              onLevelChange={(lvl) => onLevelChange(lvl as GameLevel)}
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-zinc-400 text-sm">Select Time</label>
            <TimeSelector
              selectedTime={gameDuration}
              onTimeChange={onGameDurationChange}
            />
          </div>

          {/* Start Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onStartGame}
              variant="accent"
              className="px-12 py-4 text-lg font-bold"
            >
              🚀 Start Typing!
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl">⚡</div>
            <div className="text-white font-semibold">WPM Tracking</div>
            <div className="text-xs text-zinc-400">Measure your speed</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl">🎯</div>
            <div className="text-white font-semibold">Accuracy</div>
            <div className="text-xs text-zinc-400">Improve precision</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl">🔥</div>
            <div className="text-white font-semibold">Combos</div>
            <div className="text-xs text-zinc-400">Build streaks</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl">🌐</div>
            <div className="text-white font-semibold">Bilingual</div>
            <div className="text-xs text-zinc-400">EN & ES support</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

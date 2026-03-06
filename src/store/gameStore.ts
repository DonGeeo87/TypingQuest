import { create } from 'zustand'
import type { GameState, GameStatus, Language, GameLevel } from '../types'

interface GameStore extends GameState {
  // Actions
  setLanguage: (language: Language) => void
  setLevel: (level: GameLevel) => void
  setStatus: (status: GameStatus) => void
  setCurrentText: (text: string) => void
  setCurrentIndex: (index: number) => void
  addTypedChar: (char: string, isCorrect: boolean) => void
  incrementError: () => void
  updateCombo: (isCorrect: boolean) => void
  setStartTime: (time: number) => void
  setEndTime: (time: number) => void
  calculateStats: () => void
  resetGame: () => void
  initializeGame: (text: string, language: Language, level: GameLevel) => void
  decrementTime: () => void
  setGameDuration: (duration: number) => void
  incrementWordsCompleted: () => void
}

const initialState: GameState = {
  language: 'en',
  level: 1,
  status: 'idle',
  currentText: '',
  currentIndex: 0,
  typedChars: [],
  correctChars: 0,
  incorrectChars: 0,
  errors: 0,
  combo: 0,
  maxCombo: 0,
  startTime: null,
  endTime: null,
  wpm: 0,
  accuracy: 100,
  gameDuration: 60,
  timeRemaining: 60,
  wordsCompleted: 0,
  totalWords: 0,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setLanguage: (language) => set({ language }),

  setLevel: (level) => set({ level }),

  setStatus: (status) => set({ status }),

  setCurrentText: (text) => set({ currentText: text, currentIndex: 0, typedChars: [] }),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  addTypedChar: (char, isCorrect) => {
    const state = get()
    set({
      typedChars: [...state.typedChars, char],
      correctChars: isCorrect ? state.correctChars + 1 : state.correctChars,
      incorrectChars: !isCorrect ? state.incorrectChars + 1 : state.incorrectChars,
    })
  },

  incrementError: () => set((state) => ({ errors: state.errors + 1, combo: 0 })),

  updateCombo: (isCorrect) => {
    const state = get()
    if (isCorrect) {
      const newCombo = state.combo + 1
      set({ combo: newCombo, maxCombo: Math.max(newCombo, state.maxCombo) })
    } else {
      set({ combo: 0 })
    }
  },

  setStartTime: (time) => set({ startTime: time }),

  setEndTime: (time) => set({ endTime: time }),

  calculateStats: () => {
    const state = get()
    if (!state.startTime || !state.endTime) return

    const timeInMinutes = (state.endTime - state.startTime) / 60000
    const wordsTyped = state.typedChars.length / 5 // Standard: 5 chars = 1 word

    const wpm = Math.round(wordsTyped / timeInMinutes) || 0
    const totalChars = state.correctChars + state.incorrectChars
    const accuracy = totalChars > 0
      ? Math.round((state.correctChars / totalChars) * 100 * 100) / 100
      : 100

    set({ wpm, accuracy })
  },

  resetGame: () => {
    const state = get()
    set({
      ...initialState,
      gameDuration: state.gameDuration,
    })
  },

  initializeGame: (text, language, level) => {
    const state = get()
    // Count words in text (split by spaces)
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length
    
    set({
      currentText: text,
      language,
      level,
      status: 'idle',
      currentIndex: 0,
      typedChars: [],
      correctChars: 0,
      incorrectChars: 0,
      errors: 0,
      combo: 0,
      maxCombo: 0,
      startTime: null,
      endTime: null,
      wpm: 0,
      accuracy: 100,
      timeRemaining: state.gameDuration,
      wordsCompleted: 0,
      totalWords: wordCount,
    })
  },

  decrementTime: () => {
    const state = get()
    if (state.timeRemaining > 0) {
      set({ timeRemaining: state.timeRemaining - 1 })
    }
  },

  setGameDuration: (duration) => set({ 
    gameDuration: duration,
    timeRemaining: duration,
  }),

  incrementWordsCompleted: () => {
    const state = get()
    set({ wordsCompleted: state.wordsCompleted + 1 })
  },
}))

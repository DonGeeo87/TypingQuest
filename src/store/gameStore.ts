import { create } from 'zustand'
import type { GameState, GameStatus, Language, GameLevel, WordCategory } from '../types'

interface GameStore extends GameState {
  selectedCategory: WordCategory
  // Actions
  setLanguage: (language: Language) => void
  setLevel: (level: GameLevel) => void
  setSelectedCategory: (category: WordCategory) => void
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
  incrementWordsCompletedBy: (amount: number) => void
  resetCurrentPhrase: () => void
  advanceToNextText: (text: string) => void
  setAssignmentId: (assignmentId: string | null) => void
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
  totalCorrectChars: 0,
  totalTypedChars: 0,
  assignmentId: null,
}

const gameStoreInitialState = {
  selectedCategory: 'general' as WordCategory,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  ...gameStoreInitialState,

  setLanguage: (language) => set({ language }),

  setLevel: (level) => set({ level }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setStatus: (status) => set({ status }),

  setCurrentText: (text) => set({ currentText: text, currentIndex: 0, typedChars: [] }),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  addTypedChar: (char, isCorrect) => {
    const state = get()
    set({
      typedChars: [...state.typedChars, char],
      correctChars: isCorrect ? state.correctChars + 1 : state.correctChars,
      incorrectChars: !isCorrect ? state.incorrectChars + 1 : state.incorrectChars,
      totalCorrectChars: isCorrect ? state.totalCorrectChars + 1 : state.totalCorrectChars,
      totalTypedChars: state.totalTypedChars + 1,
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
    // Usar totalCorrectChars para que no se pierda al resetear frase
    const wordsTyped = state.totalCorrectChars / 5

    const wpm = Math.max(0, Math.round(wordsTyped / timeInMinutes)) || 0
    // Precisión basada en el histórico de todos los intentos
    const accuracy = state.totalTypedChars > 0
      ? Math.round((state.totalCorrectChars / state.totalTypedChars) * 100 * 100) / 100
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
      totalCorrectChars: 0,
      totalTypedChars: 0,
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

  incrementWordsCompletedBy: (amount) => {
    const state = get()
    set({ wordsCompleted: state.wordsCompleted + amount })
  },

  resetCurrentPhrase: () => {
    set({ currentIndex: 0, typedChars: [] })
  },

  advanceToNextText: (text) => {
    const state = get()
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length
    set({
      currentText: text,
      currentIndex: 0,
      typedChars: [],
      totalWords: state.totalWords + wordCount
    })
  },

  setAssignmentId: (assignmentId) => set({ assignmentId }),
}))

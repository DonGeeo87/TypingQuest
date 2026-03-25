import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameScreen } from './GameScreen'
import { useGameStore } from '../store/gameStore'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('GameScreen', () => {
  it('no recalcula WPM en estado finished', () => {
    const now = Date.now()
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')

    useGameStore.setState({
      status: 'finished',
      language: 'en',
      level: 1,
      currentText: 'hello world',
      currentIndex: 0,
      typedChars: [],
      errors: 0,
      combo: 0,
      maxCombo: 0,
      startTime: now - 60000,
      endTime: now,
      wpm: 50,
      accuracy: 90,
      gameDuration: 60,
      timeRemaining: 0,
      wordsCompleted: 10,
      totalWords: 10,
      totalCorrectChars: 250,
      totalTypedChars: 300,
    })

    render(<GameScreen onGameEnd={() => {}} onNavigate={() => {}} />)

    expect(screen.getAllByText('WPM')[0]).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()

    vi.advanceTimersByTime(10000)
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(setIntervalSpy).not.toHaveBeenCalledWith(expect.any(Function), 1000)
  })
})


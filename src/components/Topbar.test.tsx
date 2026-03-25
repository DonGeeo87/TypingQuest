import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Topbar } from './Topbar'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import { useUiStore } from '../store/uiStore'

beforeEach(() => {
  useAuthStore.setState({ profile: null, isAnonymous: false })
  useGameStore.setState({ language: 'en' })
  useUiStore.setState({ theme: 'dark' })
})

describe('Topbar', () => {
  it('renderiza logo y navega al hacer click', async () => {
    useAuthStore.setState({
      isAnonymous: false,
      profile: {
        id: '00000000-0000-0000-0000-000000000000',
        username: 'Ana',
        total_games: 0,
        total_wins: 0,
        best_wpm: 0,
        best_accuracy: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })

    const onNavigate = vi.fn()
    render(<Topbar currentScreen="home" onNavigate={onNavigate} />)

    expect(screen.getByAltText('TypingQuest')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Teacher' }))
    expect(onNavigate).toHaveBeenCalledWith('teacher')
  })
})


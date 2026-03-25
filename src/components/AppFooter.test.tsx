import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppFooter } from './AppFooter'
import { useGameStore } from '../store/gameStore'

beforeEach(() => {
  useGameStore.setState({ language: 'en' })
})

describe('AppFooter', () => {
  it('navega a términos', async () => {
    const onNavigate = vi.fn()
    render(<AppFooter onNavigate={onNavigate} />)
    await userEvent.click(screen.getByRole('button', { name: 'Terms' }))
    expect(onNavigate).toHaveBeenCalledWith('terms')
  })
})


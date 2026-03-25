import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeacherScreen } from './TeacherScreen'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'

beforeEach(() => {
  useGameStore.setState({ language: 'en' })
  useAuthStore.setState({ userId: 'local_123', isAnonymous: true, profile: null })
})

describe('TeacherScreen', () => {
  it('muestra aviso si la sesión es local/offline y deshabilita acciones', () => {
    const onNavigate = vi.fn()
    render(<TeacherScreen onNavigate={onNavigate} />)

    expect(screen.getByText('Teacher Mode')).toBeInTheDocument()
    expect(screen.getByText(/necesitas iniciar sesión/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Join' })).toBeDisabled()
  })
})


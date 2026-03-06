import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentUser, signInAnonymously } from '../lib/supabase'
import { getProfile, hasUsername } from '../services/supabaseService'
import type { Profile } from '../types'

interface AuthState {
  userId: string | null
  profile: Profile | null
  hasRegisteredUsername: boolean
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  initializeAuth: () => Promise<void>
  signInAnonymously: () => Promise<void>
  setProfile: (profile: Profile | null) => void
  setHasRegisteredUsername: (hasUsername: boolean) => void
  refreshProfile: () => Promise<void>
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      profile: null,
      hasRegisteredUsername: false,
      isLoading: true,
      isAuthenticated: false,

      initializeAuth: async () => {
        set({ isLoading: true })

        try {
          let userId = await getCurrentUser()

          // Si no hay usuario, iniciar sesión anónimamente
          if (!userId) {
            userId = await signInAnonymously()
          }

          if (userId) {
            // Obtener perfil y verificar si tiene username
            const [profile, userHasUsername] = await Promise.all([
              getProfile(userId),
              hasUsername(userId)
            ])

            set({
              userId,
              profile,
              hasRegisteredUsername: userHasUsername,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({
              userId: null,
              profile: null,
              hasRegisteredUsername: false,
              isAuthenticated: false,
              isLoading: false
            })
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({
            userId: null,
            profile: null,
            hasRegisteredUsername: false,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      signInAnonymously: async () => {
        set({ isLoading: true })

        try {
          const userId = await signInAnonymously()

          if (userId) {
            const [profile, userHasUsername] = await Promise.all([
              getProfile(userId),
              hasUsername(userId)
            ])

            set({
              userId,
              profile,
              hasRegisteredUsername: userHasUsername,
              isAuthenticated: true,
              isLoading: false
            })
          }
        } catch (error) {
          console.error('Error signing in anonymously:', error)
          set({ isLoading: false })
        }
      },

      setProfile: (profile) => {
        set({ profile })
      },

      setHasRegisteredUsername: (hasUsername) => {
        set({ hasRegisteredUsername: hasUsername })
      },

      refreshProfile: async () => {
        const { userId } = get()
        if (!userId) return

        try {
          const [profile, userHasUsername] = await Promise.all([
            getProfile(userId),
            hasUsername(userId)
          ])

          set({
            profile,
            hasRegisteredUsername: userHasUsername
          })
        } catch (error) {
          console.error('Error refreshing profile:', error)
        }
      },

      signOut: () => {
        set({
          userId: null,
          profile: null,
          hasRegisteredUsername: false,
          isAuthenticated: false
        })
      }
    }),
    {
      name: 'typingquest-auth',
      partialize: (state) => ({
        hasRegisteredUsername: state.hasRegisteredUsername,
        userId: state.userId
      })
    }
  )
)

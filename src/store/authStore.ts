import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getAuthUser, signInAnonymously } from '../lib/supabase'
import { getProfile, hasUsername } from '../services/supabaseService'
import { log } from '../utils/logger'
import type { Profile } from '../types'

interface AuthState {
  userId: string | null
  profile: Profile | null
  hasRegisteredUsername: boolean
  isLoading: boolean
  isAuthenticated: boolean
  email: string | null
  isAnonymous: boolean

  // Actions
  initializeAuth: () => Promise<void>
  signInAnonymously: () => Promise<void>
  signInWithEmailInstant: (email: string) => Promise<void>
  setProfile: (profile: Profile | null) => void
  setHasRegisteredUsername: (hasUsername: boolean) => void
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      profile: null,
      hasRegisteredUsername: false,
      isLoading: true,
      isAuthenticated: false,
      email: null,
      isAnonymous: false,

      initializeAuth: async () => {
        set({ isLoading: true })

        try {
          const user = await getAuthUser()
          const userId = user?.id ?? null

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
              email: user?.email ?? null,
              isAnonymous: Boolean(user?.is_anonymous),
              isLoading: false
            })
          } else {
            set({
              userId: null,
              profile: null,
              hasRegisteredUsername: false,
              isAuthenticated: false,
              email: null,
              isAnonymous: false,
              isLoading: false
            })
          }
        } catch (error) {
          log.error('Error initializing auth:', error)
          set({
            userId: null,
            profile: null,
            hasRegisteredUsername: false,
            isAuthenticated: false,
            email: null,
            isAnonymous: false,
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
              email: null,
              isAnonymous: true,
              isLoading: false
            })
          }
        } catch (error) {
          log.error('Error signing in anonymously:', error)
          set({ isLoading: false })
        }
      },

      signInWithEmailInstant: async (email: string) => {
        set({ isLoading: true })

        try {
          // Check if a profile already exists with this email
          const existingProfile = await getProfile(email)
          if (existingProfile) {
            // User already has a profile, link to existing account
            const userHasUsername = await hasUsername(existingProfile.id)
            set({
              userId: existingProfile.id,
              profile: existingProfile,
              hasRegisteredUsername: userHasUsername,
              isAuthenticated: true,
              email,
              isAnonymous: false,
              isLoading: false
            })
            return
          }

          // Create/get anonymous user
          const userId = await signInAnonymously()

          if (userId) {
            // Email is stored in auth state, not in profile table

            const [profile, userHasUsername] = await Promise.all([
              getProfile(userId),
              hasUsername(userId)
            ])

            set({
              userId,
              profile,
              hasRegisteredUsername: userHasUsername,
              isAuthenticated: true,
              email,
              isAnonymous: true,
              isLoading: false
            })
          }
        } catch (error) {
          log.error('Error signing in with instant email:', error)
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
          log.error('Error refreshing profile:', error)
        }
      },

      signOut: async () => {
        // Limpiar el localStorage del store
        localStorage.removeItem('typingquest-auth')

        // Limpiar sessionStorage
        sessionStorage.removeItem('typingquest-local-userid')

        // Limpiar el estado
        set({
          userId: null,
          profile: null,
          hasRegisteredUsername: false,
          isAuthenticated: false,
          email: null,
          isAnonymous: false,
          isLoading: false
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

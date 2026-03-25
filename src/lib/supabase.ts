import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import { log } from '../utils/logger'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://invalid.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'invalid'
)

export async function getAuthUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser()
    return data.user ?? null
  } catch {
    return null
  }
}

export async function signInAnonymously(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      log.warn('Supabase auth falló, usando fallback local:', error.message)
      return generateLocalUserId()
    }
    return data.user?.id || generateLocalUserId()
  } catch (err) {
    log.warn('Error inesperado en Supabase, usando fallback local:', err)
    return generateLocalUserId()
  }
}

function generateLocalUserId(): string {
  const localId = 'local_' + crypto.randomUUID().replace(/-/g, '').slice(0, 8)
  sessionStorage.setItem('typingquest-local-userid', localId)
  log.debug('[Supabase] Usuario local generado:', localId)
  return localId
}

export async function getCurrentUser(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser()
    if (data.user?.id) {
      return data.user.id
    }
  } catch {
    // Ignorar errores y intentar fallback local
  }

  // Fallback: verificar si hay un ID local en sessionStorage
  const localId = sessionStorage.getItem('typingquest-local-userid')
  return localId || null
}

export async function signInWithEmailMagicLink(email: string, emailRedirectTo?: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser: true,
    },
  })

  if (error) throw error
}

export async function linkEmailToCurrentUser(email: string, emailRedirectTo?: string): Promise<void> {
  const { error } = await supabase.auth.updateUser(
    { email },
    emailRedirectTo ? { emailRedirectTo } : undefined
  )
  if (error) throw error
}

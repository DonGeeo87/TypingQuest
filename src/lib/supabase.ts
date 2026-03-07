import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signInAnonymously(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.warn('Supabase auth falló, usando fallback local:', error.message)
      return generateLocalUserId()
    }
    return data.user?.id || generateLocalUserId()
  } catch (err) {
    console.warn('Error inesperado en Supabase, usando fallback local:', err)
    return generateLocalUserId()
  }
}

function generateLocalUserId(): string {
  const localId = 'local_' + crypto.randomUUID().replace(/-/g, '').slice(0, 8)
  sessionStorage.setItem('typingquest-local-userid', localId)
  console.log('[Supabase] Usuario local generado:', localId)
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

import { supabase, isSupabaseConfigured } from '../lib/supabase'

export async function createLead(params: { email: string; source: string }) {
  const email = params.email.trim().toLowerCase()
  if (!email) throw new Error('Email requerido')

  if (!isSupabaseConfigured) {
    const key = 'typingquest-leads'
    const raw = localStorage.getItem(key)
    const list: Array<{ email: string; source: string; createdAt: string }> = raw ? JSON.parse(raw) : []
    list.unshift({ email, source: params.source, createdAt: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)))
    return
  }

  const { error } = await supabase
    .from('leads')
    .insert({ email, source: params.source })

  if (error) {
    const code = (error as unknown as { code?: string }).code
    if (code === '23505') return
    throw error
  }
}

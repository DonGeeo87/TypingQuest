/**
 * Base URL for Supabase email flows (magic link, verify / link email).
 * Must match an entry in Supabase → Authentication → URL Configuration → Redirect URLs.
 *
 * Set VITE_SITE_URL in production (e.g. https://typing-quest-ochre.vercel.app) so
 * links in emails never point at localhost when env or dashboard were misconfigured.
 */
export function getAuthEmailRedirectOrigin(): string {
  const fromEnv = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

type AnyRecord = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: AnyRecord[]
    gtag?: (...args: unknown[]) => void
    plausible?: (event: string, options?: { props?: AnyRecord }) => void
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined

function injectScript(src: string, attrs: Record<string, string> = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return
  const s = document.createElement('script')
  s.src = src
  s.async = true
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  document.head.appendChild(s)
}

export function initAnalytics() {
  if (GA_ID) {
    window.dataLayer = window.dataLayer ?? []
    window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer!.push(args as unknown as AnyRecord))
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { anonymize_ip: true, send_page_view: false })
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`)
  }

  if (PLAUSIBLE_DOMAIN) {
    injectScript('https://plausible.io/js/script.js', { 'data-domain': PLAUSIBLE_DOMAIN })
  }
}

export function trackScreen(name: string) {
  if (GA_ID && window.gtag) {
    window.gtag('event', 'screen_view', { screen_name: name })
  }
  if (window.plausible) {
    window.plausible('screen_view', { props: { screen_name: name } })
  }
}

export function trackEvent(name: string, props: AnyRecord = {}) {
  if (GA_ID && window.gtag) {
    window.gtag('event', name, props)
  }
  if (window.plausible) {
    window.plausible(name, { props })
  }
}

'use client'
import { createContext, useContext, useState } from 'react'
import type { Locale } from './translations'
import { translations } from './translations'

// =========================================================
// Context type
// =========================================================
interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

// =========================================================
// Context with sensible defaults (used before Provider mounts)
// =========================================================
const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
})

// =========================================================
// Provider
// =========================================================
export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = (newLocale: Locale) => {
    // Persist selection in a 1-year cookie so the server layout can read it
    document.cookie = `moreine-lang=${newLocale};path=/;max-age=${
      60 * 60 * 24 * 365
    };SameSite=Lax`
    setLocaleState(newLocale)
    // Force a full page reload so the server re-renders with the correct
    // `dir` and `lang` attributes on <html>.
    window.location.reload()
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = translations[locale]
    for (const k of keys) {
      if (current === undefined || current === null) return key
      current = current[k]
    }
    return typeof current === 'string' ? current : key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// =========================================================
// Hook
// =========================================================
export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext)
}

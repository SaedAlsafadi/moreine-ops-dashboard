import React, { ReactNode } from 'react'
import AppWrappers from './AppWrappers'
import { cookies } from 'next/headers'
import { LanguageProvider } from '@/lib/i18n/context'
import '@/styles/index.css' // Import styles explicitly if needed? Wait, Horizon does this somewhere else maybe.

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get('moreine-lang')
  const initialLocale = (langCookie?.value === 'ar' ? 'ar' : 'en') as 'en' | 'ar'
  const dir = initialLocale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={initialLocale} dir={dir}>
      <body id={'root'}>
        <LanguageProvider initialLocale={initialLocale}>
          <AppWrappers>{children}</AppWrappers>
        </LanguageProvider>
      </body>
    </html>
  )
}

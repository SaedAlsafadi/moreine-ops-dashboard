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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.body.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.body.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body id={'root'}>
        <LanguageProvider initialLocale={initialLocale}>
          <AppWrappers>{children}</AppWrappers>
        </LanguageProvider>
      </body>
    </html>
  )
}

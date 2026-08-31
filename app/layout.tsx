import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/translations'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Moreine Ops Dashboard',
  description: 'Internal operations dashboard for Moreine Coffee Roastery',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('moreine-lang')?.value ?? 'en') as Locale

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <LanguageProvider initialLocale={locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

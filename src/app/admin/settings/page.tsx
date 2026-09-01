'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Card from '@/components/card'
import { PageHeader } from '@/components/ui/PageHeader'

export default function Settings() {
  const { t, locale, setLocale } = useLanguage()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (
      document.body.classList.contains('dark') ||
      document.documentElement.classList.contains('dark')
    ) {
      setTheme('dark')
    } else if (localStorage.getItem('theme') === 'dark') {
      setTheme('dark')
      document.body.classList.add('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.body.classList.add('dark')
      document.documentElement.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleLang = (newLang: 'en' | 'ar') => {
    setLocale(newLang)
  }

  return (
    <div className="space-y-8">
      <PageHeader title={t('settings.title')} />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Language Card */}
        <Card extra="p-6">
          <h2 className="mb-1 text-base font-semibold text-text-primary">
            {t('settings.language')}
          </h2>
          <p className="mb-5 text-sm text-text-secondary">
            {locale === 'ar' ? 'اختر لغة الواجهة' : 'Choose interface language'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => toggleLang('en')}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                locale === 'en'
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-background text-text-secondary hover:border-accent/50'
              }`}
            >
              English
            </button>
            <button
              onClick={() => toggleLang('ar')}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                locale === 'ar'
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-background text-text-secondary hover:border-accent/50'
              }`}
            >
              العربية
            </button>
          </div>
        </Card>

        {/* Theme Card */}
        <Card extra="p-6">
          <h2 className="mb-1 text-base font-semibold text-text-primary">
            {t('settings.theme')}
          </h2>
          <p className="mb-5 text-sm text-text-secondary">
            {locale === 'ar' ? 'اختر مظهر الواجهة' : 'Choose display theme'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => toggleTheme('light')}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                theme === 'light'
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-background text-text-secondary hover:border-accent/50'
              }`}
            >
              {t('settings.lightMode')}
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-background text-text-secondary hover:border-accent/50'
              }`}
            >
              {t('settings.darkMode')}
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
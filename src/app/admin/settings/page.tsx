'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { Button } from '@/components/ui/Button'

export default function Settings() {
  const { t, locale, setLocale } = useLanguage()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Read current theme from body class or localStorage
    if (document.body.classList.contains('dark') || document.documentElement.classList.contains('dark')) {
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
    <div className="flex w-full flex-col gap-5 px-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-olive dark:text-white">{t('settings.title')}</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Language Card */}
        <div className="rounded-xl bg-white p-6 shadow-horizon-sm dark:bg-navy-800">
          <h2 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">{t('settings.language')}</h2>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => toggleLang('en')} 
              variant={locale === 'en' ? 'primary' : 'secondary'}
            >
              {t('settings.english')}
            </Button>
            <Button 
              onClick={() => toggleLang('ar')} 
              variant={locale === 'ar' ? 'primary' : 'secondary'}
            >
              {t('settings.arabic')}
            </Button>
          </div>
        </div>

        {/* Theme Card */}
        <div className="rounded-xl bg-white p-6 shadow-horizon-sm dark:bg-navy-800">
          <h2 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">{t('settings.theme')}</h2>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => toggleTheme('light')} 
              variant={theme === 'light' ? 'primary' : 'secondary'}
            >
              {t('settings.lightMode')}
            </Button>
            <Button 
              onClick={() => toggleTheme('dark')} 
              variant={theme === 'dark' ? 'primary' : 'secondary'}
            >
              {t('settings.darkMode')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

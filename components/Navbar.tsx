'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

export interface NavbarProps {
  onMenuToggle: () => void
}

const PAGE_TITLES: Record<string, { en: string; ar: string }> = {
  '/dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  '/green-inventory': { en: 'Green Inventory', ar: 'المخزون الأخضر' },
  '/roasting': { en: 'Roasting', ar: 'التحميص' },
  '/roasted-inventory': { en: 'Roasted Inventory', ar: 'المخزون المحمص' },
  '/sales': { en: 'Sales', ar: 'المبيعات' },
  '/movements': { en: 'Stock Movements', ar: 'حركات المخزون' },
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { locale, setLocale, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  const isArabic = locale === 'ar'

  useEffect(() => {
    // Check if the main scrollable area is scrolled
    const main = document.querySelector('main')
    const handleScroll = () => {
      setScrolled((main?.scrollTop ?? 0) > 10)
    }
    main?.addEventListener('scroll', handleScroll)
    return () => main?.removeEventListener('scroll', handleScroll)
  }, [])

  const currentTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname?.startsWith(path),
  )?.[1]

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  function toggleLocale() {
    setLocale(isArabic ? 'en' : 'ar')
  }

  return (
    <nav className="absolute top-4 z-40 flex w-[calc(100vw_-_2rem)] flex-row items-center justify-between rounded-xl bg-white/70 p-3 backdrop-blur-xl shadow-horizon-sm transition-all md:w-[calc(100vw_-_330px)] ltr:right-4 rtl:left-4">
      {/* ── Left: Breadcrumb + Title ── */}
      <div className="flex flex-col gap-1 ms-2">
        <div className="flex items-center text-sm font-medium text-olive/60">
          <span>{isArabic ? 'الصفحات' : 'Pages'}</span>
          <span className="mx-1">/</span>
          <span className="capitalize">{currentTitle ? (isArabic ? currentTitle.ar : currentTitle.en) : ''}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-olive capitalize">
          {currentTitle ? (isArabic ? currentTitle.ar : currentTitle.en) : ''}
        </h1>
      </div>

      {/* ── Right: Search + Actions Card ── */}
      <div className="flex items-center gap-2 sm:gap-4 rounded-full bg-white px-4 py-2 shadow-sm">
        
        {/* Search Bar (Visual only for now) */}
        <div className="hidden sm:flex items-center rounded-full bg-light px-3 py-1.5 text-sm text-charcoal">
          <svg className="h-4 w-4 text-olive/60 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={isArabic ? 'بحث...' : 'Search...'} 
            className="bg-transparent outline-none w-24 sm:w-32 placeholder:text-olive/40"
          />
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLocale}
          className="text-sm font-bold text-olive hover:text-sage transition"
          aria-label={isArabic ? 'Switch to English' : 'Switch to Arabic'}
        >
          {isArabic ? 'EN' : 'عربي'}
        </button>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="text-olive hover:text-sage transition"
          aria-label="Sign out"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h5a1 1 0 000-2H4V5h4a1 1 0 000-2H3zm10.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H8a1 1 0 110-2h6.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="md:hidden text-olive hover:text-sage transition"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default Navbar

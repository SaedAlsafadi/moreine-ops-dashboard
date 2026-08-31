'use client'

import React from 'react'
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
  const { locale, setLocale } = useLanguage()

  const isArabic = locale === 'ar'

  // Determine current page title
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
    <header className="flex h-14 items-center justify-between bg-[#9db090] px-4 shadow-sm md:px-6">
      {/* ── Left: hamburger (mobile) + logo + page title ── */}
      <div className="flex items-center gap-3">
        {/* Hamburger button (visible on mobile only) */}
        <button
          onClick={onMenuToggle}
          className="rounded-md p-1.5 text-[#ece7d4] transition hover:bg-[#8aa07e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ece7d4] md:hidden"
          aria-label="Toggle navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <span className="select-none text-lg font-bold tracking-tight text-[#ece7d4]">
          Moreine
          <span className="ml-1 text-xs font-normal opacity-70">Roastery</span>
        </span>

        {/* Divider + Page title */}
        {currentTitle && (
          <>
            <span className="hidden h-4 w-px bg-[#ece7d4]/30 md:block" aria-hidden="true" />
            <h1 className="hidden text-sm font-medium text-[#ece7d4]/80 md:block">
              {isArabic ? currentTitle.ar : currentTitle.en}
            </h1>
          </>
        )}
      </div>

      {/* ── Right: language toggle + sign out ── */}
      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={toggleLocale}
          className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#ece7d4] transition hover:bg-[#8aa07e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ece7d4]"
          aria-label={isArabic ? 'Switch to English' : 'Switch to Arabic'}
        >
          {isArabic ? 'EN' : 'عربي'}
        </button>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-[#ece7d4] transition hover:bg-[#8aa07e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ece7d4]"
          aria-label="Sign out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h5a1 1 0 000-2H4V5h4a1 1 0 000-2H3zm10.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H8a1 1 0 110-2h6.586l-1.293-1.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline">
            {isArabic ? 'تسجيل الخروج' : 'Sign out'}
          </span>
        </button>
      </div>
    </header>
  )
}

export default Navbar

'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavLink {
  href: string
  en: string
  ar: string
  icon: React.ReactNode
}

const NAV_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    en: 'Dashboard',
    ar: 'لوحة التحكم',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
  },
  {
    href: '/green-inventory',
    en: 'Green Inventory',
    ar: 'المخزون الأخضر',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm1 8a1 1 0 100 2h6a1 1 0 100-2H7zm1-3a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: '/roasting',
    en: 'Roasting',
    ar: 'التحميص',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: '/roasted-inventory',
    en: 'Roasted Inventory',
    ar: 'المخزون المحمص',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      </svg>
    ),
  },
  {
    href: '/sales',
    en: 'Sales',
    ar: 'المبيعات',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v12H6V4zm2 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: '/movements',
    en: 'Stock Movements',
    ar: 'حركات المخزون',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { locale } = useLanguage()
  const isArabic = locale === 'ar'
  const isRtl = isArabic

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const navContent = (
    <nav className="flex h-full flex-col bg-[#ece7d4]">
      {/* Sidebar header (desktop logo area) */}
      <div className="flex h-14 items-center border-b border-[#9db090]/30 px-5">
        <span className="text-base font-bold text-[#3d4a2e]">
          Moreine <span className="text-xs font-normal opacity-50">Ops</span>
        </span>
        {/* Close button on mobile */}
        <button
          onClick={onClose}
          className="ms-auto rounded-md p-1.5 text-[#3d4a2e]/60 hover:bg-[#9db090]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9db090] md:hidden"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV_LINKS.map((link) => {
          const isActive = pathname?.startsWith(link.href)
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={[
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-100',
                  isActive
                    ? 'bg-[#9db090] text-white shadow-sm'
                    : 'text-[#3d4a2e] hover:bg-[#9db090]/15 hover:text-[#3d4a2e]',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={isActive ? 'text-white' : 'text-[#9db090]'} aria-hidden="true">
                  {link.icon}
                </span>
                {isArabic ? link.ar : link.en}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Footer branding */}
      <div className="border-t border-[#9db090]/30 px-5 py-3">
        <p className="text-xs text-[#3d4a2e]/40">
          {isArabic ? '© موراين لتحميص القهوة' : '© Moreine Coffee Roastery'}
        </p>
      </div>
    </nav>
  )

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ md) ── */}
      <aside
        className="hidden md:flex md:w-56 md:flex-col md:flex-shrink-0 md:border-e md:border-[#9db090]/30"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {navContent}
      </aside>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-40 bg-[#3d4a2e]/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        dir={isRtl ? 'rtl' : 'ltr'}
        className={[
          'fixed top-0 z-50 h-full w-64 shadow-xl transition-transform duration-300 md:hidden',
          // Slide from right for RTL, from left for LTR
          isRtl ? 'right-0' : 'left-0',
          isOpen
            ? 'translate-x-0'
            : isRtl
              ? 'translate-x-full'
              : '-translate-x-full',
        ].join(' ')}
        aria-label="Navigation sidebar"
      >
        {navContent}
      </aside>
    </>
  )
}

export default Sidebar

'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H14a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: '/sales',
    en: 'Sales',
    ar: 'المبيعات',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: '/movements',
    en: 'Movements',
    ar: 'الحركات',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { locale } = useLanguage()
  const isArabic = locale === 'ar'

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const baseClasses = 'fixed inset-y-0 z-50 flex w-[290px] flex-col bg-white shadow-horizon transition-transform duration-300 md:translate-x-0'
  
  // RTL-aware transform classes for mobile
  const ltrTransform = isOpen ? 'translate-x-0' : '-translate-x-full'
  const rtlTransform = isOpen ? 'translate-x-0' : 'translate-x-full'
  const transformClass = isArabic ? rtlTransform : ltrTransform

  const placementClass = isArabic ? 'right-0' : 'left-0'

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-olive/20 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`${baseClasses} ${transformClass} ${placementClass}`}>
        {/* Logo Area */}
        <div className="flex h-[110px] items-center justify-center border-b border-light mx-6">
          {/* Use the new logo file we copied */}
          <div className="relative w-40 h-20">
            <img src="/logo.png" alt="Moreine Logo" className="object-contain w-full h-full" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto py-6 px-4">
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href)
            
            return (
              <div key={link.href} className="relative">
                {/* Active Indicator Pill */}
                {isActive && (
                  <div className={`absolute top-1/2 h-9 w-1 -translate-y-1/2 rounded-full bg-sage ${isArabic ? 'left-0' : 'right-0'}`} />
                )}
                
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                    isActive 
                      ? 'text-olive font-bold' 
                      : 'text-olive/50 font-medium hover:text-olive hover:bg-light'
                  }`}
                >
                  <span className={`${isActive ? 'text-sage' : ''}`}>
                    {link.icon}
                  </span>
                  <span>{isArabic ? link.ar : link.en}</span>
                </Link>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

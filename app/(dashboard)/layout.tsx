'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useLanguage } from '@/lib/i18n/context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { locale } = useLanguage()

  return (
    <div className="flex h-screen overflow-hidden bg-light">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden md:ms-[290px] transition-all duration-300 relative h-full">
        {/* Floating Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(s => !s)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-[100px] sm:pt-[110px]">
          {children}
        </main>
      </div>
    </div>
  )
}

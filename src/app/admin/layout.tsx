'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import routes from 'routes';
import { findCurrentRoute } from 'utils/navigation';
import React from 'react';
import Sidebar from 'components/sidebar';
import { HiMenu } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi';
import NavLink from 'components/link/NavLink';
import { useLanguage } from '@/lib/i18n/context';

export default function Admin({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  // Close mobile sidebar whenever route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const currentRoute = findCurrentRoute(routes, pathname);
  const pageTitle = currentRoute?.path === 'green-inventory'
    ? t('nav.greenInventory')
    : currentRoute?.path === 'roasted-inventory'
    ? t('nav.roastedInventory')
    : currentRoute?.path
    ? t('nav.' + currentRoute.path)
    : 'Moreine Ops';

  return (
    <div className="flex min-h-screen h-full w-full bg-background">
      {/* Sidebar Drawer */}
      <Sidebar routes={routes} open={open} setOpen={setOpen} variant="admin" />

      <div className="flex flex-col min-h-screen h-full w-full font-dm bg-background">
        {/* Mobile Top Header (Visible on screens < xl) */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur-md xl:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-text-primary shadow-xs transition-colors hover:bg-border/30 active:scale-95"
              aria-label="Open Navigation Menu"
            >
              <HiMenu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2">
              <img src="/logo-dark.png" alt="Moreine" className="h-8 w-auto object-contain dark:hidden" />
              <img src="/logo-white.png" alt="Moreine" className="h-8 w-auto object-contain hidden dark:block" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-primary px-3 py-1.5 rounded-lg bg-background border border-border">
              {pageTitle}
            </span>
            <NavLink
              href="/admin/settings"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-text-secondary hover:text-text-primary hover:bg-border/30 transition-colors"
              aria-label="Settings"
            >
              <FiSettings className="h-4 w-4" />
            </NavLink>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-2.5 flex-1 transition-all md:pe-2 xl:ms-[323px]">
          <div>
            <div className="mx-auto p-2 !pt-[10px] md:p-2">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

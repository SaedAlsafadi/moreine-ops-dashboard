'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import routes from 'routes';
import { getActiveNavbar, getActiveRoute } from 'utils/navigation';
import React from 'react';
import Navbar from 'components/navbar';
import Sidebar from 'components/sidebar';

export default function Admin({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full bg-background-100 dark:bg-background-900">
      <Sidebar routes={routes} open={open} setOpen={setOpen} variant="admin" />
      <div className="h-full w-full font-dm dark:bg-navy-900">
        <main className={`mx-2.5 flex-none transition-all dark:bg-navy-900 md:pe-2 xl:ms-[323px]`}>
          <div>
            <Navbar
              onOpenSidenav={() => setOpen(!open)}
              brandText={getActiveRoute(routes, pathname)}
              secondary={getActiveNavbar(routes, pathname)}
            />
            <div className="mx-auto p-2 !pt-[10px] md:p-2">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

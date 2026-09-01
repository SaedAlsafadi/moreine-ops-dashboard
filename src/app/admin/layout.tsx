'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import routes from 'routes';
import { getActiveRoute } from 'utils/navigation';
import React from 'react';
import Sidebar from 'components/sidebar';

export default function Admin({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full bg-background">
      <Sidebar routes={routes} open={open} setOpen={setOpen} variant="admin" />
      <div className="h-full w-full font-dm bg-background">
        <main className={`mx-2.5 flex-none transition-all md:pe-2 xl:ms-[323px]`}>
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

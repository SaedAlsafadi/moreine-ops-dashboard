/* eslint-disable */
'use client';

import { HiX } from 'react-icons/hi';
import Links from './components/Links';
import { IRoute } from 'types/navigation';
import { createClient } from '@/lib/supabase/client';
import { MdLogout } from 'react-icons/md';

function SidebarHorizon(props: { routes: IRoute[]; open: boolean; setOpen: (open: boolean) => void; [x: string]: any }) {
  const { routes, open, setOpen } = props;
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-200 xl:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed start-0 top-0 bottom-0 z-50 flex h-full w-[285px] flex-col bg-surface pb-10 shadow-2xl shadow-black/10 transition-transform duration-200 ease-in-out xl:z-30 xl:flex xl:!translate-x-0 xl:!transform-none ${
          open ? 'translate-x-0' : 'max-xl:ltr:-translate-x-full max-xl:rtl:translate-x-full'
        }`}
      >
        {/* Mobile close button */}
        <button
          type="button"
          className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-text-secondary hover:text-text-primary hover:bg-border/20 transition-colors xl:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <HiX className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="mt-[30px] mb-[20px] flex h-44 w-full items-center justify-center px-6">
          <img src="/logo-dark.png" alt="Moreine" className="h-full w-full object-contain dark:hidden" />
          <img src="/logo-white.png" alt="Moreine" className="h-full w-full object-contain hidden dark:block" />
        </div>

        {/* Divider */}
        <div className="mb-7 h-px bg-border dark:bg-surface/30" />

        {/* Nav links */}
        <ul className="mb-auto pt-1 overflow-y-auto">
          <Links routes={routes} onClose={() => setOpen(false)} />
        </ul>

      {/* Logout button at the bottom */}
      <div className="px-4 pb-2 pt-4">
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/auth/sign-in';
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text-primary transition-all hover:bg-border/30"
        >
          <MdLogout className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  </>
  );
}

export default SidebarHorizon;

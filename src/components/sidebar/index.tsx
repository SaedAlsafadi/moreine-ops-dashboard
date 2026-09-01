/* eslint-disable */
'use client';

import { HiX } from 'react-icons/hi';
import Links from './components/Links';
import { IRoute } from 'types/navigation';
import { createClient } from '@/lib/supabase/client';
import { MdLogout } from 'react-icons/md';

function SidebarHorizon(props: { routes: IRoute[]; [x: string]: any }) {
  const { routes, open, setOpen } = props;
  return (
    <div
      className={`duration-175 linear fixed start-0 !z-50 flex min-h-full w-[285px] flex-col bg-surface pb-10 shadow-2xl shadow-white/5 transition-all md:!z-50 lg:!z-50 xl:!z-0 xl:block ${ open ? 'translate-x-0' : '-translate-x-96 xl:translate-x-0' }`}
    >
      {/* Mobile close button */}
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={() => setOpen(false)}
      >
        <HiX />
      </span>

      {/* Logo */}
      <div className="mt-[30px] mb-[20px] flex h-44 w-full items-center justify-center px-6">
        <img src="/logo-dark.png" alt="Moreine" className="h-full w-full object-contain dark:hidden" />
        <img src="/logo-white.png" alt="Moreine" className="h-full w-full object-contain hidden dark:block" />
      </div>

      {/* Divider */}
      <div className="mb-7 h-px bg-border dark:bg-surface/30" />

      {/* Nav links */}
      <ul className="mb-auto pt-1">
        <Links routes={routes} />
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
  );
}

export default SidebarHorizon;

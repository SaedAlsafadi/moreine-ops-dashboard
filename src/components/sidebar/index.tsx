/* eslint-disable */

import { HiX } from 'react-icons/hi';
import Links from './components/Links';

import SidebarCard from 'components/sidebar/components/SidebarCard';
import { IRoute } from 'types/navigation';

function SidebarHorizon(props: { routes: IRoute[]; [x: string]: any }) {
  const { routes, open, setOpen } = props;
  return (
    <div
      className={`duration-175 linear fixed start-0 !z-50 flex min-h-full w-[285px] flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 xl:block ${
        open ? 'translate-x-0' : '-translate-x-96 xl:translate-x-0'
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={() => setOpen(false)}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[40px] mb-[20px] flex items-center justify-center`}>
        <img src="/logo-dark.png" alt="Moreine" className="h-14 object-contain dark:hidden" />
        <img src="/logo-white.png" alt="Moreine" className="h-14 object-contain hidden dark:block" />
      </div>
      <div className="mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>
      {/* Nav item end */}
    </div>
  );
}

export default SidebarHorizon;

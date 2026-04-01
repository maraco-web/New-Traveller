'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Plane, Compass, PiggyBank } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: '首頁', icon: Home },
  { href: '/trips', label: '行程', icon: Map },
  { href: '/search', label: '搜尋', icon: Plane },
  { href: '/explore', label: '探索', icon: Compass },
  { href: '/budget', label: '預算', icon: PiggyBank },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-100 safe-area-pb">
      <div className="flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
                active ? 'text-sky-600' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

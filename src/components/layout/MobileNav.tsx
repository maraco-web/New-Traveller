'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Plane, Users, PiggyBank } from 'lucide-react';
import { useFriendStore } from '@/store/friendStore';

const NAV_ITEMS = [
  { href: '/dashboard', label: '首頁', icon: Home },
  { href: '/trips', label: '行程', icon: Map },
  { href: '/search', label: '搜尋', icon: Plane },
  { href: '/friends', label: '好友', icon: Users },
  { href: '/budget', label: '預算', icon: PiggyBank },
];

export function MobileNav() {
  const pathname = usePathname();
  const pendingCount = useFriendStore((s) => s.pendingCount);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-100 safe-area-pb">
      <div className="flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          const isFriends = href === '/friends';
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors relative ${
                active ? 'text-sky-600' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
                {isFriends && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

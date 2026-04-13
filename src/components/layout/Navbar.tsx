'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe2, Bell, Search, Menu, LogOut, User, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { useFriendStore } from '@/store/friendStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useUIStore();
  const pendingCount = useFriendStore((s) => s.pendingCount);
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: '首頁' },
    { href: '/trips', label: '我的行程' },
    { href: '/search', label: '搜尋' },
    { href: '/explore', label: '探索' },
    { href: '/budget', label: '預算' },
    { href: '/friends', label: '好友' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <Globe2 className="w-6 h-6 text-sky-500" />
            <span className="hidden sm:inline">TravelKit</span>
          </Link>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {link.label}
              {link.href === '/friends' && pendingCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-500">
            <Search className="w-5 h-5" />
          </Button>
          <Link href="/friends" className="relative md:hidden">
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Users className="w-5 h-5" />
            </Button>
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Link>
          <Button variant="ghost" size="icon" className="text-slate-500 hidden md:flex">
            <Bell className="w-5 h-5" />
          </Button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                {user?.displayName || '旅行者'}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.displayName || '旅行者'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  個人資料
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  設定
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  登出
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Bell, Upload, ChevronDown, LayoutDashboard, Megaphone, CalendarDays, MessageSquareText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Riset Produk', href: '/campaigns/create', icon: Sparkles },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { label: 'Kalender', href: '/calendar', icon: CalendarDays },
  { label: 'Chat', href: '/chat', icon: MessageSquareText },
  { label: 'Pengaturan', href: '/settings', icon: Settings },
];

export function TopBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Ambil nama asli dari metadata Google, atau fallback ke "Pengguna"
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna';
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-8 bg-background/80 backdrop-blur-md">
      {/* Left: Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5">
        {/* Simple geometric logo resembling the reference (blue/green slanted shapes) */}
        <div className="flex -space-x-1">
          <div className="w-4 h-6 bg-blue-600 rounded-[2px] transform skew-x-[-15deg]" />
          <div className="w-4 h-6 bg-green-500 rounded-[2px] transform skew-x-[-15deg] mt-2" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">Affiliot</span>
      </Link>

      {/* Middle: Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = item.href === '/campaigns'
            ? pathname === '/campaigns' || (pathname.startsWith('/campaigns/') && !pathname.includes('/create'))
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all',
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
              )}
            >
              {isActive && <Icon className="w-4 h-4" />}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-4">
        {/* Action icons in circular white buttons with soft shadow */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm border border-gray-100 transition-shadow hover:shadow-md relative outline-none">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white border-gray-100 shadow-xl rounded-xl p-0">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Notifikasi</h3>
              </div>
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">Belum ada notifikasi baru</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/campaigns/create" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
            <Upload className="w-4.5 h-4.5" />
          </Link>
        </div>

        {/* User Profile */}
        <Link href="/settings" className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-full hover:bg-gray-200/50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {initial}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
              {fullName}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}

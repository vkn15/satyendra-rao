'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Radio,
  Youtube, 
  Newspaper, 
  FileText, 
  Megaphone, 
  User, 
  Award, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/admin/daily-news', label: 'Daily News Briefing', icon: Radio, badge: 'AI' },
    { href: '/admin/videos', label: 'Manage YouTube Videos', icon: Youtube },
    { href: '/admin/news', label: 'Manage News', icon: Newspaper },
    { href: '/admin/blogs', label: 'Manage Blogs', icon: FileText },
    { href: '/admin/campaigns', label: 'Manage Campaigns', icon: Megaphone },
    { href: '/admin/profile', label: 'Profile & Experience', icon: User },
    { href: '/admin/achievements', label: 'Achievements', icon: Award },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/volunteers', label: 'Volunteers', icon: Users },
    { href: '/admin/gallery', label: 'Media Gallery', icon: ImageIcon },
    { href: '/admin/analytics', label: 'Website Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Website Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard' || pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  return (
    <aside
      className={`bg-purple-950 text-white min-h-screen border-r border-purple-900/60 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-purple-900/80 sticky top-0 bg-purple-950 z-10">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-800 flex items-center justify-center text-accent-yellow font-bold shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm text-white tracking-wide">
                  सत्येंद्र राव
                </span>
                <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                  Admin Control Desk
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-xl bg-purple-800 flex items-center justify-center text-accent-yellow font-bold shadow-md">
              <Shield className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  active
                    ? 'bg-purple-800 text-white shadow-sm font-bold'
                    : 'text-purple-200/80 hover:bg-purple-900/50 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-accent-yellow' : 'text-purple-300 group-hover:text-white'}`} />
                
                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-accent-yellow text-navy-900">
                    {item.badge}
                  </span>
                )}

                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-accent-yellow rounded-r" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public website & logout */}
      <div className="p-3 border-t border-purple-900/80 space-y-1 bg-purple-950/90">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-purple-200 hover:text-white hover:bg-purple-900/50 transition-colors"
          title="Open Public Portal"
        >
          <ExternalLink className="w-4 h-4 text-accent-yellow shrink-0" />
          {!collapsed && <span>View Public Portal</span>}
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:text-red-100 hover:bg-red-950/40 transition-colors cursor-pointer text-left"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-red-400 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

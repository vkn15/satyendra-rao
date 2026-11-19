'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Newspaper, 
  Megaphone, 
  FileText, 
  Users, 
  Settings, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  Youtube
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { href: '/admin/videos', label: 'Videos & YouTube', icon: Youtube, badge: 'Media' },
    { href: '/admin/news', label: 'News Briefings & AI', icon: Newspaper, badge: 'AI Hub' },
    { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
    { href: '/admin/blogs', label: 'Blogs & Articles', icon: FileText },
    { href: '/admin/volunteers', label: 'Volunteers', icon: Users },
    { href: '/admin/settings', label: 'Settings & Profile', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`bg-purple-950 text-white min-h-screen border-r border-purple-900/60 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-purple-900/80">
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
            className="p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors"
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
              <a
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  active
                    ? 'bg-purple-800 text-white shadow-sm font-bold'
                    : 'text-purple-200/80 hover:bg-purple-900/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-accent-yellow' : 'text-purple-300 group-hover:text-white'}`} />
                
                {!collapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-accent-yellow text-navy-900">
                    {item.badge}
                  </span>
                )}

                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-accent-yellow rounded-r" />
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public website */}
      <div className="p-3 border-t border-purple-900/80">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-200 hover:text-white hover:bg-purple-900/50 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-accent-yellow shrink-0" />
          {!collapsed && <span>View Public Portal</span>}
        </a>
      </div>
    </aside>
  );
}

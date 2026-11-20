'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '../public/LanguageSwitcher';
import { 
  Shield, 
  Activity, 
  Database, 
  Sparkles, 
  ExternalLink, 
  LogOut, 
  User, 
  ChevronDown, 
  Settings 
} from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const router = useRouter();
  const { language, isHindi } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {});

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="h-20 bg-white border-b border-purple-100 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {actions}

        {/* Live Tracking Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real Tracking: Active</span>
        </div>

        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-purple-300 text-slate-600 hover:text-purple-900 text-xs font-bold transition-colors"
          title="Open Public Website in new tab"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Language Preview */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* Admin Avatar & Dropdown */}
        <div className="relative pl-2 border-l border-slate-200" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
            aria-expanded={menuOpen}
          >
            <div className="w-9 h-9 rounded-full bg-purple-900 text-accent-yellow font-bold text-xs flex items-center justify-center shadow-xs">
              SR
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-navy-900 leading-tight">
                सत्येंद्र राव
              </span>
              <span className="text-[10px] text-purple-700 font-medium leading-tight">
                {adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin Desk'}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-navy-900">Satyendra Rao</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {adminUser?.email || 'admin@satyendrarao.in'}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  {adminUser?.role || 'Super Admin'}
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Website Settings</span>
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Open Public Website</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

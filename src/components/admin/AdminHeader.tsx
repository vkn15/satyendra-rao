'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '../public/LanguageSwitcher';
import { Shield, Activity, Database, Sparkles } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const { language, isHindi } = useLanguage();

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

        {/* Language Preview */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-purple-900 text-accent-yellow font-bold text-xs flex items-center justify-center shadow-xs">
            SR
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-navy-900">Admin Desk</span>
            <span className="text-[10px] text-slate-500">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

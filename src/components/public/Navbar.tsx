'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Users, Menu, X, Shield, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { t, isHindi } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.navHome },
    { href: '/about', label: t.navAbout },
    { href: '/campaigns', label: t.navCampaigns },
    { href: '/charter', label: t.navCharter },
    { href: '/news', label: t.navNews },
    { href: '/media', label: t.navMedia },
    { href: '/blog', label: t.navBlog },
    { href: '/volunteer', label: t.navVolunteer },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Subtitle matching reference poster */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-1.5 h-10 bg-purple-900 rounded-full group-hover:scale-y-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-navy-900 group-hover:text-purple-900 transition-colors">
                {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
              </span>
              <span className="text-[11px] font-medium text-slate-600 tracking-wide uppercase">
                {isHindi 
                  ? 'सामाजिक कार्यकर्ता | युवा पैरोकार | जननीति' 
                  : 'Social Activist | Youth Advocate | Public Policy'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map(link => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-semibold transition-colors relative ${
                    active
                      ? 'text-purple-900 font-bold'
                      : 'text-slate-700 hover:text-purple-900'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-purple-900 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            <a
              href="/volunteer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-purple-900 hover:bg-purple-950 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Users className="w-4 h-4 text-accent-yellow" />
              <span>{t.btnVolunteerNow}</span>
            </a>

            <a
              href="/admin"
              title="Admin Panel"
              className="p-2 text-slate-400 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Shield className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-navy-900 hover:text-purple-900 hover:bg-purple-50 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-slide-down">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                isActive(link.href)
                  ? 'bg-purple-900 text-white font-bold'
                  : 'text-slate-700 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="/volunteer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold bg-purple-900 text-white shadow-md"
            >
              <Users className="w-4 h-4 text-accent-yellow" />
              <span>{t.btnVolunteerNow}</span>
            </a>
            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Shield className="w-4 h-4 text-purple-900" />
              <span>{isHindi ? 'व्यवस्थापक पोर्टल (Admin)' : 'Admin Dashboard'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

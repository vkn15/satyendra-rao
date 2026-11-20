'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, Mail, Phone, MapPin, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  const { t, isHindi } = useLanguage();

  return (
    <footer className="bg-navy-900 text-white pt-16 pb-10 border-t border-purple-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-accent-yellow rounded-full" />
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-hindi">
                  {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
                </span>
                <span className="block text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  {isHindi ? 'संयोजक, युवा सुधार आंदोलन' : 'Convener, Youth Reform Movement'}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              {t.footerMission}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-purple-200">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-accent-yellow font-bold">
                ✓ {isHindi ? 'पारदर्शी भर्ती' : 'Fair Recruitment'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-accent-yellow font-bold">
                ✓ {isHindi ? '90 दिवसीय परीक्षा सीमा' : '90-Day Exam Ceiling'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-accent-yellow">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="/about" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{t.navAbout}</span>
                </a>
              </li>
              <li>
                <a href="/campaigns" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{t.navCampaigns}</span>
                </a>
              </li>
              <li>
                <a href="/charter" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{t.navCharter}</span>
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{t.navNews}</span>
                </a>
              </li>
              <li>
                <a href="/media" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{t.navMedia}</span>
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{t.navBlog}</span>
                </a>
              </li>
              <li>
                <a href="/volunteer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{t.navVolunteer}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Secretariat */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-accent-yellow">
              {t.footerContact}
            </h4>
            <div className="space-y-2.5 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-yellow shrink-0 mt-1" />
                <span>{isHindi ? 'युवा संवाद केंद्र, मानसरोवर, जयपुर (राजस्थान) - 302020' : 'Youth Dialogue Secretariat, Mansarovar, Jaipur (Rajasthan) - 302020'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent-yellow shrink-0" />
                <span>contact@satyendrarao.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent-yellow shrink-0" />
                <span>+91 141 2987654 / +91 98290 XXXXX</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isHindi ? 'व्यवस्थापक नियंत्रण कक्ष (Admin Desk)' : 'Admin Control Desk'}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{t.footerCopyright}</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>{t.footerDesignedFor}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

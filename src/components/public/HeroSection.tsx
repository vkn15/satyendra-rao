'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import VideoModal from './VideoModal';

export default function HeroSection() {
  const { t, isHindi } = useLanguage();
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1E112A] via-[#2A163B] to-[#160B21] text-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Subtle Gradient & Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,#7E22CE_0%,transparent_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#160B21] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Top Pill / Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold tracking-wider text-purple-200 uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
              <span>{t.heroTag}</span>
            </div>

            {/* Big Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black leading-tight tracking-tight text-white drop-shadow-sm font-hindi">
                <span className="block">{t.heroHeadlinePart1}</span>
                <span className="block text-purple-100">{t.heroHeadlinePart2}</span>
                <span className="block text-purple-100">{t.heroHeadlinePart3}</span>
              </h1>

              {/* Yellow Highlighted Pill - Exact Match to Poster */}
              <div className="pt-2">
                <div className="inline-block relative">
                  <div className="bg-gradient-to-r from-accent-yellow via-amber-400 to-accent-yellow text-navy-900 font-black text-2xl sm:text-3xl md:text-4xl px-6 py-2.5 rounded-xl shadow-lg border border-yellow-300 font-hindi tracking-wide transform -rotate-1 hover:rotate-0 transition-transform">
                    {t.heroHighlightPill}
                  </div>
                </div>
              </div>
            </div>

            {/* English Subtitle matching poster */}
            <p className="text-base sm:text-lg md:text-xl text-purple-100/90 font-medium leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="/volunteer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold bg-purple-700 hover:bg-purple-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 border border-purple-500/50"
              >
                <Users className="w-5 h-5 text-accent-yellow" />
                <span>{t.btnJoinMovement}</span>
              </a>

              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl text-base font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-accent-yellow flex items-center justify-center text-navy-900 shadow">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>{t.btnWatchMessage}</span>
              </button>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-purple-200/80 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-yellow" />
                <span>{isHindi ? '100% गैर-राजनीतिक जनक्रांति' : '100% Non-Partisan Youth Movement'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-yellow" />
                <span>{isHindi ? 'पारदर्शी परीक्षा कानून की मांग' : 'Statutory Exam Security Demand'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Satyendra Rao Portrait & Placards */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            
            {/* Rally Backdrop Placard Left */}
            <div className="hidden sm:block absolute -top-4 -left-6 z-10 bg-white text-navy-900 px-4 py-2 rounded-lg shadow-xl border-2 border-purple-900 transform -rotate-6 font-hindi font-bold text-sm tracking-wide">
              <span>भर्ती में पारदर्शिता हो</span>
            </div>

            {/* Rally Backdrop Placard Right */}
            <div className="hidden sm:block absolute top-12 -right-4 z-10 bg-white text-navy-900 px-4 py-2.5 rounded-lg shadow-xl border-2 border-purple-900 transform rotate-6 font-hindi font-black text-sm tracking-wide text-center">
              <span>RPSC / RSSB</span>
              <span className="block text-xs font-bold text-purple-900">में जवाबदेही हो</span>
            </div>

            {/* Main Portrait Card */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-800/40 bg-gradient-to-t from-purple-950 via-purple-900 to-purple-800 group">
              <Image
                src="/images/satyendra_hero.png"
                alt="Satyendra Rao - Youth Reform Movement Leader"
                fill
                priority
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />

              {/* Bottom Card Ribbon */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">
                    {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
                  </h3>
                  <p className="text-xs font-semibold text-accent-yellow">
                    {isHindi ? 'संयोजक, युवा सुधार आंदोलन' : 'Convener, Youth Reform Movement'}
                  </p>
                </div>
                <div className="bg-purple-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-purple-700">
                  {isHindi ? 'न्याय संकल्प' : 'Justice Pledge'}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <VideoModal
          videoId="5Qn-jD4pX7w"
          title={isHindi ? 'जयपुर युवा महापंचायत में सत्येंद्र राव का उद्बोधन' : 'Satyendra Rao Address at Jaipur Youth Maha-Panchayat'}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </section>
  );
}

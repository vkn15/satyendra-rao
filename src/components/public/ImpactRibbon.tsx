'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Compass, Megaphone, Newspaper, UserCheck } from 'lucide-react';

export default function ImpactRibbon() {
  const { t } = useLanguage();

  const metrics = [
    {
      icon: Users,
      value: t.impactMetric1Value,
      label: t.impactMetric1Label,
    },
    {
      icon: Compass,
      value: t.impactMetric2Value,
      label: t.impactMetric2Label,
    },
    {
      icon: Megaphone,
      value: t.impactMetric3Value,
      label: t.impactMetric3Label,
    },
    {
      icon: Newspaper,
      value: t.impactMetric4Value,
      label: t.impactMetric4Label,
    },
    {
      icon: UserCheck,
      value: t.impactMetric5Value,
      label: t.impactMetric5Label,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-purple-900 to-[#2A0845] text-white py-10 border-t border-purple-800">
      {/* Subtle Rajasthan Fort Silhouette Vector Background on the Right */}
      <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none w-96 h-36">
        <svg viewBox="0 0 400 150" fill="currentColor" className="w-full h-full text-white">
          <path d="M0,150 L0,120 L30,120 L30,100 L40,100 L40,80 L50,80 L50,60 L60,60 L60,80 L70,80 L70,100 L90,100 L90,120 L120,120 L120,90 L130,90 L130,50 L140,50 L140,30 L150,30 L150,15 L160,15 L160,30 L170,30 L170,50 L180,50 L180,90 L210,90 L210,110 L240,110 L240,70 L250,70 L250,45 L260,45 L260,20 L270,20 L270,45 L280,45 L280,70 L300,70 L300,110 L330,110 L330,100 L340,100 L340,80 L350,80 L350,65 L360,65 L360,80 L370,80 L370,100 L400,100 L400,150 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 items-center justify-between text-center">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-accent-yellow mb-2.5 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-hindi">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-purple-200 mt-1 font-hindi">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

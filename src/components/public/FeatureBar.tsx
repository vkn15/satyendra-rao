'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Clock, ShieldCheck, GraduationCap } from 'lucide-react';

export default function FeatureBar() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: t.feature1Title,
      desc: t.feature1Desc,
    },
    {
      icon: Clock,
      title: t.feature2Title,
      desc: t.feature2Desc,
    },
    {
      icon: ShieldCheck,
      title: t.feature3Title,
      desc: t.feature3Desc,
    },
    {
      icon: GraduationCap,
      title: t.feature4Title,
      desc: t.feature4Desc,
    },
  ];

  return (
    <section className="bg-royal-lavender py-5 border-y border-purple-200/60 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-purple-200/80">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 px-4 py-3 group hover:bg-white/60 rounded-xl transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-purple-900 group-hover:bg-purple-900 group-hover:text-white transition-colors duration-200 shrink-0 shadow-xs">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-sm md:text-[15px] font-bold text-navy-900 group-hover:text-purple-900 transition-colors font-hindi leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

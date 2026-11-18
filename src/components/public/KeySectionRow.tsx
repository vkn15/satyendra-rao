'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Scale, BookOpen, Users, CheckCircle2, ArrowRight, ClipboardList } from 'lucide-react';

export default function KeySectionRow() {
  const { t, isHindi } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 1. About Satyendra Rao Card */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-royal-surface rounded-2xl p-6 sm:p-7 border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300">
            <div>
              <div className="pb-2">
                <h3 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight font-hindi">
                  {t.aboutHeading}
                </h3>
                <div className="w-12 h-1 bg-purple-900 rounded-full mt-1.5" />
              </div>

              <div className="mt-4 space-y-3 text-slate-700 text-sm leading-relaxed">
                <p>{t.aboutParagraph1}</p>
                <p className="text-slate-600">{t.aboutParagraph2}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-purple-100/80">
              <a
                href="/about"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-900 hover:text-purple-950 px-4 py-2 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 transition-colors shadow-xs"
              >
                <span>{t.btnKnowMore}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Cropped Photo from Poster */}
              <div className="relative w-20 h-24 rounded-xl overflow-hidden shadow-md border-2 border-purple-200 shrink-0 bg-purple-50">
                <Image
                  src="/images/satyendra_about.png"
                  alt="Satyendra Rao"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* 2. Key Campaigns Card */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-royal-surface rounded-2xl p-6 sm:p-7 border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300">
            <div>
              <div className="pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight font-hindi">
                    {t.campaignsHeading}
                  </h3>
                  <div className="w-12 h-1 bg-purple-900 rounded-full mt-1.5" />
                </div>
                <a
                  href="/campaigns"
                  className="text-xs font-bold text-purple-700 hover:text-purple-900"
                >
                  {isHindi ? 'सभी देखें →' : 'View all →'}
                </a>
              </div>

              <div className="mt-5 space-y-3">
                {/* Campaign 1: SI Re-Exam */}
                <a
                  href="/campaigns#si-recruitment-re-exam"
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-900 group-hover:bg-purple-900 group-hover:text-white transition-colors shrink-0">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 group-hover:text-purple-900 transition-colors font-hindi">
                        {t.campaign1Title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {t.campaign1Sub}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all" />
                </a>

                {/* Campaign 2: RPSC / RSSB Reforms */}
                <a
                  href="/campaigns#rpsc-rssb-structural-reforms"
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-900 group-hover:bg-purple-900 group-hover:text-white transition-colors shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 group-hover:text-purple-900 transition-colors font-hindi">
                        {t.campaign2Title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {t.campaign2Sub}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all" />
                </a>

                {/* Campaign 3: Teacher Recruitment */}
                <a
                  href="/campaigns#teacher-recruitment-calendar"
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-900 group-hover:bg-purple-900 group-hover:text-white transition-colors shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 group-hover:text-purple-900 transition-colors font-hindi">
                        {t.campaign3Title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {t.campaign3Sub}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>
            </div>

            <div className="mt-4 pt-3 text-right">
              <span className="text-xs font-semibold text-purple-900/80">
                {isHindi ? '1.42 लाख से अधिक युवा सहभागी' : 'Over 142K+ Youth Mobilized'}
              </span>
            </div>
          </div>

          {/* 3. Youth Reform Charter (Deep Purple Themed Card from Poster) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-br from-purple-950 via-purple-900 to-purple-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-purple-800">
            <div>
              <div className="flex items-center gap-3 pb-1">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-accent-yellow">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {t.charterHeading}
                  </h3>
                  <p className="text-xs text-purple-200 font-medium font-hindi">
                    {t.charterSubtitle}
                  </p>
                </div>
              </div>

              {/* 5 Points from Poster */}
              <ul className="mt-5 space-y-2.5 text-xs sm:text-[13px] font-medium text-purple-100 font-hindi">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
                  <span>{t.charterPoint1}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
                  <span>{t.charterPoint2}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
                  <span>{t.charterPoint3}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
                  <span>{t.charterPoint4}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
                  <span>{t.charterPoint5}</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15">
              <a
                href="/charter"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-white text-purple-950 hover:bg-accent-yellow hover:text-navy-900 transition-colors shadow-md"
              >
                <span>{t.btnReadFullCharter}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, CheckCircle2, Shield, Award, Users } from 'lucide-react';

export default function AboutSectionRefined() {
  const { isHindi } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#0D0818] text-white py-20 lg:py-28 border-y border-purple-900/40">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Giant Monolithic Watermark Title matching Image 3 Reference */}
        <div className="relative mb-2">
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white/[0.07] select-none tracking-tight font-serif block -mb-8 sm:-mb-12">
            About
          </span>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-10 bg-accent-yellow rounded-full" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight font-hindi">
              {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
            </h2>
          </div>
        </div>

        {/* Subtitle / Roles */}
        <div className="mt-2 mb-8">
          <p className="text-accent-yellow font-semibold text-sm sm:text-base tracking-wider uppercase font-hindi">
            {isHindi 
              ? 'सामाजिक कार्यकर्ता • युवा पैरोकार • जननीति विशेषज्ञ' 
              : 'Social Activist • Youth Advocate • Public Policy'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Sophisticated Editorial Biography */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-hindi">
            
            {isHindi ? (
              <>
                <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
                  सत्येंद्र राव एक <em className="text-accent-yellow not-italic font-bold">समर्पित युवा पैरोकार</em>, जननीति विश्लेषक और जमीनी आंदोलनकारी हैं, जिनका जीवन प्रतियोगी परीक्षा अभ्यर्थियों के अधिकारों और निष्पक्ष चयन तंत्र की स्थापना के लिए समर्पित है।
                </p>

                <p className="text-slate-300">
                  वे राजस्थान और देश भर में भर्ती प्रक्रियाओं में व्यवस्थागत विलंब, पेपर लीक सिंडिकेट्स और प्रशासनिक अपारदर्शिता के विरुद्ध एक सतत जनक्रांति का नेतृत्व कर रहे हैं। उन्होंने प्रदेश के 33 जिलों में 100 से अधिक जनसंवाद सम्मेलनों का सफल आयोजन कर 1.4 लाख से अधिक युवाओं को एकजुट किया है।
                </p>

                <p className="text-slate-300">
                  सत्येंद्र राव का स्पष्ट विज़न है कि <strong className="text-white font-semibold">90 दिवसीय भर्ती समय-सीमा</strong>, ओएमआर की डिजिटल कार्बन प्रतियां और सख्त नकल विरोधी कानून लागू कर हर मेधावी ग्रामीण युवा के संवैधानिक हक की गारंटी दी जाए।
                </p>
              </>
            ) : (
              <>
                <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
                  Satyendra Rao is a <em className="text-accent-yellow not-italic font-bold">dedicated youth advocate</em>, public policy analyst, and grassroots organizer whose movement bridges aspiring students with institutional accountability.
                </p>

                <p className="text-slate-300">
                  He is the convener of the Youth Reform Movement, an initiative committed to institutional integrity in state recruitment commissions. Over five years, he has convened more than 100 district-level public dialogues across Rajasthan, documenting examination bottlenecks and fighting against organized paper leak syndicates.
                </p>

                <p className="text-slate-300">
                  Through his advocacy, Satyendra Rao demands a <strong className="text-white font-semibold">statutory 90-day recruitment ceiling</strong>, tamper-proof digital OMR verification, and judicial fast-track tribunals so that no student's generational dream is crushed by administrative failure.
                </p>
              </>
            )}

            {/* Credential Tags matching reference */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-purple-200">
                <CheckCircle2 className="w-4 h-4 text-accent-yellow" />
                <span>{isHindi ? '100+ जिला स्तरीय जनसंवाद' : '100+ District Dialogues'}</span>
              </span>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-purple-200">
                <Shield className="w-4 h-4 text-accent-yellow" />
                <span>{isHindi ? '10-सूत्रीय युवा सुधार चार्टर' : '10-Point Youth Charter'}</span>
              </span>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-purple-200">
                <Users className="w-4 h-4 text-accent-yellow" />
                <span>{isHindi ? '1.4 लाख+ सक्रिय समर्थक' : '140K+ Pledged Aspirants'}</span>
              </span>
            </div>

            {/* Action Links */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              <a
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-sm shadow-xl transition-all border border-purple-600/40"
              >
                <span>{isHindi ? 'विस्तृत जीवन परिचय पढ़ें' : 'Read Full Biography'}</span>
                <ArrowRight className="w-4 h-4 text-accent-yellow" />
              </a>

              <a
                href="/charter"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/15 transition-all"
              >
                <span>{isHindi ? 'युवा चार्टर देखें' : 'View Youth Charter'}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Atmospheric Portrait of Satyendra Rao */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Ambient Background Behind Image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-800/20 to-amber-500/10 rounded-3xl blur-2xl -z-10" />

            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#160E24] group">
              <Image
                src="/images/satyendra_real.jpg"
                alt="Satyendra Rao"
                fill
                priority
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />

              {/* Bottom Subtle Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0818] via-transparent to-transparent opacity-80" />

              {/* Caption Overlay */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-white font-hindi">
                    {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
                  </h4>
                  <p className="text-xs text-accent-yellow font-medium">
                    {isHindi ? 'संयोजक, युवा सुधार आंदोलन' : 'Convener, Youth Reform Movement'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-900/90 text-white border border-purple-700">
                  Rajasthan
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { Award, Compass, Heart, Shield, Users, ArrowRight, CheckCircle2, BookOpen, Quote } from 'lucide-react';

export default function AboutPage() {
  const { isHindi } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0818]">
      <Navbar />

      <main className="flex-1 text-white">
        
        {/* Hero Section matching Image 3 (Aabhas Maldahiyar About layout) */}
        <section className="relative overflow-hidden pt-16 pb-24 border-b border-purple-900/40">
          
          {/* Subtle Glows */}
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Watermark Heading */}
            <div className="mb-2">
              <span className="text-7xl sm:text-8xl lg:text-9xl font-black text-white/[0.08] select-none tracking-tight font-serif block -mb-8 sm:-mb-14">
                About
              </span>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-12 bg-accent-yellow rounded-full" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-hindi">
                  {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
                </h1>
              </div>
            </div>

            {/* Tagline */}
            <div className="mt-3 mb-10">
              <p className="text-accent-yellow font-semibold text-sm sm:text-base tracking-wider uppercase font-hindi">
                {isHindi 
                  ? 'सामाजिक कार्यकर्ता • युवा पैरोकार • जननीति विशेषज्ञ' 
                  : 'Social Activist • Youth Advocate • Public Policy'}
              </p>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Comprehensive Bio */}
              <div className="lg:col-span-7 space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-hindi">
                
                {isHindi ? (
                  <>
                    <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
                      "जब तक एक सामान्य किसान-मजदूर के बेटे और बेटी को उसकी 14 घंटे की कड़ी पढ़ाई का पारदर्शी फल नहीं मिलता, तब तक हमारा सत्याग्रह निरंतर जारी रहेगा।"
                    </p>

                    <p>
                      सत्येंद्र राव राजस्थान और देश के लाखों प्रतियोगी परीक्षा अभ्यर्थियों के अधिकारों, निष्पक्ष चयन और पारदर्शी परीक्षा तंत्र की स्थापना हेतु समर्पित जननेता हैं। छात्र जीवन से ही उन्होंने युवाओं पर बेरोजगारी के भारी दबाव, पेपर लीक के दंश और परिणाम लटकने की व्यवस्थागत पीड़ा को नजदीक से देखा है।
                    </p>

                    <p>
                      उन्होंने राजस्थान के सभी 33 जिलों में 100 से अधिक <em className="text-accent-yellow not-italic font-bold">युवा जनसंवाद सम्मेलनों</em> का आयोजन किया है। इन सम्मेलनों में अभ्यर्थियों द्वारा साझा किए गए वास्तविक अनुभवों के आधार पर उन्होंने ऐतिहासिक <strong className="text-white">10-सूत्रीय युवा सुधार चार्टर</strong> तैयार कर मुख्य शासन सचिव एवं नीति-निर्माताओं को प्रस्तुत किया।
                    </p>

                    <p>
                      सत्येंद्र राव का स्पष्ट मत है कि भर्ती आयोगों में अध्यक्ष एवं सदस्यों की नियुक्तियों में गैर-राजनीतिक योग्यता मानक लागू हों, ओएमआर की डिजिटल कार्बन प्रतियां 48 घंटे में ऑनलाइन की जाएं और 90 दिनों में नियुक्ति पत्र देने की वैधानिक बाध्यता तय की जाए।
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
                      "Until the daughter of a daily wage worker and the son of a marginal farmer receive the uncompromised fruit of their relentless toil, our movement will not rest."
                    </p>

                    <p>
                      Satyendra Rao is a <em className="text-accent-yellow not-italic font-bold">dedicated youth advocate</em>, public policy analyst, and grassroots organizer whose movement bridges aspiring students with institutional accountability across India and Rajasthan.
                    </p>

                    <p>
                      Over five years, he convened more than 100 district-level public dialogues across all 33 districts of Rajasthan. Informed by the testimonies of thousands of hardworking aspirants, he authored the historic <strong className="text-white">10-Point Youth Reform Charter</strong> submitted to governance secretariats.
                    </p>

                    <p>
                      His leadership champions a statutory 90-day recruitment ceiling, depoliticized collegium appointments to recruitment commissions, digital barcode OMR verification, and judicial fast-track tribunals for paper leak cartels.
                    </p>
                  </>
                )}

                {/* 3 Value Pillars */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <Shield className="w-5 h-5 text-accent-yellow" />
                    <h4 className="text-sm font-bold text-white font-hindi">
                      {isHindi ? 'पारदर्शिता' : 'Transparency'}
                    </h4>
                    <p className="text-xs text-slate-400 font-hindi">
                      {isHindi ? 'डिजिटल ओएमआर व उत्तर कुंजी सार्वजनिक हो' : 'Digital OMR verification & open keys'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <Award className="w-5 h-5 text-accent-yellow" />
                    <h4 className="text-sm font-bold text-white font-hindi">
                      {isHindi ? 'समयबद्धता' : 'Time-Bound'}
                    </h4>
                    <p className="text-xs text-slate-400 font-hindi">
                      {isHindi ? 'विज्ञप्ति से नियुक्ति तक अधिकतम 90 दिन' : 'Strict 90-day recruitment ceiling'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <Users className="w-5 h-5 text-accent-yellow" />
                    <h4 className="text-sm font-bold text-white font-hindi">
                      {isHindi ? 'समान न्याय' : 'Merit Justice'}
                    </h4>
                    <p className="text-xs text-slate-400 font-hindi">
                      {isHindi ? 'माफियाओं पर आजीवन कारावास व संपत्ति कुर्की' : 'Life imprisonment for paper leak syndicates'}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="/volunteer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm shadow-xl transition-all"
                  >
                    <span>{isHindi ? 'सत्याग्रह से जुड़ें' : 'Join the Movement'}</span>
                    <ArrowRight className="w-4 h-4 text-accent-yellow" />
                  </a>

                  <a
                    href="/charter"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
                  >
                    <span>{isHindi ? '10-सूत्रीय चार्टर पढ़ें' : 'Read 10-Point Charter'}</span>
                  </a>
                </div>

              </div>

              {/* Right Column: New Satyendra Rao Portrait */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 bg-[#160E24]">
                  <Image
                    src="/images/satyendra_real.jpg"
                    alt="Satyendra Rao - Youth Advocate"
                    fill
                    priority
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0818] via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-6 inset-x-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                    <h3 className="text-lg font-black text-white font-hindi">
                      {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
                    </h3>
                    <p className="text-xs text-accent-yellow font-medium">
                      {isHindi ? 'संयोजक, युवा सुधार आंदोलन' : 'Convener, Youth Reform Movement'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Impact Ribbon */}
        <ImpactRibbon />
      </main>

      <Footer />
    </div>
  );
}

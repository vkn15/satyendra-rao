'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { Award, Compass, Heart, Shield, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const { isHindi } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-gradient-to-b from-purple-950 via-purple-900 to-[#1F0A38] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-yellow text-xs font-bold uppercase tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>{isHindi ? 'जीवन एवं जनसंकल्प' : 'Biography & Mission'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-hindi">
                {isHindi ? 'सत्येंद्र राव: युवाओं के हक और परीक्षा सुधारों की बुलंद आवाज' : 'Satyendra Rao: Voice for Youth Rights and Exam Reforms'}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-purple-200 leading-relaxed font-hindi">
                {isHindi 
                  ? 'राजस्थान और भारत के लाखों प्रतियोगी अभ्यर्थियों के अधिकारों, निष्पक्ष चयन और पारदर्शी परीक्षा तंत्र की स्थापना हेतु समर्पित जीवन।'
                  : 'Dedicated to fair recruitments, systemic transparency, and the fundamental right to meritocracy for millions of aspiring youth.'}
              </p>
            </div>
          </div>
        </section>

        {/* Biography Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-100 bg-purple-50">
                  <Image
                    src="/images/satyendra_hero.png"
                    alt="Satyendra Rao"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent text-white">
                    <p className="font-bold text-lg">{isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}</p>
                    <p className="text-xs text-accent-yellow">{isHindi ? 'सामाजिक कार्यकर्ता एवं युवा पैरोकार' : 'Social Activist & Youth Advocate'}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6 text-slate-700 leading-relaxed">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-navy-900 font-hindi">
                    {isHindi ? 'संघर्ष, संवेदनशीलता और सत्य का मार्ग' : 'The Journey of Conviction and Public Service'}
                  </h2>
                  <div className="w-16 h-1 bg-purple-900 rounded-full mt-2" />
                </div>

                {isHindi ? (
                  <>
                    <p className="text-base sm:text-lg text-slate-800 font-medium font-hindi">
                      "जब तक एक गरीब किसान के बेटे और मजदूर की बेटी को उसकी कड़ी मेहनत का निष्पक्ष फल नहीं मिलता, तब तक हमारा जनआंदोलन थमेगा नहीं।"
                    </p>
                    <p className="text-sm sm:text-base font-hindi">
                      सत्येंद्र राव ने छात्र जीवन से ही युवाओं की समस्याओं, बेरोजगारी के मानसिक दबाव और भर्ती संस्थाओं की अपारदर्शिता को बेहद करीब से महसूस किया। उन्होंने राजस्थान के 33 जिलों में 100 से अधिक जनसंवाद सभाओं का आयोजन किया, जहाँ हजारों अभ्यर्थियों ने परीक्षा धांधली और विलंब की अपनी पीड़ा साझा की।
                    </p>
                    <p className="text-sm sm:text-base font-hindi">
                      यह आंदोलन किसी दल या राजनीतिक स्वार्थ से परे है। यह युवाओं के आत्मसम्मान, उनकी मेहनत के संरक्षण और परीक्षा संस्थाओं में संवैधानिक जवाबदेही स्थापित करने का एक सतत सत्याग्रह है।
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base sm:text-lg text-slate-800 font-medium">
                      "Until the daughter of a daily wage worker and the son of a marginal farmer receive the uncompromised fruit of their relentless toil, our movement will not rest."
                    </p>
                    <p className="text-sm sm:text-base">
                      Satyendra Rao experienced firsthand the structural distress and psychological toll inflicted on students by bureaucratic opacity and recurrent examination paper leaks. Over five years, he convened more than 100 grassroots youth dialogues across all districts of Rajasthan.
                    </p>
                    <p className="text-sm sm:text-base">
                      This movement transcends partisan politics. It is a constitutional satyagraha centered on student dignity, time-bound governance, and institutional accountability.
                    </p>
                  </>
                )}

                {/* Core Pillars */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-900 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 font-hindi">
                        {isHindi ? 'भ्रष्टाचार मुक्त चयन' : 'Zero Malpractice Merit'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 font-hindi">
                        {isHindi ? 'कठोर नकल विरोधी कानून व फास्ट ट्रैक न्याय' : 'Strict anti-leak laws and special tribunals'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-900 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 font-hindi">
                        {isHindi ? 'समान अवसर व सुरक्षा' : 'Equal Opportunity'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 font-hindi">
                        {isHindi ? 'ग्रामीण छात्रों को समान संसाधन व निःशुल्क यात्रा' : 'Rural youth parity and transit protection'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="/volunteer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <span>{isHindi ? 'सत्येंद्र राव के साथ जुड़ें' : 'Join Hands with Satyendra Rao'}</span>
                    <ArrowRight className="w-4 h-4 text-accent-yellow" />
                  </a>
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

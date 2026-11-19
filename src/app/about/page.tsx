'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  MapPin, 
  Calendar, 
  FileText,
  Scale,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  const { isHindi } = useLanguage();

  const milestones = [
    {
      year: '2021 - 2022',
      title_hi: 'ग्रामीण छात्र संवाद एवं प्रथम सत्याग्रह',
      title_en: 'Grassroots Aspirant Dialogues & First Satyagraha',
      desc_hi: 'सीकर, कोटा और जयपुर के कोचिंग हॉस्टलों में रहकर 10,000+ प्रतियोगी छात्रों से प्रत्यक्ष संवाद। पेपर लीक के विरुद्ध राज्यव्यापी मांग पत्र तैयार किया गया।',
      desc_en: 'Direct dialogue with 10,000+ competitive students in Sikar, Kota, and Jaipur hostels, formalizing the first statewide anti-leak charter.'
    },
    {
      year: '2023',
      title_hi: 'अजमेर से जयपुर 135 किमी विशाल पदयात्रा',
      title_en: '135 km Historic Foot March (Ajmer to Jaipur)',
      desc_hi: 'आरपीएससी में पारदर्शिता और 90 दिवसीय भर्ती समय-सीमा की मांग को लेकर 10,000 युवाओं के साथ ऐतिहासिक शांतिपूर्ण पदयात्रा।',
      desc_en: 'A historic peaceful padyatra mobilizing 10,000 youth from RPSC headquarters in Ajmer to the state capital Jaipur.'
    },
    {
      year: '2024 - 2025',
      title_hi: 'जयपुर युवा महापंचायत: 50,000 अभ्यर्थियों का ऐतिहासिक जमावड़ा',
      title_en: 'Jaipur Youth Maha-Panchayat: 50,000 Strong Conclave',
      desc_hi: 'एसआई भर्ती एवं शिक्षक भर्ती में धांधली की निष्पक्ष जांच और पारदर्शी पुनः परीक्षा हेतु ऐतिहासिक जनसमर्थन।',
      desc_en: 'Historic gathering of 50,000 students in Jaipur demanding unbiased investigation into tainted exams and transparent re-tests.'
    },
    {
      year: '2026',
      title_hi: '10-सूत्रीय "युवा सुधार चार्टर" का वैधानिक प्रारूप',
      title_en: 'Statutory 10-Point Youth Reform Charter',
      desc_hi: 'मुख्य शासन सचिवालय में प्रस्तुत: परीक्षा केंद्रों का जिला स्तर आवंटन, परीक्षा बीमा, बायोमेट्रिक सुरक्षा और स्वतंत्र युवा लोकपाल।',
      desc_en: 'Presented to state administration: district-level centers, candidate exam insurance, biometric vetting, and an independent Youth Lokpal.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0A10] text-slate-100">
      <Navbar />

      <main className="flex-1">
        
        {/* Exact UI matching the Aabhas Maldahiyar reference image */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0A080F] via-[#0E0C16] to-[#0A080F] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-purple-950/60">
          
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Authoritative Editorial Typography matching Screenshot */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Large Muted "About" Title - Exact Screenshot Aesthetic */}
                <div>
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif text-[#A8A28E] tracking-tight leading-none select-none">
                    About
                  </h1>

                  {/* Leader Name in Bold Crisp White */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-3 font-hindi">
                    {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
                  </h2>

                  {/* Subtitle / Roles in Warm Amber / Gold */}
                  <p className="text-sm sm:text-base font-bold text-accent-yellow tracking-wide mt-2 font-hindi uppercase">
                    {isHindi 
                      ? 'सामाजिक कार्यकर्ता • युवा पैरोकार • जननीति विशेषज्ञ'
                      : 'Social Activist • Youth Advocate • Public Policy Analyst'}
                  </p>
                </div>

                {/* Editorial Body Text with Italic Emphasis */}
                <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-hindi pt-2">
                  {isHindi ? (
                    <>
                      <p className="leading-relaxed">
                        सत्येंद्र राव एक <em>समर्पित सामाजिक कार्यकर्ता</em>, युवा पैरोकार और नीतिगत सुधारक हैं, जिनका पांच वर्षों का निरंतर संघर्ष राजस्थान के लाखों गरीब और ग्रामीण अभ्यर्थियों की पीड़ा को संवैधानिक हकों में बदलने का काम कर रहा है।
                      </p>
                      <p className="leading-relaxed">
                        वे <em>युवा सुधार आंदोलन</em> के संस्थापक एवं संयोजक हैं—एक ऐसा गैर-राजनीतिक जनसत्याग्रह जो भर्ती परीक्षाओं में संगठित पेपर लीक माफियाओं के खात्मे, डिजिटल ओएमआर सुरक्षा, 90 दिनों की निश्चित परीक्षा समय-सीमा और पारदर्शी चयन प्रणाली के लिए संघर्षरत है।
                      </p>
                      <p className="leading-relaxed">
                        राजस्थान के 33 जिलों में 100 से अधिक जनसंवाद सभाओं और अजमेर से जयपुर की 135 किमी की पदयात्रा के माध्यम से सत्येंद्र राव ने प्रशासनिक अपारदर्शिता को खुली चुनौती दी है। उनके द्वारा तैयार <em>10-सूत्रीय युवा सुधार चार्टर</em> आज प्रदेश के हर छात्र और युवा की आशा का प्रतीक बन चुका है।
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="leading-relaxed">
                        Satyendra Rao is a <em>dedicated social activist</em>, youth advocate, and public policy reformist whose sustained five-year grassroots movement bridges the aspirations of competitive students with constitutional guarantees of fair, uncompromised recruitments.
                      </p>
                      <p className="leading-relaxed">
                        He is the founder and convener of the <em>Youth Reform Movement</em>, a statewide non-partisan satyagraha committed to dismantling organized paper leak syndicates through statutory time-bound ceilings, tamper-proof digital OMR archiving, and institutional accountability in public service commissions.
                      </p>
                      <p className="leading-relaxed">
                        Through over 100 public townhalls across 33 districts of Rajasthan and the historic 135 km Ajmer-to-Jaipur march, Satyendra Rao challenges bureaucratic opacity, delivering evidence-backed policy solutions encapsulated in the widely acclaimed <em>10-Point Youth Reform Charter</em>.
                      </p>
                    </>
                  )}
                </div>

                {/* Key Pillars Badge Row */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-accent-yellow" />
                    <span>{isHindi ? '100% गैर-राजनीतिक जनआंदोलन' : 'Non-Partisan Movement'}</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-accent-yellow" />
                    <span>{isHindi ? 'संवैधानिक युवा परीक्षा अधिकार' : 'Statutory Candidate Rights'}</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-accent-yellow" />
                    <span>{isHindi ? '30 लाख+ युवाओं का अटूट विश्वास' : '3 Million+ Youth Mobilized'}</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href="/charter"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-sm shadow-xl transition-all"
                  >
                    <span>{isHindi ? 'युवा सुधार चार्टर पढ़ें' : 'Read Youth Charter'}</span>
                    <ArrowRight className="w-4 h-4 text-accent-yellow" />
                  </a>

                  <a
                    href="/volunteer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
                  >
                    <Users className="w-4 h-4 text-accent-yellow" />
                    <span>{isHindi ? 'आंदोलन से जुड़ें' : 'Join the Movement'}</span>
                  </a>
                </div>

              </div>

              {/* Right Column: Exact Match to the Aabhas Maldahiyar Photo Composition */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                
                {/* Glow Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent rounded-3xl blur-2xl pointer-events-none" />

                {/* Photo Container */}
                <div className="relative w-full max-w-[430px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#161220] group">
                  <Image
                    src="/images/satyendra_rao_new.jpg"
                    alt="Satyendra Rao"
                    fill
                    priority
                    className="object-cover object-top filter contrast-[1.05] brightness-[0.98] group-hover:scale-102 transition-transform duration-700"
                  />

                  {/* Atmospheric Vignette overlay matching the screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A10] via-transparent to-black/20" />

                  {/* Subtle Bottom Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#0C0A10] via-[#0C0A10]/80 to-transparent">
                    <p className="text-white font-black text-lg tracking-tight font-hindi">
                      {isHindi ? 'सत्येंद्र राव' : 'Satyendra Rao'}
                    </p>
                    <p className="text-xs text-accent-yellow font-bold uppercase tracking-wider font-hindi">
                      {isHindi ? 'संयोजक • युवा सुधार आंदोलन' : 'Convener • Youth Reform Movement'}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Milestones & Timeline Section */}
        <section className="py-20 bg-[#0F0D17] border-b border-purple-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-bold text-accent-yellow uppercase tracking-widest block mb-2 font-hindi">
                {isHindi ? 'सत्याग्रह का ऐतिहासिक सफर' : 'The Movement Timeline'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-hindi">
                {isHindi ? 'सड़क से सचिवालय तक: युवाओं का निर्णायक संघर्ष' : 'From Grassroots Protests to Policy Transformation'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-600/50 hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-black bg-purple-900/80 text-accent-yellow border border-purple-700">
                      {m.year}
                    </div>

                    <h3 className="text-base font-bold text-white font-hindi leading-snug">
                      {isHindi ? m.title_hi : m.title_en}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-hindi">
                      {isHindi ? m.desc_hi : m.desc_en}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-purple-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-yellow" />
                    <span>{isHindi ? 'सत्याग्रह उपलब्धि' : 'Milestone Achieved'}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 3 Core Philosophical Tenets */}
        <section className="py-20 bg-[#0A080F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-900/80 flex items-center justify-center text-accent-yellow">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white font-hindi">
                  {isHindi ? '1. परीक्षा पारदर्शिता की गारंटी' : '1. Uncompromised Transparency'}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-hindi">
                  {isHindi 
                    ? 'ओएमआर शीट की डिजिटल स्कैन प्रति 48 घंटे में जारी हो। प्रश्नपत्र निर्माण से लेकर उत्तर कुंजी निस्तारण तक हर प्रक्रिया का निष्पक्ष ऑडिट अनिवार्य किया जाए।'
                    : 'Scanned digital carbon copies of OMR sheets published online within 48 hours. Independent audit across test setting and objection resolution.'}
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-900/80 flex items-center justify-center text-accent-yellow">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white font-hindi">
                  {isHindi ? '2. 90 दिवसीय भर्ती समय-सीमा' : '2. Statutory 90-Day Ceiling'}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-hindi">
                  {isHindi 
                    ? 'विज्ञप्ति से लेकर नियुक्ति पत्र देने तक अधिकतम 90 दिनों की वैधानिक सीमा हो। न्यायालयीन मुकदमों में वर्षों तक भर्तियां अटकाने वाले अधिकारियों पर जुर्माना तय हो।'
                    : 'A non-negotiable statutory limit of 90 days from notification to appointment, eliminating administrative inertia and candidate mental fatigue.'}
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-900/80 flex items-center justify-center text-accent-yellow">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white font-hindi">
                  {isHindi ? '3. ग्रामीण युवाओं को समान अवसर' : '3. Rural Candidate Parity'}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-hindi">
                  {isHindi 
                    ? 'परीक्षा केंद्र 150 किमी के भीतर आवंटित हों, अभ्यर्थियों को रोडवेज बसों में निःशुल्क यात्रा मिले और प्रशासनिक विफलता से परीक्षा रद्द होने पर ₹5,000 की क्षतिपूर्ति दी जाए।'
                    : 'Examination centers within 150 km, guaranteed free transit on state buses, and ₹5,000 state compensation per candidate if an exam is cancelled.'}
                </p>
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

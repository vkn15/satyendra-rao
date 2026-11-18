'use client';

import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import HomeVolunteerSection from '@/components/public/HomeVolunteerSection';
import { useLanguage } from '@/context/LanguageContext';
import { Users, CheckCircle2, Shield, HeartHandshake, Compass } from 'lucide-react';

export default function VolunteerPage() {
  const { isHindi } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-purple-950 via-purple-900 to-[#1D0833] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-yellow text-xs font-bold uppercase tracking-wider mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>{isHindi ? 'सत्याग्रह सहभागिता' : 'Volunteer Mobilization'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-hindi">
                {isHindi ? 'सत्येंद्र राव युवा सुधार आंदोलन के कार्यकर्ता बनें' : 'Join as a Youth Reform Volunteer'}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-purple-200 leading-relaxed font-hindi">
                {isHindi 
                  ? 'राजस्थान के प्रत्येक जिले, तहसील और महाविद्यालय में निष्पक्ष परीक्षा प्रणाली और पारदर्शी भर्ती प्रक्रिया की स्थापना हेतु हमारे साथ कदम से कदम मिलाएं।'
                  : 'Empower student rights, build local campus chapters, and fight for examination integrity across India.'}
              </p>
            </div>
          </div>
        </section>

        {/* Roles Breakdown */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 text-center font-hindi mb-12">
              {isHindi ? 'आंदोलन में आपकी भूमिका (Volunteer Roles)' : 'How You Can Contribute'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-7 rounded-3xl bg-royal-surface border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-900">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-hindi">
                  {isHindi ? 'जिला एवं तहसील समन्वयक' : 'District & Tehsil Coordinator'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-hindi">
                  {isHindi 
                    ? 'स्थानीय जनसंवाद सभाओं का आयोजन, अभ्यर्थियों के मांग पत्र तैयार करना और प्रशासनिक अधिकारियों को ज्ञापन सौंपना।'
                    : 'Organize local youth townhalls, compile regional aspirant grievances and present memorandums to authorities.'}
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-royal-surface border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-900">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-hindi">
                  {isHindi ? 'विधिक एवं आरटीआई शोध दल' : 'Legal & RTI Research Cell'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-hindi">
                  {isHindi 
                    ? 'भर्ती आयोगों से आरटीआई के माध्यम से सूचनाएं निकलवाना, ओएमआर धांधली के साक्ष्य संकलित करना और विधिक याचिकाएं तैयार करना।'
                    : 'File RTI queries, research recruitment commission data, and compile evidence for PILs and judicial hearings.'}
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-royal-surface border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-900">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-hindi">
                  {isHindi ? 'डिजिटल प्रचार एवं छात्र सहायता' : 'Digital Outreach & Student Support'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-hindi">
                  {isHindi 
                    ? 'सोशल मीडिया पर युवाओं के मुद्दों को उठाना, परीक्षा अपडेट्स साझा करना और दूरदराज के छात्रों की मदद करना।'
                    : 'Disseminate verified news briefings, run awareness campaigns on Twitter/WhatsApp, and counsel rural students.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Volunteer Form Section */}
        <HomeVolunteerSection />

        <ImpactRibbon />
      </main>

      <Footer />
    </div>
  );
}

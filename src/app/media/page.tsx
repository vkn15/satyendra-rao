'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import VideoModal from '@/components/public/VideoModal';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Play, Video, Eye, Clock, Calendar, Newspaper, ExternalLink } from 'lucide-react';

export default function MediaPage() {
  const { isHindi } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const videos = [
    {
      id: '5Qn-jD4pX7w',
      title_hi: 'जयपुर महापंचायत में 50,000 युवाओं को सत्येंद्र राव का ऐतिहासिक संबोधन',
      title_en: 'Satyendra Rao Addresses 50,000 Youth at Jaipur Maha-Panchayat',
      desc_hi: 'भर्ती संस्थाओं में जवाबदेही, तय समय सीमा और युवाओं के अधिकारों की कानूनी गारंटी पर ऐतिहासिक उद्बोधन।',
      desc_en: 'Historic address at Jaipur youth assembly calling for accountability, time-bound recruitments and exam security.',
      duration: '18:45',
      views: '1.42 लाख+',
      date: '15 दिन पूर्व',
      category: 'Keynote Speech',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '9B6yK9E1l4M',
      title_hi: 'SI भर्ती परीक्षा में धांधली का खुलासा और पारदर्शी पुनः परीक्षा की मांग',
      title_en: 'SI Exam Irregularities Exposed: Evidence and Demand for Re-Exam',
      desc_hi: 'तथ्यों और साक्ष्यों के साथ प्रेस वार्ता: योग्य अभ्यर्थियों के न्याय हेतु पुनः परीक्षा की पुरजोर मांग।',
      desc_en: 'Detailed press briefing highlighting documented irregularities and calling for fair opportunity for genuine candidates.',
      duration: '24:10',
      views: '98 हजार+',
      date: '25 दिन पूर्व',
      category: 'Press Conference',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '3M8zW2kL5P0',
      title_hi: 'अजमेर से जयपुर विशाल पदयात्रा: युवाओं के संकल्प और संघर्ष की झलकियां',
      title_en: 'Foot March (Padyatra) from Ajmer to Jaipur: Highlights & Voices of Youth',
      desc_hi: '10,000 से अधिक युवाओं के साथ 135 किमी की ऐतिहासिक पदयात्रा का प्रेरणादायक वृत्तचित्र।',
      desc_en: 'Over 10,000 students walked 135 km with Satyendra Rao to demand youth reform charter implementation.',
      duration: '14:20',
      views: '86 हजार+',
      date: '35 दिन पूर्व',
      category: 'Documentary',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '7P1rT4uN8V9',
      title_hi: 'युवा सुधार चार्टर: युवाओं के हकों की कानूनी गारंटी के 10 मुख्य बिंदु',
      title_en: 'Youth Reform Charter Explained: 10 Actionable Policy Demands',
      desc_hi: 'सत्येंद्र राव द्वारा 10-सूत्रीय युवा सुधार चार्टर के हर बिंदु की सरल एवं प्रभावी व्याख्या।',
      desc_en: 'Explaining how the 10-point Youth Reform Charter guarantees transparent, time-bound examinations for every student.',
      duration: '12:35',
      views: '65 हजार+',
      date: '42 दिन पूर्व',
      category: 'Policy Explained',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const pressClippings = [
    {
      media: 'Dainik Bhaskar',
      headline_hi: 'सत्येंद्र राव के नेतृत्व में 1.5 लाख अभ्यर्थियों ने उठाई पुनः परीक्षा की मांग',
      headline_en: '1.5 Lakh Candidates Demand Re-Examination Under Satyendra Rao\'s Leadership',
      date: 'Nov 12, 2026'
    },
    {
      media: 'Rajasthan Patrika',
      headline_hi: 'आरपीएससी सुधारों पर सरकार को सौंपा 10 सूत्रीय युवा चार्टर',
      headline_en: '10-Point Youth Charter Submitted to Administration on RPSC Reforms',
      date: 'Nov 08, 2026'
    },
    {
      media: 'The Hindu',
      headline_hi: 'भर्ती परीक्षाओं में जवाबदेही हेतु जयपुर में विशाल छात्र महापंचायत',
      headline_en: 'Massive Youth Assembly in Jaipur Demanding Public Recruitment Accountability',
      date: 'Oct 29, 2026'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-purple-950 via-purple-900 to-[#1F0935] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-yellow text-xs font-bold uppercase tracking-wider mb-3">
                <Video className="w-3.5 h-3.5" />
                <span>{isHindi ? 'वीडियो भाषण एवं मीडिया गैलरी' : 'Video Speeches & Media'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-hindi">
                {isHindi ? 'मीडिया कवरेज एवं वीडियो उद्बोधन' : 'Media Coverage & Video Addresses'}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-purple-200 leading-relaxed font-hindi">
                {isHindi 
                  ? 'सत्येंद्र राव की प्रमुख प्रेस वार्ताएं, जनसभाएं, टीवी इंटरव्यू और समाचार पत्रों में प्रकाशित रिपोर्ट।'
                  : 'Watch video addresses, press briefings, and explore print and television media coverages.'}
              </p>
            </div>
          </div>
        </section>

        {/* Video Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 font-hindi mb-8">
              {isHindi ? 'प्रमुख वीडियो भाषण (Featured YouTube Videos)' : 'Featured YouTube Videos'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map(v => {
                const title = isHindi ? v.title_hi : v.title_en;
                const desc = isHindi ? v.desc_hi : v.desc_en;

                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        onClick={() => {
                          setActiveVideo({ id: v.id, title });
                          trackEvent('video_watch', { video_id: v.id, title });
                        }}
                        className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer group"
                      >
                        <Image
                          src={v.thumbnail}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-purple-900/95 text-white border-2 border-accent-yellow flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-purple-800 transition-transform">
                            <Play className="w-7 h-7 fill-current text-accent-yellow ml-0.5" />
                          </div>
                        </div>

                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-xs font-bold text-white flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          <span>{v.duration}</span>
                        </div>

                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-900/90 text-xs font-bold text-accent-yellow border border-purple-700">
                          {v.category}
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-semibold text-purple-900">
                            <Eye className="w-3.5 h-3.5" />
                            {v.views}
                          </span>
                          <span>•</span>
                          <span>{v.date}</span>
                        </div>

                        <h3 className="text-lg font-bold text-navy-900 font-hindi leading-snug">
                          {title}
                        </h3>

                        <p className="text-sm text-slate-600 leading-relaxed font-hindi">
                          {desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={() => {
                          setActiveVideo({ id: v.id, title });
                          trackEvent('video_watch', { video_id: v.id, title });
                        }}
                        className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-900 hover:text-white text-purple-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{isHindi ? 'अभी देखें (Watch Video)' : 'Watch Video'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Press Clippings Section */}
            <div className="mt-16">
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 font-hindi mb-8 flex items-center gap-2">
                <Newspaper className="w-7 h-7 text-purple-900" />
                <span>{isHindi ? 'समाचार पत्रों में कवरेज (Press Coverage)' : 'Press Coverage'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pressClippings.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold">
                        {item.media}
                      </span>
                      <span>{item.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-navy-900 font-hindi leading-snug">
                      {isHindi ? item.headline_hi : item.headline_en}
                    </h4>

                    <div className="pt-2">
                      <span className="text-xs font-bold text-purple-800 hover:text-purple-950 flex items-center gap-1">
                        <span>{isHindi ? 'प्रामाणिक कवरेज' : 'Verified Coverage'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        <ImpactRibbon />
      </main>

      <Footer />

      {activeVideo && (
        <VideoModal
          videoId={activeVideo.id}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}

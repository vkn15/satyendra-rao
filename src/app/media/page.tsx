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
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-black uppercase tracking-widest mb-2">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YOUTUBE CHANNEL</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-navy-900 font-hindi">
                  {isHindi ? 'नवीनतम वीडियो वक्तव्य (Recent Videos)' : 'Recent Video Addresses'}
                </h2>
              </div>

              <a
                href="https://youtube.com/@SatyendraRaoOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-colors self-start md:self-auto"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-rose-600">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>{isHindi ? 'चैनल सब्सक्राइब करें' : 'Subscribe to my channel'}</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map(v => {
                const title = isHindi ? v.title_hi : v.title_en;

                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        onClick={() => {
                          setActiveVideo({ id: v.id, title });
                          trackEvent('video_watch', { video_id: v.id, title });
                        }}
                        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 cursor-pointer group"
                      >
                        <Image
                          src={v.thumbnail}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-rose-600 transition-all">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-bold text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span>{v.duration}</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h3 
                          onClick={() => {
                            setActiveVideo({ id: v.id, title });
                            trackEvent('video_watch', { video_id: v.id, title });
                          }}
                          className="text-xs sm:text-sm font-bold text-navy-900 hover:text-purple-900 font-hindi leading-snug line-clamp-2 cursor-pointer"
                        >
                          {title}
                        </h3>

                        <p className="text-[11px] text-slate-500 font-medium">
                          {v.views} • {v.date}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1">
                      <button
                        onClick={() => {
                          setActiveVideo({ id: v.id, title });
                          trackEvent('video_watch', { video_id: v.id, title });
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
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

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import VideoModal from '@/components/public/VideoModal';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Play, Video, Eye, Clock, Calendar, Newspaper, ExternalLink, ArrowUpRight, Youtube } from 'lucide-react';

export default function MediaPage() {
  const { isHindi } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const videos = [
    {
      id: '5Qn-jD4pX7w',
      title_hi: 'जयपुर महापंचायत में 50,000 युवाओं को सत्येंद्र राव का ऐतिहासिक संबोधन',
      title_en: 'Satyendra Rao Addresses 50,000 Youth at Jaipur Maha-Panchayat',
      duration: '18:45',
      views: '1.42 लाख views',
      timeAgo: '2 weeks ago',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      ytUrl: 'https://www.youtube.com/watch?v=5Qn-jD4pX7w'
    },
    {
      id: '9B6yK9E1l4M',
      title_hi: 'SI भर्ती परीक्षा में धांधली का खुलासा और पारदर्शी पुनः परीक्षा की मांग',
      title_en: 'SI Exam Irregularities Exposed: Evidence and Demand for Re-Exam',
      duration: '24:10',
      views: '98K views',
      timeAgo: '3 weeks ago',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      ytUrl: 'https://www.youtube.com/watch?v=9B6yK9E1l4M'
    },
    {
      id: '3M8zW2kL5P0',
      title_hi: 'अजमेर से जयपुर विशाल पदयात्रा: युवाओं के संकल्प और संघर्ष की झलकियां',
      title_en: 'Foot March (Padyatra) from Ajmer to Jaipur: Highlights & Voices of Youth',
      duration: '14:20',
      views: '86K views',
      timeAgo: '1 month ago',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      ytUrl: 'https://www.youtube.com/watch?v=3M8zW2kL5P0'
    },
    {
      id: '7P1rT4uN8V9',
      title_hi: 'युवा सुधार चार्टर: युवाओं के हकों की कानूनी गारंटी के 10 मुख्य बिंदु',
      title_en: 'Youth Reform Charter Explained: 10 Actionable Policy Demands',
      duration: '12:35',
      views: '65K views',
      timeAgo: '2 months ago',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
      ytUrl: 'https://www.youtube.com/watch?v=7P1rT4uN8V9'
    }
  ];

  const pressClippings = [
    {
      media: 'Dainik Bhaskar',
      headline_hi: 'सत्येंद्र राव के नेतृत्व में 1.5 लाख अभ्यर्थियों ने उठाई पारदर्शी भर्ती की मांग',
      headline_en: '1.5 Lakh Candidates Demand Transparent Recruitment Under Satyendra Rao\'s Leadership',
      date: '12 Nov 2026',
      edition: 'Jaipur Main'
    },
    {
      media: 'Rajasthan Patrika',
      headline_hi: 'आरपीएससी सुधारों पर मुख्य सचिव को सौंपा 10 सूत्रीय युवा सुधार चार्टर',
      headline_en: '10-Point Youth Charter on Commission Reforms Submitted to Chief Secretary',
      date: '08 Nov 2026',
      edition: 'State Bureau'
    },
    {
      media: 'The Hindu',
      headline_hi: 'भर्ती परीक्षाओं में जवाबदेही हेतु जयपुर में विशाल छात्र महापंचायत',
      headline_en: 'Massive Youth Assembly in Jaipur Demanding Public Recruitment Accountability',
      date: '29 Oct 2026',
      edition: 'National'
    },
    {
      media: 'Navbharat Times',
      headline_hi: 'पेपर लीक सिंडिकेट्स पर कड़े कानून हेतु युवाओं का पदयात्रा सत्याग्रह',
      headline_en: 'Youth March Demands Stringent Fast-Track Laws Against Paper Leak Cartels',
      date: '18 Oct 2026',
      edition: 'Ajmer Bureau'
    }
  ];

  const handlePlayVideo = (vid: { id: string; title: string }) => {
    setActiveVideo(vid);
    trackEvent('video_watch', { video_id: vid.id, title: vid.title });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-purple-950 via-purple-900 to-[#1F0935] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-yellow text-xs font-bold uppercase tracking-wider mb-3">
                <Youtube className="w-3.5 h-3.5 fill-current" />
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

        {/* Video Grid matching Image 1 */}
        <section className="py-20 bg-slate-50/70 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Centered Header */}
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider">
                <Youtube className="w-3.5 h-3.5 fill-current" />
                <span>YOUTUBE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight font-hindi">
                {isHindi ? 'नवीनतम वीडियो संवाद (Recent Videos)' : 'Recent Videos'}
              </h2>
              <p className="text-sm text-slate-500 font-medium font-hindi">
                {isHindi 
                  ? 'सत्येंद्र राव के नवीनतम भाषण, महापंचायत संवाद और भर्ती सुधार प्रेस वार्ताएं' 
                  : 'Watch my latest speeches, ground interactions, and youth press briefings'}
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map(v => {
                const title = isHindi ? v.title_hi : v.title_en;

                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-hover hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div
                        onClick={() => handlePlayVideo({ id: v.id, title })}
                        className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 cursor-pointer"
                      >
                        <Image
                          src={v.thumbnail}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white border-2 border-white/80 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:border-red-600 transition-all shadow-lg">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-slate-300" />
                          <span>{v.duration}</span>
                        </div>
                      </div>

                      <div className="pt-3.5 px-1 space-y-1.5">
                        <h3
                          onClick={() => handlePlayVideo({ id: v.id, title })}
                          className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-purple-900 transition-colors line-clamp-2 leading-snug cursor-pointer font-hindi"
                        >
                          {title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {v.views} • {v.timeAgo}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 px-1 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                      <button
                        onClick={() => handlePlayVideo({ id: v.id, title })}
                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold transition-colors"
                      >
                        <Youtube className="w-4 h-4 fill-current" />
                        <span>Watch on YouTube</span>
                      </button>

                      <a
                        href={v.ytUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Centered Subscribe Button */}
            <div className="mt-12 text-center">
              <a
                href="https://youtube.com/@SatyendraRaoOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-slate-300 hover:border-red-600 bg-white hover:bg-red-50/50 text-navy-900 hover:text-red-600 font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>{isHindi ? 'यूट्यूब चैनल सब्सक्राइब करें' : 'Subscribe to my channel'}</span>
              </a>
            </div>

          </div>
        </section>

        {/* E-Paper & Print Press Clippings matching Image 4 */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
                  <Newspaper className="w-3.5 h-3.5 text-purple-800" />
                  <span>{isHindi ? 'मुद्रित समाचार एवं ई-पेपर अभिलेख' : 'Print & E-Paper Archive'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-navy-900 font-hindi">
                  {isHindi ? 'समाचार पत्रों में कवरेज (Press Coverage)' : 'National & State Press Coverage'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pressClippings.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-hover hover:border-purple-200 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-2.5">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
                        {item.media}
                      </span>
                      <span>{item.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-navy-900 font-hindi leading-snug">
                      {isHindi ? item.headline_hi : item.headline_en}
                    </h4>

                    <p className="text-[11px] text-slate-500">
                      {item.edition} Edition • Official Press Archive
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-900">
                    <span>{isHindi ? 'सत्यापित क्लिपिंग' : 'Verified Clipping'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
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

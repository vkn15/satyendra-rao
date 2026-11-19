'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Play, ExternalLink, Clock, ArrowRight } from 'lucide-react';
import VideoModal from './VideoModal';

export default function HomeMediaSection() {
  const { isHindi } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<{
    id: string;
    title: string;
    category?: string;
    views?: string;
    duration?: string;
    description?: string;
  } | null>(null);

  const videos = [
    {
      id: '5Qn-jD4pX7w',
      title_hi: 'जयपुर महापंचायत में 50,000 युवाओं को ऐतिहासिक संबोधन',
      title_en: 'Satyendra Rao Addresses 50,000 Youth at Jaipur Conclave',
      desc_hi: 'भर्ती संस्थाओं में जवाबदेही, तय समय सीमा और युवाओं के अधिकारों की कानूनी गारंटी पर ऐतिहासिक उद्बोधन।',
      desc_en: 'Historic address at Jaipur youth assembly calling for accountability, time-bound recruitments and exam security.',
      duration: '18:45',
      views: '142K views',
      timeAgo: isHindi ? '2 सप्ताह पूर्व' : '2 weeks ago',
      category: 'Speeches',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '9B6yK9E1l4M',
      title_hi: 'SI भर्ती परीक्षा में धांधली का खुलासा और पुनः परीक्षा की मांग',
      title_en: 'SI Exam Irregularities Exposed: Ground Evidence & Re-Test Demand',
      desc_hi: 'तथ्यों और साक्ष्यों के साथ प्रेस वार्ता: योग्य अभ्यर्थियों के न्याय हेतु पुनः परीक्षा की पुरजोर मांग।',
      desc_en: 'Detailed press briefing highlighting documented irregularities and calling for fair opportunity for genuine candidates.',
      duration: '24:10',
      views: '98K views',
      timeAgo: isHindi ? '3 सप्ताह पूर्व' : '3 weeks ago',
      category: 'Investigations',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '3M8zW2kL5P0',
      title_hi: 'अजमेर से जयपुर विशाल पदयात्रा: युवाओं के संकल्प की आवाज',
      title_en: 'Ajmer to Jaipur 135 km March: Voices and Struggles of Students',
      desc_hi: '10,000 से अधिक युवाओं के साथ 135 किमी की ऐतिहासिक पदयात्रा का प्रेरणादायक वृत्तचित्र।',
      desc_en: 'Over 10,000 students walked 135 km with Satyendra Rao to demand youth reform charter implementation.',
      duration: '14:20',
      views: '86K views',
      timeAgo: isHindi ? '1 माह पूर्व' : '1 month ago',
      category: 'Documentary',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '7P1rT4uN8V9',
      title_hi: 'युवा सुधार चार्टर: युवाओं के हकों की कानूनी गारंटी के 10 बिंदु',
      title_en: 'Youth Reform Charter: 10 Actionable Statutory Policy Demands',
      desc_hi: 'सत्येंद्र राव द्वारा 10-सूत्रीय युवा सुधार चार्टर के हर बिंदु की सरल एवं प्रभावी व्याख्या।',
      desc_en: 'Explaining how the 10-point Youth Reform Charter guarantees transparent, time-bound examinations for every student.',
      duration: '12:35',
      views: '65K views',
      timeAgo: isHindi ? '2 माह पूर्व' : '2 months ago',
      category: 'Policy Explained',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const handlePlayVideo = (v: typeof videos[0]) => {
    const title = isHindi ? v.title_hi : v.title_en;
    const description = isHindi ? v.desc_hi : v.desc_en;
    setActiveVideo({
      id: v.id,
      title,
      category: v.category,
      views: v.views,
      duration: v.duration,
      description
    });
    trackEvent('video_watch', { video_id: v.id, title });
  };

  return (
    <section className="py-20 bg-white border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Header - Exact shadcn-ui YouTube Block Style */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-black uppercase tracking-widest">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YOUTUBE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-hindi">
            {isHindi ? 'नवीनतम वीडियो वक्तव्य' : 'Recent Videos'}
          </h2>

          <p className="text-sm sm:text-base text-slate-500 font-hindi">
            {isHindi 
              ? 'सत्येंद्र राव के नवीनतम भाषण, प्रेस वार्ता और युवा जनसंवाद' 
              : 'Watch my latest addresses, press conferences, and youth dialogues'}
          </p>
        </div>

        {/* 4 Cards Grid - Matching shadcn-ui block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((v) => {
            const title = isHindi ? v.title_hi : v.title_en;
            return (
              <div
                key={v.id}
                className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* Thumbnail & Video Header */}
                <div>
                  <div
                    onClick={() => handlePlayVideo(v)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <Image
                      src={v.thumbnail}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                    {/* Centered Translucent Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-rose-600 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Timestamp Badge at bottom right */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-bold text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{v.duration}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <h3 
                      onClick={() => handlePlayVideo(v)}
                      className="text-xs sm:text-sm font-bold text-navy-900 group-hover:text-purple-900 line-clamp-2 leading-snug cursor-pointer font-hindi"
                    >
                      {title}
                    </h3>
                    
                    <p className="text-[11px] text-slate-500 font-medium">
                      {v.views} • {v.timeAgo}
                    </p>
                  </div>
                </div>

                {/* Bottom Red Link matching Screenshot */}
                <div className="px-4 pb-4 pt-1 flex items-center justify-between">
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  <button
                    onClick={() => handlePlayVideo(v)}
                    className="text-[11px] font-bold text-purple-900 hover:text-purple-950 px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    {isHindi ? 'प्ले करें' : 'Play'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Action Row: Subscribe Button & View All Videos */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
          <a
            href="https://youtube.com/@SatyendraRaoOfficial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-rose-600">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>{isHindi ? 'यूट्यूब चैनल सब्सक्राइब करें' : 'Subscribe to my channel'}</span>
          </a>

          <a
            href="/media"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <span>{isHindi ? 'सभी वीडियो एवं मीडिया गैलरी' : 'All Videos & Media Gallery'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {activeVideo && (
        <VideoModal
          videoId={activeVideo.id}
          title={activeVideo.title}
          category={activeVideo.category}
          views={activeVideo.views}
          duration={activeVideo.duration}
          description={activeVideo.description}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
}

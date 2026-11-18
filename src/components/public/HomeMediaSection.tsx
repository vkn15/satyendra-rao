'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Play, ArrowUpRight, ExternalLink, Clock, Youtube } from 'lucide-react';
import VideoModal from './VideoModal';

export default function HomeMediaSection() {
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
      title_en: 'Foot March (Padyatra) from Ajmer to Jaipur: Highlights & Voices',
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

  const handlePlayVideo = (vid: { id: string; title: string }) => {
    setActiveVideo(vid);
    trackEvent('video_watch', { video_id: vid.id, title: vid.title });
  };

  return (
    <section className="py-20 bg-white border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Header matching Image 1 Reference */}
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

        {/* 4 Cards in a Row matching Image 1 */}
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

                    {/* Centered Circular Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white border-2 border-white/80 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:border-red-600 transition-all shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge Bottom Right */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-300" />
                      <span>{v.duration}</span>
                    </div>
                  </div>

                  {/* Body */}
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

                {/* Bottom Action Footer matching Image 1 */}
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

        {/* Centered Subscribe Button matching Image 1 */}
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

      {activeVideo && (
        <VideoModal
          videoId={activeVideo.id}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
}

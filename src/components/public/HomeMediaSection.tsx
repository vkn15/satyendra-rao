'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Play, Video, ArrowRight, Eye, Clock } from 'lucide-react';
import VideoModal from './VideoModal';

export default function HomeMediaSection() {
  const { t, isHindi } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const videos = [
    {
      id: '5Qn-jD4pX7w',
      title_hi: 'जयपुर महापंचायत में 50,000 युवाओं को सत्येंद्र राव का ऐतिहासिक संबोधन',
      title_en: 'Satyendra Rao Addresses 50,000 Youth at Jaipur Maha-Panchayat',
      duration: '18:45',
      views: '1.42 लाख+',
      category: isHindi ? 'ऐतिहासिक भाषण' : 'Keynote Speech',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '9B6yK9E1l4M',
      title_hi: 'SI भर्ती परीक्षा में धांधली का खुलासा और पारदर्शी पुनः परीक्षा की मांग',
      title_en: 'SI Exam Irregularities Exposed: Evidence and Demand for Re-Exam',
      duration: '24:10',
      views: '98 हजार+',
      category: isHindi ? 'प्रेस कॉन्फ्रेंस' : 'Press Briefing',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '3M8zW2kL5P0',
      title_hi: 'अजमेर से जयपुर विशाल पदयात्रा: युवाओं के संकल्प और संघर्ष की झलकियां',
      title_en: 'Foot March (Padyatra) from Ajmer to Jaipur: Highlights & Voices',
      duration: '14:20',
      views: '86 हजार+',
      category: isHindi ? 'दस्तावेजी वृत्तचित्र' : 'Documentary',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const handlePlayVideo = (vid: { id: string; title: string }) => {
    setActiveVideo(vid);
    trackEvent('video_watch', { video_id: vid.id, title: vid.title });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Video className="w-3.5 h-3.5 text-purple-800" />
              <span>{isHindi ? 'वीडियो भाषण एवं मीडिया संवाद' : 'Video Speeches & Media Dialogue'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 font-hindi">
              {isHindi ? 'सत्येंद्र राव के विचार और जनसंवाद' : 'Satyendra Rao\'s Voice & Public Dialogues'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-hindi">
              {isHindi 
                ? 'महापंचायतों, प्रेस वार्ता और युवा सम्मेलनों के प्रमुख वीडियो वक्तव्य' 
                : 'Watch key video speeches, press conferences and ground youth mobilization rallies'}
            </p>
          </div>

          <a
            href="/media"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-950 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
          >
            <span>{isHindi ? 'सभी वीडियो देखें' : 'View All Videos'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v) => {
            const title = isHindi ? v.title_hi : v.title_en;
            return (
              <div
                key={v.id}
                onClick={() => handlePlayVideo({ id: v.id, title })}
                className="group cursor-pointer bg-royal-surface rounded-2xl overflow-hidden border border-purple-100 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail with Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <Image
                    src={v.thumbnail}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-purple-900/90 text-white border-2 border-accent-yellow flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-purple-800 transition-transform">
                      <Play className="w-6 h-6 fill-current text-accent-yellow ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[11px] font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span>{v.duration}</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-purple-900/90 text-[10px] font-bold text-accent-yellow border border-purple-700">
                    {v.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-bold text-navy-900 group-hover:text-purple-900 transition-colors line-clamp-2 leading-snug font-hindi">
                    {title}
                  </h3>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-purple-700" />
                      <span>{v.views}</span>
                    </span>
                    <span className="text-purple-900 font-bold group-hover:underline">
                      {isHindi ? 'अभी देखें ▶' : 'Watch Now ▶'}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
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

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import VideoModal from '@/components/public/VideoModal';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Play, Video, Eye, Clock, Calendar, Newspaper, ExternalLink, Youtube, Sparkles, Filter } from 'lucide-react';

export default function MediaPage() {
  const { isHindi } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [channelUrl, setChannelUrl] = useState('https://www.youtube.com/results?search_query=Satyendra+Rao');
  const [activeVideo, setActiveVideo] = useState<{
    id: string;
    title: string;
    category?: string;
    views?: string;
    duration?: string;
    description?: string;
  } | null>(null);

  const [videos, setVideos] = useState<any[]>([
    {
      id: 'jNQXAC9IVRw',
      title_hi: 'जयपुर महापंचायत में 50,000 युवाओं को सत्येंद्र राव का ऐतिहासिक संबोधन',
      title_en: 'Satyendra Rao Addresses 50,000 Youth at Jaipur Maha-Panchayat',
      desc_hi: 'भर्ती संस्थाओं में जवाबदेही, तय समय सीमा और युवाओं के अधिकारों की कानूनी गारंटी पर ऐतिहासिक उद्बोधन।',
      desc_en: 'Historic address at Jaipur youth assembly calling for accountability, time-bound recruitments and exam security.',
      duration: '18:45',
      views: '1.42 लाख+',
      date: isHindi ? '15 दिन पूर्व' : '15 days ago',
      category: 'Speeches',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'M7lc1UVf-VE',
      title_hi: 'SI भर्ती परीक्षा में धांधली का खुलासा और पारदर्शी पुनः परीक्षा की मांग',
      title_en: 'SI Exam Irregularities Exposed: Evidence and Demand for Re-Exam',
      desc_hi: 'तथ्यों और साक्ष्यों के साथ प्रेस वार्ता: योग्य अभ्यर्थियों के न्याय हेतु पुनः परीक्षा की पुरजोर मांग।',
      desc_en: 'Detailed press briefing highlighting documented irregularities and calling for fair opportunity for genuine candidates.',
      duration: '24:10',
      views: '98 हजार+',
      date: isHindi ? '25 दिन पूर्व' : '25 days ago',
      category: 'Investigations',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: '7ghhRHRP6t4',
      title_hi: 'अजमेर से जयपुर विशाल पदयात्रा: युवाओं के संकल्प और संघर्ष की झलकियां',
      title_en: 'Foot March (Padyatra) from Ajmer to Jaipur: Highlights & Voices of Youth',
      desc_hi: '10,000 से अधिक युवाओं के साथ 135 किमी की ऐतिहासिक पदयात्रा का प्रेरणादायक वृत्तचित्र।',
      desc_en: 'Over 10,000 students walked 135 km with Satyendra Rao to demand youth reform charter implementation.',
      duration: '14:20',
      views: '86 हजार+',
      date: isHindi ? '35 दिन पूर्व' : '35 days ago',
      category: 'Documentary',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'dQw4w9WgXcQ',
      title_hi: 'युवा सुधार चार्टर: युवाओं के हकों की कानूनी गारंटी के 10 मुख्य बिंदु',
      title_en: 'Youth Reform Charter Explained: 10 Actionable Policy Demands',
      desc_hi: 'सत्येंद्र राव द्वारा 10-सूत्रीय युवा सुधार चार्टर के हर बिंदु की सरल एवं प्रभावी व्याख्या।',
      desc_en: 'Explaining how the 10-point Youth Reform Charter guarantees transparent, time-bound examinations for every student.',
      duration: '12:35',
      views: '65 हजार+',
      date: isHindi ? '42 दिन पूर्व' : '42 days ago',
      category: 'Policy Explained',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'kJQP7kiw5Fk',
      title_hi: 'उच्च न्यायालय के ऐतिहासिक निर्णय पर प्रेस वार्ता: ओएमआर डिजिटल सुरक्षा',
      title_en: 'Press Conference on High Court Verdict & OMR Digital Archiving',
      desc_hi: 'ओएमआर डिजिटल कार्बन कॉपी और परीक्षा केंद्रों पर बायोमेट्रिक सुरक्षा पर उच्च न्यायालय के निर्णय पर प्रेस ब्रीफिंग।',
      desc_en: 'Media briefing following the High Court order on mandatory carbon copy disclosures and security protocols.',
      duration: '21:15',
      views: '54 हजार+',
      date: isHindi ? '48 दिन पूर्व' : '48 days ago',
      category: 'Press Conference',
      thumbnail: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'aqz-KE-bpKQ',
      title_hi: 'कोचिंग हब की जमीनी हकीकत: प्रतियोगी छात्रों से सीधा संवाद और समाधान',
      title_en: 'Ground Reality of Coaching Hubs: Direct Interaction with Aspirants',
      desc_hi: 'सीकर और कोटा के कमरों में रहकर छात्रों के दैनिक संघर्ष, मानसिक तनाव और छात्र-कल्याण नीतियों पर खुली बातचीत।',
      desc_en: 'Visiting student rooms in Sikar and Kota to understand day-to-day challenges, hostel rent exploitation and mental wellness.',
      duration: '16:50',
      views: '72 हजार+',
      date: isHindi ? '55 दिन पूर्व' : '55 days ago',
      category: 'Student Townhalls',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
    }
  ]);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(v => ({
            id: v.video_id,
            title_hi: v.title_hi || v.title_en,
            title_en: v.title_en,
            desc_hi: v.description_hi || v.description_en,
            desc_en: v.description_en,
            duration: v.duration,
            views: `${(v.views_count / 1000).toFixed(0)}K views`,
            date: isHindi ? 'हाल ही में' : 'Recently',
            category: v.category,
            thumbnail: v.thumbnail_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
          }));
          setVideos(mapped);
        }
      })
      .catch(e => console.error(e));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.youtube_channel_url) {
          setChannelUrl(data.youtube_channel_url);
        }
      })
      .catch(e => console.error(e));
  }, [isHindi]);

  const pressClippings = [
    {
      media: 'Dainik Bhaskar',
      headline_hi: 'सत्येंद्र राव के नेतृत्व में 1.5 लाख अभ्यर्थियों ने उठाई परीक्षा बीमा और 90 दिन में भर्ती की मांग',
      headline_en: 'Under Satyendra Rao leadership, 150K candidates demand exam insurance & 90-day recruitment ceiling',
      date: '12 Jan 2026'
    },
    {
      media: 'Rajasthan Patrika',
      headline_hi: 'अजमेर से जयपुर पदयात्रा: RPSC में आमूलचूल सुधारों हेतु सरकार को सौंपा 10 सूत्रीय युवा चार्टर',
      headline_en: 'Ajmer to Jaipur Padyatra: 10-point Youth Charter submitted to government for structural RPSC reforms',
      date: '28 Dec 2025'
    },
    {
      media: 'The Times of India',
      headline_hi: 'युवा कार्यकर्ता सत्येंद्र राव ने उच्च न्यायालय में दायर की जनहित याचिका, डिजिटल ओएमआर सुरक्षा पर मांगा आदेश',
      headline_en: 'Social activist Satyendra Rao moves HC demanding digital carbon copies of OMR sheets across exams',
      date: '15 Nov 2025'
    }
  ];

  const categories = [
    { key: 'all', label_en: 'All Videos', label_hi: 'सभी वीडियो' },
    { key: 'Speeches', label_en: 'Maha-Panchayat & Speeches', label_hi: 'महापंचायत एवं भाषण' },
    { key: 'Investigations', label_en: 'Investigations', label_hi: 'जांच एवं खुलासे' },
    { key: 'Documentary', label_en: 'Padyatra Documentary', label_hi: 'पदयात्रा वृत्तचित्र' },
    { key: 'Policy Explained', label_en: 'Policy Explained', label_hi: 'नीति विश्लेषण' },
    { key: 'Press Conference', label_en: 'Press Conferences', label_hi: 'प्रेस वार्ता' },
    { key: 'Student Townhalls', label_en: 'Student Townhalls', label_hi: 'छात्र जनसंवाद' }
  ];

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  const handlePlay = (v: typeof videos[0]) => {
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        
        {/* Header Hero */}
        <section className="bg-gradient-to-b from-purple-950 via-purple-900 to-navy-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold uppercase tracking-widest shadow-sm">
                <Youtube className="w-3.5 h-3.5 fill-current" />
                <span>OFFICIAL YOUTUBE & MEDIA ARCHIVE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-hindi">
                {isHindi ? 'वीडियो वक्तव्य एवं मीडिया गैलरी' : 'Video Addresses & Media Gallery'}
              </h1>

              <p className="text-purple-200 text-sm sm:text-base leading-relaxed font-hindi">
                {isHindi 
                  ? 'सत्येंद्र राव के ऐतिहासिक संबोधन, प्रेस वार्ताएं, पदयात्रा वृत्तचित्र और समाचार पत्रों में प्रमुख कवरेज का प्रामाणिक संग्रह।'
                  : 'Watch video addresses, investigative press briefings, grassroots marches, and verified press clippings of the Youth Reform Movement.'}
              </p>

              {/* Verified YouTube Channel CTA - Never 404s */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>{isHindi ? 'आधिकारिक यूट्यूब चैनल पर जाएं' : 'Visit Official YouTube Channel'}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Video Gallery Section */}
        <section className="py-14 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
              {categories.map((cat) => {
                const label = isHindi ? cat.label_hi : cat.label_en;
                const active = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      active
                        ? 'bg-purple-900 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((v) => {
                const title = isHindi ? v.title_hi : v.title_en;
                const desc = isHindi ? v.desc_hi : v.desc_en;

                return (
                  <div
                    key={v.id}
                    className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
                  >
                    <div>
                      {/* Thumbnail with centered play button */}
                      <div
                        onClick={() => handlePlay(v)}
                        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 cursor-pointer"
                      >
                        <Image
                          src={v.thumbnail}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                        {/* Centered Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-rose-600 transition-all">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Category badge top left */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-purple-900/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                          {v.category}
                        </div>

                        {/* Duration bottom right */}
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[11px] font-bold text-white flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span>{v.duration}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-500">
                          <span>{v.views}</span>
                          <span className="mx-1.5">•</span>
                          <span>{v.date}</span>
                        </div>

                        <h3 
                          onClick={() => handlePlay(v)}
                          className="text-base font-bold text-navy-900 group-hover:text-purple-900 font-hindi leading-snug cursor-pointer line-clamp-2"
                        >
                          {title}
                        </h3>

                        <p className="text-xs text-slate-600 font-hindi line-clamp-2 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>

                    {/* Footer Actions - Guaranteed working link */}
                    <div className="px-5 pb-5 pt-1 flex items-center justify-between border-t border-slate-100 mt-2">
                      <a
                        href={`https://www.youtube.com/watch?v=${v.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Youtube className="w-3.5 h-3.5 fill-current" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>

                      <button
                        onClick={() => handlePlay(v)}
                        className="text-xs font-bold text-purple-900 hover:text-purple-950 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        {isHindi ? 'प्ले करें' : 'Play Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Press Clippings Section */}
            <div className="mt-20">
              <div className="mb-8">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-widest block mb-1">
                  PRINT & DIGITAL MEDIA
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-navy-900 font-hindi flex items-center gap-2">
                  <Newspaper className="w-7 h-7 text-purple-900" />
                  <span>{isHindi ? 'समाचार पत्रों में प्रमुख कवरेज' : 'Verified Press Coverage'}</span>
                </h2>
              </div>

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
                        <span>{isHindi ? 'प्रामाणिक प्रेस साक्ष्य' : 'Verified Archive Document'}</span>
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
          category={activeVideo.category}
          views={activeVideo.views}
          duration={activeVideo.duration}
          description={activeVideo.description}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}

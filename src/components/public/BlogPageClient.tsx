'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import BlogReaderModal from '@/components/public/BlogReaderModal';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Blog } from '@/types';
import { BookOpen, ArrowUpRight, Search, Clock, Filter, Eye } from 'lucide-react';

interface BlogPageClientProps {
  initialBlogs: Blog[];
}

export default function BlogPageClient({ initialBlogs }: BlogPageClientProps) {
  const { isHindi } = useLanguage();
  const [blogs] = useState<Blog[]>(initialBlogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);

  const tags = [
    { key: 'all', label_en: 'All Posts (6)', label_hi: 'सभी आलेख (6)' },
    { key: 'Exam Reforms', label_en: 'Exam Reforms', label_hi: 'परीक्षा सुधार' },
    { key: 'Governance', label_en: 'Governance & Commissions', label_hi: 'आयोग व सुशासन' },
    { key: 'Legal Safeguards', label_en: 'Legal Safeguards', label_hi: 'कानूनी सुरक्षा' },
    { key: 'Youth Charter', label_en: 'Youth Charter', label_hi: 'युवा चार्टर' },
    { key: 'Mental Health', label_en: 'Student Mental Health', label_hi: 'मानसिक स्वास्थ्य' },
    { key: 'Padyatra', label_en: 'Grassroots Padyatra', label_hi: 'पदयात्रा' }
  ];

  const filteredBlogs = blogs.filter(b => {
    const matchesTag = selectedTag === 'all' || b.tags?.some(t => t.toLowerCase().includes(selectedTag.toLowerCase()));
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesTag;

    const inTitleEn = b.title_en?.toLowerCase().includes(query);
    const inTitleHi = b.title_hi?.toLowerCase().includes(query);
    const inExcerptEn = b.excerpt_en?.toLowerCase().includes(query);
    const inExcerptHi = b.excerpt_hi?.toLowerCase().includes(query);
    const inContentEn = b.content_en?.toLowerCase().includes(query);
    const inContentHi = b.content_hi?.toLowerCase().includes(query);

    return matchesTag && (inTitleEn || inTitleHi || inExcerptEn || inExcerptHi || inContentEn || inContentHi);
  });

  const handleOpenBlog = (b: Blog) => {
    setActiveBlog(b);
    trackEvent('blog_read', { blog_id: b.id, slug: b.slug });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header - Exact Untitled UI Reference with Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-widest block mb-2 font-hindi">
                {isHindi ? 'सत्येंद्र राव के विचार एवं नीतिगत आलेख' : 'Our Thoughts & Policy Papers'}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 tracking-tight font-hindi">
                {isHindi ? 'सभी नीतिगत आलेख' : 'All blog posts'}
              </h1>
              <p className="mt-3 text-base text-slate-500 font-hindi">
                {isHindi 
                  ? 'परीक्षा सुधारों, न्यायिक निर्णयों और युवा अधिकारों पर सत्येंद्र राव के प्रामाणिक विचार। किसी भी आलेख पर क्लिक कर पूर्ण पाठ तुरंत पढ़ें।' 
                  : 'In-depth essays, legal critiques, and blueprints for meritocracy and youth empowerment. Click any article to read instantly.'}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isHindi ? 'आलेख खोजें...' : 'Search articles...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
            {tags.map((t) => {
              const label = isHindi ? t.label_hi : t.label_en;
              const active = selectedTag === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedTag(t.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    active
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-purple-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-hindi text-base">
                {isHindi ? 'कोई आलेख नहीं मिला' : 'No articles matched your search filter'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTag('all'); }}
                className="text-xs font-bold text-purple-900 hover:underline"
              >
                {isHindi ? 'सभी फिल्टर हटाएं' : 'Clear all filters'}
              </button>
            </div>
          )}

          {/* Blogs Grid - Exact Match to Untitled UI Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map(b => {
              const title = isHindi ? b.title_hi : b.title_en;
              const excerpt = isHindi ? b.excerpt_hi : b.excerpt_en;
              const coverImg = b.cover_image || '/images/satyendra_hero.png';

              return (
                <article
                  key={b.id}
                  className="group flex flex-col justify-between bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleOpenBlog(b)}
                >
                  <div className="space-y-4">
                    {/* Cover Image - 16:10 aspect ratio */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
                      <Image
                        src={coverImg}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-104 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-xs text-[11px] font-bold text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span>{b.reading_time_minutes} min read</span>
                      </div>
                    </div>

                    {/* Metadata: Author & Date */}
                    <div className="text-xs font-bold text-purple-900 flex items-center justify-between">
                      <div>
                        <span>{b.author}</span>
                        <span className="mx-1.5">•</span>
                        <span className="text-slate-500 font-medium">
                          {new Date(b.published_date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {b.views_count.toLocaleString()}
                      </span>
                    </div>

                    {/* Title with Diagonal Arrow ↗ */}
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg sm:text-xl font-bold text-navy-900 group-hover:text-purple-900 transition-colors leading-snug font-hindi">
                        {title}
                      </h2>
                      <div className="w-7 h-7 rounded-full bg-purple-50 group-hover:bg-purple-900 flex items-center justify-center text-purple-900 group-hover:text-white shrink-0 transition-colors mt-0.5">
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    {/* Excerpt - 2 lines clean */}
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-hindi">
                      {excerpt}
                    </p>
                  </div>

                  {/* Tags Pill Badges at Bottom - Exact Untitled UI */}
                  <div className="pt-4 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {b.tags?.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-700 group-hover:border-purple-200 group-hover:text-purple-900 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-purple-900 group-hover:underline">
                      {isHindi ? 'पूरा पढ़ें →' : 'Read Article →'}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </main>

      <ImpactRibbon />
      <Footer />

      {activeBlog && (
        <BlogReaderModal
          blog={activeBlog}
          onClose={() => setActiveBlog(null)}
        />
      )}
    </div>
  );
}

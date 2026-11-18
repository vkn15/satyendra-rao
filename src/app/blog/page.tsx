'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { Blog } from '@/types';
import { BookOpen, Calendar, Clock, Eye, ArrowRight, User } from 'lucide-react';

export default function BlogPage() {
  const { isHindi } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs?status=published')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-purple-950 via-purple-900 to-[#1F0935] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-yellow text-xs font-bold uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isHindi ? 'विचार एवं नीतिगत आलेख' : 'Policy Insights & Essays'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-hindi">
                {isHindi ? 'सत्येंद्र राव के लेख एवं विचार' : 'Articles & Thought Leadership'}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-purple-200 leading-relaxed font-hindi">
                {isHindi 
                  ? 'परीक्षा प्रणाली में सुधार, पेपर लीक विरोधी कानून, प्रशासनिक जवाबदेही और युवाओं के अधिकारों पर गंभीर वैचारिक विश्लेषण।'
                  : 'In-depth policy essays, legal critiques, and blueprints for meritocracy and youth empowerment.'}
              </p>
            </div>
          </div>
        </section>

        {/* Blogs Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(b => {
                const title = isHindi ? b.title_hi : b.title_en;
                const excerpt = isHindi ? b.excerpt_hi : b.excerpt_en;

                return (
                  <article
                    key={b.id}
                    className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {b.cover_image && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-purple-900">
                          <Image
                            src={b.cover_image}
                            alt={title}
                            fill
                            className="object-cover object-top hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="p-6 space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(b.published_date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {b.reading_time_minutes} {isHindi ? 'मिनट पठन' : 'min read'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-purple-900 font-semibold">
                            <Eye className="w-3.5 h-3.5" />
                            {b.views_count.toLocaleString()}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-navy-900 hover:text-purple-900 transition-colors font-hindi leading-snug">
                          <a href={`/blog/${b.slug}`}>{title}</a>
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-hindi">
                          {excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <User className="w-3.5 h-3.5 text-purple-700" />
                        <span>{b.author}</span>
                      </div>

                      <a
                        href={`/blog/${b.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:text-purple-950"
                      >
                        <span>{isHindi ? 'पूरा लेख पढ़ें' : 'Read Article'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <ImpactRibbon />
      </main>

      <Footer />
    </div>
  );
}

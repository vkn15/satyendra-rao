'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { Blog } from '@/types';
import { BookOpen, Calendar, Clock, Eye, ArrowUpRight, User } from 'lucide-react';

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
        {/* Header Hero */}
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

        {/* Blog Grid matching Image 5 (Untitled UI) */}
        <section className="py-16 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight font-hindi">
                {isHindi ? 'सभी नीतिगत आलेख (All Blog Posts)' : 'All blog posts'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(b => {
                const title = isHindi ? b.title_hi : b.title_en;
                const excerpt = isHindi ? b.excerpt_hi : b.excerpt_en;

                return (
                  <article
                    key={b.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-hover hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* 16:9 Image */}
                      <a href={`/blog/${b.slug}`} className="block relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-purple-950">
                        <Image
                          src={b.cover_image || '/images/satyendra_real.jpg'}
                          alt={title}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </a>

                      {/* Author + Date */}
                      <div className="pt-4 text-xs font-semibold text-purple-900 flex items-center gap-1.5">
                        <span>{b.author}</span>
                        <span>•</span>
                        <span className="text-slate-500">
                          {new Date(b.published_date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Title with Arrow Icon ↗ matching Image 5 */}
                      <div className="pt-2">
                        <a
                          href={`/blog/${b.slug}`}
                          className="flex items-start justify-between gap-2 group/link"
                        >
                          <h3 className="text-base sm:text-lg font-bold text-navy-900 group-hover/link:text-purple-900 transition-colors leading-snug font-hindi">
                            {title}
                          </h3>
                          <ArrowUpRight className="w-5 h-5 text-navy-900 group-hover/link:text-purple-900 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      </div>

                      {/* Excerpt */}
                      <p className="pt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-hindi">
                        {excerpt}
                      </p>
                    </div>

                    {/* Tag Pills at Bottom matching Image 5 */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      {(b.tags || ['Youth Reform', 'Policy']).slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-900 border border-purple-100"
                        >
                          {tag}
                        </span>
                      ))}
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

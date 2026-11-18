'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Blog } from '@/types';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export default function HomeBlogSection() {
  const { isHindi } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch('/api/blogs?status=published')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-20 bg-slate-50/60 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Image 5 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight font-hindi">
              {isHindi ? 'सभी नीतिगत आलेख (All Blog Posts)' : 'All blog posts'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 font-hindi">
              {isHindi 
                ? 'परीक्षा सुधारों, पेपर लीक विरोधी कानूनों और युवा नीति पर सत्येंद्र राव के विचार' 
                : 'In-depth policy essays, legal critiques, and blueprints for youth empowerment'}
            </p>
          </div>

          <a
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:text-purple-950 font-hindi"
          >
            <span>{isHindi ? 'समस्त आलेख देखें →' : 'View all articles →'}</span>
          </a>
        </div>

        {/* 3-Column Grid matching Image 5 (Untitled UI) */}
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
                  <p className="pt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-hindi">
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
  );
}

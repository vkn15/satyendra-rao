'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Blog } from '@/types';
import { ArrowUpRight, ArrowRight, BookOpen, Clock } from 'lucide-react';
import BlogReaderModal from './BlogReaderModal';

interface HomeBlogSectionProps {
  initialBlogs?: Blog[];
}

export default function HomeBlogSection({ initialBlogs }: HomeBlogSectionProps) {
  const { isHindi } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs || []);
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (!initialBlogs || initialBlogs.length === 0) {
      fetch('/api/blogs?status=published')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setBlogs(data.slice(0, 3));
          }
        })
        .catch(e => console.error(e));
    }
  }, [initialBlogs]);

  const handleRead = (blog: Blog) => {
    setActiveBlog(blog);
    trackEvent('blog_read', { blog_id: blog.id, slug: blog.slug });
  };

  const displayBlogs = blogs.slice(0, 3);

  return (
    <section className="py-20 bg-slate-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Untitled UI style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-widest block mb-2 font-hindi">
              {isHindi ? 'विचार, शोध एवं विजन' : 'Our Thoughts & Policy Papers'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 tracking-tight font-hindi">
              {isHindi ? 'नवीनतम नीतिगत आलेख' : 'All blog posts'}
            </h2>
            <p className="mt-3 text-base text-slate-500 font-hindi">
              {isHindi 
                ? 'परीक्षा सुधारों, न्यायिक निर्णयों और युवा अधिकारों पर सत्येंद्र राव के प्रामाणिक विचार' 
                : 'In-depth essays, legal critiques, and blueprints for meritocracy and youth empowerment.'}
            </p>
          </div>

          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-900 hover:text-purple-950 px-4 py-2 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 transition-colors shadow-xs shrink-0"
          >
            <span>{isHindi ? 'सभी 6 आलेख पढ़ें' : 'View all blog posts'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 3-Column Cards Grid - Exact Untitled UI Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBlogs.map((b) => {
            const title = isHindi ? b.title_hi : b.title_en;
            const excerpt = isHindi ? b.excerpt_hi : b.excerpt_en;
            const coverImg = b.cover_image || '/images/satyendra_hero.png';

            return (
              <article
                key={b.id}
                className="group flex flex-col justify-between bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleRead(b)}
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
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-[11px] font-bold text-white flex items-center gap-1">
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
                  </div>

                  {/* Title with Diagonal Arrow ↗ */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-navy-900 group-hover:text-purple-900 transition-colors leading-snug font-hindi">
                      {title}
                    </h3>
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
                    {isHindi ? 'पढ़ें →' : 'Read →'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner to Explore All Articles */}
        <div className="mt-12 text-center">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm shadow-md transition-all hover:shadow-lg"
          >
            <BookOpen className="w-4 h-4 text-accent-yellow" />
            <span>{isHindi ? 'सभी 6 नीतिगत आलेख पढ़ें एवं खोजें' : 'Explore All 6 Policy Articles & Essays'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {activeBlog && (
        <BlogReaderModal
          blog={activeBlog}
          onClose={() => setActiveBlog(null)}
        />
      )}
    </section>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { Blog } from '@/types';
import { BookOpen, ArrowUpRight, Sparkles } from 'lucide-react';

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

      <main className="flex-1 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header - Untitled UI style */}
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-widest block mb-2 font-hindi">
              {isHindi ? 'विचार एवं शोध' : 'Our Thoughts & Policy Papers'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 tracking-tight font-hindi">
              {isHindi ? 'सभी नीतिगत आलेख' : 'All blog posts'}
            </h1>
            <p className="mt-3 text-base text-slate-500 font-hindi">
              {isHindi 
                ? 'परीक्षा सुधारों, न्यायिक निर्णयों और युवा अधिकारों पर सत्येंद्र राव के प्रामाणिक विचार' 
                : 'In-depth essays, legal critiques, and blueprints for meritocracy and youth empowerment.'}
            </p>
          </div>

          {/* Blogs Grid - Exact Match to Untitled UI Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(b => {
              const title = isHindi ? b.title_hi : b.title_en;
              const excerpt = isHindi ? b.excerpt_hi : b.excerpt_en;
              const coverImg = b.cover_image || '/images/satyendra_rao_new.jpg';

              return (
                <article
                  key={b.id}
                  className="group flex flex-col justify-between space-y-4 cursor-pointer"
                >
                  <a href={`/blog/${b.slug}`} className="block space-y-4">
                    {/* Cover Image - 16:10 aspect ratio */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-xs group-hover:shadow-md transition-shadow">
                      <Image
                        src={coverImg}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>

                    {/* Metadata: Author & Date */}
                    <div className="text-xs font-bold text-purple-900">
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

                    {/* Title with Diagonal Arrow ↗ */}
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg sm:text-xl font-bold text-navy-900 group-hover:text-purple-900 transition-colors leading-snug font-hindi">
                        {title}
                      </h2>
                      <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                    </div>

                    {/* Excerpt - 2 lines clean */}
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-hindi">
                      {excerpt}
                    </p>
                  </a>

                  {/* Tags Pill Badges at Bottom - Exact Untitled UI */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {b.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-700 group-hover:border-purple-200 group-hover:text-purple-900 transition-colors"
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
      </main>

      <ImpactRibbon />
      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Blog } from '@/types';
import { 
  Calendar, 
  Clock, 
  Eye, 
  ArrowLeft, 
  Share2, 
  User, 
  ArrowUpRight, 
  Languages, 
  Check 
} from 'lucide-react';

interface SingleBlogClientProps {
  initialBlog: Blog;
  relatedBlogs: Blog[];
}

export default function SingleBlogClient({ initialBlog, relatedBlogs }: SingleBlogClientProps) {
  const { isHindi: globalIsHindi } = useLanguage();
  const { showToast } = useToast();
  const [readingInHindi, setReadingInHindi] = useState(globalIsHindi);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setReadingInHindi(globalIsHindi);
  }, [globalIsHindi]);

  useEffect(() => {
    trackEvent('blog_read', { blog_id: initialBlog.id, slug: initialBlog.slug });
  }, [initialBlog]);

  const handleShare = () => {
    trackEvent('share', { blog_id: initialBlog.id });
    if (navigator.share) {
      navigator.share({
        title: readingInHindi ? initialBlog.title_hi : initialBlog.title_en,
        text: readingInHindi ? initialBlog.excerpt_hi : initialBlog.excerpt_en,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast(readingInHindi ? 'लेख लिंक कॉपी किया गया' : 'Article link copied', 'info');
    }
  };

  const title = readingInHindi ? initialBlog.title_hi : initialBlog.title_en;
  const content = readingInHindi ? initialBlog.content_hi : initialBlog.content_en;
  const excerpt = readingInHindi ? initialBlog.excerpt_hi : initialBlog.excerpt_en;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar with Back Link & Language Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <a
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:text-purple-950 px-3 py-1.5 rounded-lg bg-white border border-purple-200 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{readingInHindi ? 'सभी लेखों पर लौटें' : 'Back to All Articles'}</span>
            </a>

            <button
              onClick={() => setReadingInHindi(!readingInHindi)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-xs font-bold text-purple-900 hover:bg-purple-50 transition-colors shadow-xs"
            >
              <Languages className="w-3.5 h-3.5 text-accent-yellow" />
              <span>{readingInHindi ? 'Read in English' : 'हिंदी में पढ़ें'}</span>
            </button>
          </div>

          <article className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-card">
            
            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-full">
                  <User className="w-3.5 h-3.5" />
                  {initialBlog.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(initialBlog.published_date).toLocaleDateString(readingInHindi ? 'hi-IN' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {initialBlog.reading_time_minutes} {readingInHindi ? 'मिनट पठन' : 'min read'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Eye className="w-3.5 h-3.5" />
                  {initialBlog.views_count.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-purple-900 hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? (readingInHindi ? 'कॉपी हुआ' : 'Copied!') : (readingInHindi ? 'साझा करें' : 'Share')}</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="mt-6 text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 tracking-tight leading-tight font-hindi">
              {title}
            </h1>

            {/* Excerpt Callout */}
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-purple-50/70 border-l-4 border-purple-900 text-slate-700 italic text-sm sm:text-base font-hindi">
              {excerpt}
            </div>

            {/* Cover Image */}
            {initialBlog.cover_image && (
              <div className="mt-8 relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md bg-purple-900">
                <Image
                  src={initialBlog.cover_image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Main Content */}
            <div className="mt-8 prose prose-purple max-w-none text-slate-800 text-base sm:text-lg leading-relaxed font-hindi space-y-4 whitespace-pre-line">
              {content}
            </div>

            {/* Tags */}
            {initialBlog.tags && initialBlog.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
                  Tags:
                </span>
                {initialBlog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

          </article>

          {/* Related Articles Section */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl sm:text-2xl font-black text-navy-900 mb-6 font-hindi">
                {readingInHindi ? 'अन्य महत्वपूर्ण नीतिगत आलेख' : 'Related Articles & Policy Papers'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map(b => {
                  const bTitle = readingInHindi ? b.title_hi : b.title_en;
                  const bCover = b.cover_image || '/images/satyendra_hero.png';
                  return (
                    <a
                      key={b.id}
                      href={`/blog/${b.slug}`}
                      className="group flex flex-col justify-between bg-white rounded-2xl p-4 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100">
                          <Image
                            src={bCover}
                            alt={bTitle}
                            fill
                            className="object-cover group-hover:scale-104 transition-transform duration-300"
                          />
                        </div>

                        <div className="text-[11px] font-bold text-purple-900">
                          {b.reading_time_minutes} min read • {new Date(b.published_date).toLocaleDateString(readingInHindi ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric' })}
                        </div>

                        <h4 className="text-sm font-bold text-navy-900 group-hover:text-purple-900 font-hindi line-clamp-2 leading-snug">
                          {bTitle}
                        </h4>
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-900">
                        <span>{readingInHindi ? 'पढ़ें' : 'Read Article'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

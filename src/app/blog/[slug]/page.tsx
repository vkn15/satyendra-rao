'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Blog } from '@/types';
import { Calendar, Clock, Eye, ArrowLeft, Share2, User, BookOpen } from 'lucide-react';

export default function SingleBlogPage() {
  const { slug } = useParams();
  const { isHindi } = useLanguage();
  const { showToast } = useToast();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch('/api/blogs')
      .then(res => res.json())
      .then((blogs: Blog[]) => {
        const found = blogs.find(b => b.slug === slug);
        if (found) {
          setBlog(found);
          trackEvent('blog_read', { blog_id: found.id, slug });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (!blog) return;
    trackEvent('share', { blog_id: blog.id });
    if (navigator.share) {
      navigator.share({
        title: isHindi ? blog.title_hi : blog.title_en,
        text: isHindi ? blog.excerpt_hi : blog.excerpt_en,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(isHindi ? 'लेख लिंक कॉपी किया गया' : 'Article link copied', 'info');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
          Loading article...
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <h2 className="text-2xl font-bold text-navy-900 font-hindi">
            {isHindi ? 'आलेख प्राप्त नहीं हुआ' : 'Article Not Found'}
          </h2>
          <a href="/blog" className="text-purple-900 font-bold hover:underline">
            ← {isHindi ? 'सभी लेखों पर लौटें' : 'Back to Blog'}
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const title = isHindi ? blog.title_hi : blog.title_en;
  const content = isHindi ? blog.content_hi : blog.content_en;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <a
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 hover:text-purple-950 px-3 py-1.5 rounded-lg bg-white border border-purple-200 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isHindi ? 'सभी लेखों पर लौटें' : 'Back to All Articles'}</span>
            </a>
          </div>

          <article className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-card">
            
            {/* Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-full">
                  <User className="w-3.5 h-3.5" />
                  {blog.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(blog.published_date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {blog.reading_time_minutes} {isHindi ? 'मिनट पठन' : 'min read'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Eye className="w-3.5 h-3.5" />
                  {blog.views_count.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-purple-900 hover:bg-slate-50 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'साझा करें' : 'Share'}</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="mt-6 text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 tracking-tight leading-tight font-hindi">
              {title}
            </h1>

            {/* Cover Image */}
            {blog.cover_image && (
              <div className="mt-8 relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md bg-purple-900">
                <Image
                  src={blog.cover_image}
                  alt={title}
                  fill
                  className="object-cover object-top"
                />
              </div>
            )}

            {/* Content */}
            <div className="mt-8 prose prose-purple max-w-none text-slate-800 text-base sm:text-lg leading-relaxed font-hindi space-y-4 whitespace-pre-line">
              {content}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
                  Tags:
                </span>
                {blog.tags.map((tag, idx) => (
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
        </div>
      </main>

      <Footer />
    </div>
  );
}

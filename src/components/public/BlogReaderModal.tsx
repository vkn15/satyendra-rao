'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Blog } from '@/types';
import { 
  X, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Share2, 
  ExternalLink, 
  Check, 
  Languages, 
  ZoomIn, 
  ZoomOut,
  BookOpen
} from 'lucide-react';

interface BlogReaderModalProps {
  blog: Blog;
  onClose: () => void;
}

export default function BlogReaderModal({ blog, onClose }: BlogReaderModalProps) {
  const { isHindi: globalIsHindi } = useLanguage();
  const [readingInHindi, setReadingInHindi] = useState(globalIsHindi);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const title = readingInHindi ? blog.title_hi : blog.title_en;
  const content = readingInHindi ? blog.content_hi : blog.content_en;
  const excerpt = readingInHindi ? blog.excerpt_hi : blog.excerpt_en;
  const fullPageUrl = `/blog/${blog.slug}`;

  const handleShare = () => {
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${fullPageUrl}` : fullPageUrl;
    if (navigator.share) {
      navigator.share({
        title,
        text: excerpt,
        url: fullUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
      case 'xlarge':
        return 'text-xl sm:text-2xl leading-loose';
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-purple-950 via-purple-900 to-navy-950 text-white border-b border-purple-800/60 shrink-0">
          
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent-yellow">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200 hidden sm:inline">
              Article Reader
            </span>
          </div>

          {/* Reader Preferences: Language toggle, Font Size, Share, Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switch inside Reader */}
            <button
              onClick={() => setReadingInHindi(!readingInHindi)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition-colors border border-white/20"
              title="Toggle Hindi/English"
            >
              <Languages className="w-3.5 h-3.5 text-accent-yellow" />
              <span>{readingInHindi ? 'Read in English' : 'हिंदी में पढ़ें'}</span>
            </button>

            {/* Font Size Adjusters */}
            <div className="hidden sm:flex items-center rounded-lg bg-white/10 border border-white/15 p-0.5">
              <button
                onClick={() => setFontSizeLevel('normal')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSizeLevel === 'normal' ? 'bg-purple-800 text-white' : 'text-purple-200'}`}
                title="Normal Text"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel('large')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSizeLevel === 'large' ? 'bg-purple-800 text-white' : 'text-purple-200'}`}
                title="Large Text"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel('xlarge')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSizeLevel === 'xlarge' ? 'bg-purple-800 text-white' : 'text-purple-200'}`}
                title="Extra Large Text"
              >
                A++
              </button>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Share Article"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
            <span className="flex items-center gap-1.5 font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-full">
              <User className="w-3.5 h-3.5" />
              {blog.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(blog.published_date).toLocaleDateString(readingInHindi ? 'hi-IN' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {blog.reading_time_minutes} {readingInHindi ? 'मिनट पठन' : 'min read'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <Eye className="w-3.5 h-3.5" />
              {blog.views_count.toLocaleString()} {readingInHindi ? 'पाठक' : 'views'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 tracking-tight leading-tight font-hindi">
            {title}
          </h1>

          {/* Excerpt in Callout Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border-l-4 border-purple-900 text-slate-700 italic text-sm sm:text-base font-hindi">
            {excerpt}
          </div>

          {/* Cover Image */}
          {blog.cover_image && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md bg-slate-900">
              <Image
                src={blog.cover_image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Main Article Body */}
          <div className={`text-slate-800 font-hindi space-y-4 whitespace-pre-line ${getFontSizeClass()}`}>
            {content}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Categories:
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
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            {readingInHindi ? 'सत्येंद्र राव आधिकारिक शोध एवं नीति अभिलेख' : 'Satyendra Rao Official Policy & Thought Archive'}
          </span>

          <div className="flex items-center gap-3">
            <a
              href={fullPageUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <span>{readingInHindi ? 'पूर्ण पृष्ठ पर खोलें' : 'Open Dedicated Page'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-colors"
            >
              {readingInHindi ? 'बंद करें' : 'Close Reader'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import { NewsBrief } from '@/types';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  Share2, 
  Check, 
  Link2,
  Newspaper,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface NewsReaderModalProps {
  article: NewsBrief | null;
  onClose: () => void;
  isHindi: boolean;
}

export default function NewsReaderModal({ article, onClose, isHindi }: NewsReaderModalProps) {
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.source_url);
    showToast(isHindi ? 'समाचार लिंक कॉपी किया गया' : 'News link copied to clipboard', 'info');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isHindi ? article.headline_hi : article.headline_en,
        text: isHindi ? article.summary_hi : article.summary_en,
        url: article.source_url
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-900/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 bg-purple-950 text-white flex items-center justify-between border-b border-purple-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-800 flex items-center justify-center text-accent-yellow">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  {article.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-purple-500" />
                <span className="text-xs text-purple-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {article.source}
                </span>
              </div>
              <p className="text-[11px] text-purple-300/80">
                {new Date(article.published_date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 font-hindi">
          
          {/* Headlines */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 leading-tight">
              {isHindi ? article.headline_hi : article.headline_en}
            </h2>
            {article.headline_en && article.headline_hi && (
              <h3 className="text-base sm:text-lg font-semibold text-purple-950/80 font-sans">
                {isHindi ? article.headline_en : article.headline_hi}
              </h3>
            )}
          </div>

          {/* Verified Source Notification Banner */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-purple-950">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                <strong>{isHindi ? 'प्रकाशक:' : 'Publisher:'}</strong> {article.source}
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                {new URL(article.source_url).hostname.replace('www.', '')}
              </span>
            </div>

            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-900 font-bold hover:bg-purple-100 transition-colors shadow-2xs"
            >
              <span>{isHindi ? 'सीधा वेब लिंक' : 'Direct Web Link'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Main Story Narrative */}
          <div className="space-y-4 text-slate-800 text-base leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>{isHindi ? 'समाचार विस्तृत विवरण' : 'Detailed News Coverage'}</span>
              </h4>
              <p className="text-base text-slate-800 leading-relaxed font-normal">
                {isHindi ? article.summary_hi : article.summary_en}
              </p>
              {article.summary_en && isHindi && (
                <div className="pt-3 border-t border-slate-200 text-sm text-slate-600 font-sans">
                  <p>{article.summary_en}</p>
                </div>
              )}
            </div>

            {/* Key Takeaways */}
            {((isHindi && article.key_points_hi && article.key_points_hi.length > 0) || 
              (!isHindi && article.key_points_en && article.key_points_en.length > 0)) && (
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <span>📌 {isHindi ? 'मुख्य बिंदु एवं परीक्षा सुधार प्रभाव' : 'Key Highlights & Reform Impact'}</span>
                </h4>
                <ul className="space-y-2 text-sm text-slate-800">
                  {(isHindi ? article.key_points_hi : article.key_points_en)?.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600 mt-2 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Action Footer */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-900 bg-white text-xs font-bold transition-all shadow-2xs"
            >
              <Link2 className="w-4 h-4 text-purple-700" />
              <span>{isHindi ? 'लिंक कॉपी करें' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-900 bg-white text-xs font-bold transition-all shadow-2xs"
            >
              <Share2 className="w-4 h-4 text-purple-700" />
              <span>{isHindi ? 'शेयर करें' : 'Share'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors"
            >
              {isHindi ? 'बंद करें' : 'Close'}
            </button>

            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:shadow-lg"
            >
              <span>{isHindi ? `सीधे ${article.source} पर पूरा समाचार पढ़ें` : `Open Original on ${article.source}`}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

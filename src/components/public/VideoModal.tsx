'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink, Play, Youtube, Info, Share2, Check } from 'lucide-react';

interface VideoModalProps {
  videoId: string;
  title: string;
  category?: string;
  views?: string;
  duration?: string;
  description?: string;
  onClose: () => void;
}

export default function VideoModal({
  videoId,
  title,
  category,
  views,
  duration,
  description,
  onClose
}: VideoModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Watch Satyendra Rao: ${title}`,
        url: youtubeUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(youtubeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white border-b border-purple-800/50">
          <div className="flex items-center gap-2.5 truncate mr-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600/90 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Youtube className="w-4 h-4 fill-current" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate font-hindi">
                {title}
              </h3>
              {category && (
                <span className="text-[11px] font-semibold text-purple-200">
                  {category} {duration ? `• ${duration}` : ''} {views ? `• ${views}` : ''}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors shrink-0"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Responsive Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Bottom Control & Info Strip */}
        <div className="p-4 sm:p-5 bg-slate-950 text-slate-200 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white font-hindi line-clamp-1">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-slate-400 font-hindi line-clamp-2 max-w-xl">
                {description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Share'}</span>
            </button>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

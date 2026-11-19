'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { NewsBrief } from '@/types';
import { 
  Newspaper, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Languages,
  Link2,
  BookOpen
} from 'lucide-react';
import NewsReaderModal from '@/components/public/NewsReaderModal';

export default function HomeLatestNews({ initialNews = [] }: { initialNews?: NewsBrief[] }) {
  const { t, isHindi } = useLanguage();
  const { showToast } = useToast();
  const [news, setNews] = useState<NewsBrief[]>(initialNews);
  const [loading, setLoading] = useState(initialNews.length === 0);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [importantIds, setImportantIds] = useState<Set<string>>(new Set());
  const [langPreference, setLangPreference] = useState<'both' | 'hi' | 'en'>('both');
  const [activeArticle, setActiveArticle] = useState<NewsBrief | null>(null);

  useEffect(() => {
    // Load saved bookmarks from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('sr_saved_news') || '[]');
      const important = JSON.parse(localStorage.getItem('sr_important_news') || '[]');
      setSavedIds(new Set(saved));
      setImportantIds(new Set(important));
    } catch (e) {}

    fetch('/api/news?status=published&limit=3')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNews(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const next = new Set(savedIds);
    if (next.has(id)) {
      next.delete(id);
      showToast(isHindi ? 'समाचार संग्रह से हटाया गया' : 'Removed from saved news', 'info');
    } else {
      next.add(id);
      showToast(isHindi ? 'समाचार सफलतापूर्वक सहेजा गया' : 'Saved for later reading', 'success');
      trackEvent('save_news', { news_id: id });
    }
    setSavedIds(next);
    localStorage.setItem('sr_saved_news', JSON.stringify(Array.from(next)));
  };

  const toggleImportant = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const next = new Set(importantIds);
    if (next.has(id)) {
      next.delete(id);
      showToast(isHindi ? 'महत्वपूर्ण चिह्न हटाया गया' : 'Removed from important', 'info');
    } else {
      next.add(id);
      showToast(isHindi ? 'समाचार को महत्वपूर्ण चिह्नित किया गया' : 'Marked as important', 'success');
      trackEvent('mark_important_news', { news_id: id });
    }
    setImportantIds(next);
    localStorage.setItem('sr_important_news', JSON.stringify(Array.from(next)));
  };

  const handleReadOriginal = (item: NewsBrief) => {
    trackEvent('read_original_news', { news_id: item.id, url: item.source_url });
    // increment views
    fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'increment_view', id: item.id })
    }).catch(() => {});
  };

  return (
    <section className="py-16 bg-slate-50/70 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5 text-purple-800" />
              <span>{isHindi ? 'दैनिक समाचार एवं मीडिया' : 'Latest News & Press'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 font-hindi">
              {t.newsHeading}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-hindi">
              {t.newsSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex items-center bg-white border border-purple-200 rounded-lg p-1 text-xs font-semibold shadow-xs">
              <Languages className="w-3.5 h-3.5 text-purple-800 ml-1.5 mr-1" />
              <button
                onClick={() => setLangPreference('both')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  langPreference === 'both' ? 'bg-purple-900 text-white font-bold' : 'text-slate-600 hover:text-purple-900'
                }`}
              >
                {isHindi ? 'द्विभाषी' : 'Bilingual'}
              </button>
              <button
                onClick={() => setLangPreference('hi')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  langPreference === 'hi' ? 'bg-purple-900 text-white font-bold' : 'text-slate-600 hover:text-purple-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLangPreference('en')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  langPreference === 'en' ? 'bg-purple-900 text-white font-bold' : 'text-slate-600 hover:text-purple-900'
                }`}
              >
                English
              </button>
            </div>

            <a
              href="/news"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-950 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
            >
              <span>{isHindi ? 'समस्त समाचार देखें' : 'View All News'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => {
            const isSaved = savedIds.has(item.id);
            const isImportant = importantIds.has(item.id);

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-purple-100 shadow-card hover:shadow-hover hover:border-purple-300 transition-all duration-300"
              >
                <div>
                  {/* Top Meta Bar */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.published_date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>

                      {/* Importance Badge */}
                      {item.importance === 'critical' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          {isHindi ? 'अति महत्वपूर्ण' : 'Critical'}
                        </span>
                      )}
                      {item.importance === 'high' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {isHindi ? 'प्राथमिकता' : 'High Priority'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Clickable Headline (Opens In-Portal Reader, External Icon Opens Live Source) */}
                  <div className="flex items-start gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveArticle(item)}
                      className="text-left text-base sm:text-[17px] font-bold text-navy-900 leading-snug hover:text-purple-900 transition-colors font-hindi cursor-pointer"
                    >
                      {isHindi ? item.headline_hi : item.headline_en}
                    </button>
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleReadOriginal(item)}
                      title={isHindi ? `${item.source} पर सीधे खोलें` : `Open on ${item.source}`}
                      className="p-1 text-purple-700 hover:text-purple-950 transition-colors shrink-0 mt-0.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Source indicator */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-purple-900 font-semibold">
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>{item.source}</span>
                      <ExternalLink className="w-3 h-3 text-purple-600" />
                    </a>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      {t.newsApprovedBadge}
                    </span>
                  </div>

                  {/* Direct News Excerpt (Clean, No AI Badges) */}
                  <div className="mt-4 text-xs sm:text-[13px] text-slate-700 leading-relaxed font-hindi">
                    {(langPreference === 'both' || langPreference === 'hi') && (
                      <p className="p-3 bg-purple-50/50 rounded-xl border border-purple-100/70">
                        {item.summary_hi}
                      </p>
                    )}

                    {(langPreference === 'both' || langPreference === 'en') && item.summary_en && (
                      <p className="p-3 mt-2 bg-slate-50 rounded-xl border border-slate-200/70 font-sans">
                        {item.summary_en}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveArticle(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'विवरण पढ़ें' : 'Read'}</span>
                    </button>

                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleReadOriginal(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 px-3 py-1.5 rounded-xl transition-all shadow-xs"
                    >
                      <span>{isHindi ? `सीधे ${item.source} पर पढ़ें` : `Open on ${item.source}`}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Copy Direct Link */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(item.source_url);
                        showToast(isHindi ? 'सीधा लिंक कॉपी किया गया' : 'Direct link copied', 'info');
                      }}
                      title="Copy Direct Link"
                      className="p-2 rounded-lg text-slate-400 hover:text-purple-900 hover:bg-purple-50 transition-colors"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>

                    {/* Mark as Important */}
                    <button
                      onClick={(e) => toggleImportant(item.id, e)}
                      title={isImportant ? 'Marked as Important' : 'Mark as Important'}
                      className={`p-2 rounded-lg transition-colors ${
                        isImportant
                          ? 'text-accent-gold bg-amber-50'
                          : 'text-slate-400 hover:text-accent-gold hover:bg-slate-100'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isImportant ? 'fill-accent-gold' : ''}`} />
                    </button>

                    {/* Bookmark / Save for later */}
                    <button
                      onClick={(e) => toggleSave(item.id, e)}
                      title={isSaved ? 'Saved for Later' : 'Save for Later'}
                      className={`p-2 rounded-lg transition-colors ${
                        isSaved
                          ? 'text-purple-900 bg-purple-100'
                          : 'text-slate-400 hover:text-purple-900 hover:bg-purple-50'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* In-Portal News Reader Modal */}
      <NewsReaderModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        isHindi={isHindi}
      />
    </section>
  );
}

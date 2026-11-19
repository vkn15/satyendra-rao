'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { NewsBrief } from '@/types';
import { 
  Sparkles, 
  Search, 
  Filter, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  Calendar, 
  ShieldCheck, 
  Languages, 
  FileEdit, 
  Check, 
  Share2, 
  Info,
  ChevronDown
} from 'lucide-react';

export default function NewsPage() {
  const { t, isHindi } = useLanguage();
  const { showToast } = useToast();

  const [news, setNews] = useState<NewsBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImportance, setSelectedImportance] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'important'>('all');
  const [langPreference, setLangPreference] = useState<'both' | 'hi' | 'en'>('both');

  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [importantIds, setImportantIds] = useState<Set<string>>(new Set());
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sr_saved_news') || '[]');
      const important = JSON.parse(localStorage.getItem('sr_important_news') || '[]');
      const notes = JSON.parse(localStorage.getItem('sr_user_notes') || '{}');
      setSavedIds(new Set(saved));
      setImportantIds(new Set(important));
      setUserNotes(notes);
    } catch (e) {}

    fetchNews();
  }, []);

  const fetchNews = () => {
    setLoading(true);
    fetch('/api/news?status=published')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNews(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const toggleSave = (id: string) => {
    const next = new Set(savedIds);
    if (next.has(id)) {
      next.delete(id);
      showToast(isHindi ? 'संग्रह से हटाया गया' : 'Removed from bookmarks', 'info');
    } else {
      next.add(id);
      showToast(isHindi ? 'सफलतापूर्वक सहेजा गया' : 'Saved for later reading', 'success');
      trackEvent('save_news', { news_id: id });
    }
    setSavedIds(next);
    localStorage.setItem('sr_saved_news', JSON.stringify(Array.from(next)));
  };

  const toggleImportant = (id: string) => {
    const next = new Set(importantIds);
    if (next.has(id)) {
      next.delete(id);
      showToast(isHindi ? 'महत्वपूर्ण चिह्न हटाया गया' : 'Removed from important', 'info');
    } else {
      next.add(id);
      showToast(isHindi ? 'महत्वपूर्ण चिह्नित किया गया' : 'Marked as important', 'success');
      trackEvent('mark_important_news', { news_id: id });
    }
    setImportantIds(next);
    localStorage.setItem('sr_important_news', JSON.stringify(Array.from(next)));
  };

  const handleSaveNote = (id: string) => {
    const next = { ...userNotes, [id]: tempNoteText };
    setUserNotes(next);
    localStorage.setItem('sr_user_notes', JSON.stringify(next));
    setEditingNoteId(null);
    showToast(isHindi ? 'टिप्पणी सहेजी गई' : 'Note saved successfully', 'success');
  };

  const handleShare = (item: NewsBrief) => {
    trackEvent('share', { news_id: item.id });
    const url = item.source_url;
    if (navigator.share) {
      navigator.share({
        title: isHindi ? item.headline_hi : item.headline_en,
        text: isHindi ? item.summary_hi : item.summary_en,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showToast(isHindi ? 'समाचार लिंक कॉपी किया गया' : 'News link copied', 'info');
    }
  };

  const categories = [
    { id: 'all', label_hi: 'सभी विषय', label_en: 'All Topics' },
    { id: 'Legal & Judiciary', label_hi: 'न्यायालय व कानून', label_en: 'Legal & Courts' },
    { id: 'Policy & Governance', label_hi: 'नीति व शासन', label_en: 'Policy & Governance' },
    { id: 'Recruitment Exams', label_hi: 'भर्ती व परीक्षाएँ', label_en: 'Recruitments & Exams' },
    { id: 'Institutional Reforms', label_hi: 'आयोग सुधार', label_en: 'Institutional Reforms' },
    { id: 'Youth Advocacy', label_hi: 'युवा पैरोकारी', label_en: 'Youth Advocacy' }
  ];

  // Filtering
  const filteredNews = news.filter(item => {
    if (activeTab === 'saved' && !savedIds.has(item.id)) return false;
    if (activeTab === 'important' && !importantIds.has(item.id)) return false;

    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedImportance !== 'all' && item.importance !== selectedImportance) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        item.headline_en.toLowerCase().includes(q) ||
        item.headline_hi.toLowerCase().includes(q) ||
        item.summary_en.toLowerCase().includes(q) ||
        item.summary_hi.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-slate-50/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* E-Paper Header matching Newspaper Reference Screenshot */}
          <div className="flex items-center justify-between border-y-2 border-slate-900 py-2 px-1 mb-8 text-[11px] font-mono tracking-widest text-slate-800 uppercase font-bold">
            <span>{isHindi ? 'दैनिक ई-बुलेटिन • युवा संस्करण' : 'DAILY NEWS BRIEFING • E-PAPER EDITION'}</span>
            <span className="hidden sm:inline font-sans">{new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>{isHindi ? 'अंक 1 • भर्ती सुधार' : 'VOL. I • RECRUITMENT REFORMS'}</span>
          </div>

          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
              <span>{isHindi ? 'एआई-संचालित दैनिक समाचार बुलेटिन' : 'AI-Powered Daily News Briefing'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight font-hindi">
              {t.newsHeading}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl font-hindi leading-relaxed">
              {t.newsSubtitle}
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm mb-8 space-y-4">
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.newsSearchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent font-hindi"
                />
              </div>

              {/* Language View Switcher */}
              <div className="inline-flex items-center bg-purple-50 border border-purple-200 rounded-xl p-1 text-xs font-semibold shrink-0">
                <Languages className="w-3.5 h-3.5 text-purple-800 ml-2 mr-1" />
                <button
                  onClick={() => setLangPreference('both')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    langPreference === 'both' ? 'bg-purple-900 text-white font-bold' : 'text-slate-600 hover:text-purple-900'
                  }`}
                >
                  {isHindi ? 'द्विभाषी' : 'Bilingual'}
                </button>
                <button
                  onClick={() => setLangPreference('hi')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    langPreference === 'hi' ? 'bg-purple-900 text-white font-bold' : 'text-slate-600 hover:text-purple-900'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLangPreference('en')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    langPreference === 'en' ? 'bg-purple-900 text-white font-bold' : 'text-slate-600 hover:text-purple-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Category Pills & Tab Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'all' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  {isHindi ? 'समस्त समाचार' : 'All Briefings'} ({news.length})
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'saved' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  {isHindi ? 'सहेजे गए' : 'Saved'} ({savedIds.size})
                </button>
                <button
                  onClick={() => setActiveTab('important')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'important' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  {isHindi ? 'महत्वपूर्ण' : 'Important'} ({importantIds.size})
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedCategory === c.id
                        ? 'bg-purple-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-900'
                    }`}
                  >
                    {isHindi ? c.label_hi : c.label_en}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* News List */}
          {filteredNews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 p-8 space-y-3">
              <Info className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-navy-900 font-hindi">
                {isHindi ? 'कोई समाचार उपलब्ध नहीं है' : 'No news briefs found'}
              </h3>
              <p className="text-sm text-slate-500 font-hindi">
                {isHindi ? 'कृपया अपने फ़िल्टर बदलें या खोज शब्द रीसेट करें।' : 'Try adjusting your search criteria or category filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNews.map(item => {
                const isSaved = savedIds.has(item.id);
                const isImportant = importantIds.has(item.id);
                const note = userNotes[item.id] || '';
                const isEditingNote = editingNoteId === item.id;

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200">
                            {item.category}
                          </span>

                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(item.published_date).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>

                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-slate-600">
                            {isHindi ? 'स्रोत:' : 'Source:'} {item.source}
                          </span>

                          {item.importance === 'critical' && (
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                              {isHindi ? 'अति महत्वपूर्ण (Critical)' : 'Critical'}
                            </span>
                          )}
                          {item.importance === 'high' && (
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              {isHindi ? 'उच्च प्राथमिकता' : 'High Priority'}
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-navy-900 leading-snug font-hindi">
                          {isHindi ? item.headline_hi : item.headline_en}
                        </h2>
                      </div>

                      {/* Top Action Icons */}
                      <div className="flex items-center gap-1 shrink-0 self-start">
                        <button
                          onClick={() => toggleImportant(item.id)}
                          title={isImportant ? 'Marked Important' : 'Mark Important'}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            isImportant
                              ? 'border-amber-300 bg-amber-50 text-amber-600'
                              : 'border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isImportant ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => toggleSave(item.id)}
                          title={isSaved ? 'Saved' : 'Save for Later'}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            isSaved
                              ? 'border-purple-300 bg-purple-50 text-purple-900'
                              : 'border-slate-200 text-slate-400 hover:text-purple-900 hover:bg-slate-50'
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleShare(item)}
                          title="Share Article"
                          className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-purple-900 hover:bg-slate-50 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* AI Summaries Section */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Hindi Summary */}
                      {(langPreference === 'both' || langPreference === 'hi') && (
                        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-3 font-hindi">
                          <div className="flex items-center justify-between text-xs font-bold text-purple-900 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                              हिन्दी सारांश (AI Verified Summary)
                            </span>
                          </div>
                          <p className="text-sm text-slate-800 leading-relaxed">
                            {item.summary_hi}
                          </p>

                          {item.key_points_hi && item.key_points_hi.length > 0 && (
                            <div className="pt-2 border-t border-purple-200/60">
                              <span className="block text-[11px] font-bold text-purple-950 uppercase tracking-wide mb-1.5">
                                मुख्य बिंदु:
                              </span>
                              <ul className="space-y-1.5 text-xs text-slate-700">
                                {item.key_points_hi.map((pt, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-900 mt-1.5 shrink-0" />
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* English Summary */}
                      {(langPreference === 'both' || langPreference === 'en') && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                              English Summary (AI Policy Brief)
                            </span>
                          </div>
                          <p className="text-sm text-slate-800 leading-relaxed">
                            {item.summary_en}
                          </p>

                          {item.key_points_en && item.key_points_en.length > 0 && (
                            <div className="pt-2 border-t border-slate-200">
                              <span className="block text-[11px] font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                                Key Takeaways:
                              </span>
                              <ul className="space-y-1.5 text-xs text-slate-700">
                                {item.key_points_en.map((pt, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                    {/* Private Notes Section */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      {isEditingNote ? (
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700">
                            {isHindi ? 'निजी टिप्पणी दर्ज करें (Private Notes):' : 'Enter Private Notes:'}
                          </label>
                          <textarea
                            rows={2}
                            value={tempNoteText}
                            onChange={e => setTempNoteText(e.target.value)}
                            placeholder={isHindi ? 'इस समाचार से जुड़े अपने निजी विचार या कार्रवाई बिंदु लिखें...' : 'Add your private research or action notes on this news item...'}
                            className="w-full p-3 rounded-xl border border-purple-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-700"
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                            >
                              {isHindi ? 'रद्द करें' : 'Cancel'}
                            </button>
                            <button
                              onClick={() => handleSaveNote(item.id)}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-purple-900 text-white hover:bg-purple-950 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'सहेजें' : 'Save Note'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          {note ? (
                            <div className="flex items-center gap-2 text-purple-950 font-medium">
                              <span className="font-bold text-purple-900">📌 {isHindi ? 'आपकी टिप्पणी:' : 'Your Note:'}</span>
                              <span className="italic text-slate-700">{note}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">
                              {isHindi ? 'कोई निजी टिप्पणी नहीं जोड़ी गई।' : 'No private notes added.'}
                            </span>
                          )}

                          <button
                            onClick={() => {
                              setEditingNoteId(item.id);
                              setTempNoteText(note);
                            }}
                            className="inline-flex items-center gap-1 text-purple-800 hover:text-purple-950 font-bold hover:underline"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>{note ? (isHindi ? 'टिप्पणी बदलें' : 'Edit Note') : t.btnAddNotes}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom Link to Original Article */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{isHindi ? 'प्रशासनिक व विधिक निगरानी हेतु सत्यापित' : 'Verified source snippet'}</span>
                      </div>

                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <span>{t.btnReadOriginal}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </article>
                );
              })}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

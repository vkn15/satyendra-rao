'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AIAssistantModal from '@/components/admin/AIAssistantModal';
import { useToast } from '@/context/ToastContext';
import { NewsBrief, ImportanceLevel, PublicationStatus } from '@/types';
import { 
  Radio, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  AlertTriangle, 
  FileEdit, 
  CheckCircle2, 
  Search, 
  Share2, 
  MessageSquare, 
  BookOpen, 
  Plus,
  StickyNote,
  X,
  Filter,
  Calendar
} from 'lucide-react';

export default function AdminDailyNewsPage() {
  const { showToast } = useToast();
  const [news, setNews] = useState<NewsBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRss, setFetchingRss] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // AI Assistant Modal state
  const [aiItem, setAiItem] = useState<NewsBrief | null>(null);

  // Private Note Modal state
  const [noteItem, setNoteItem] = useState<NewsBrief | null>(null);
  const [privateNoteText, setPrivateNoteText] = useState('');

  const categories = [
    'Rajasthan News',
    'Recruitment News',
    'RPSC',
    'RSSB',
    'Education',
    'Employment',
    'Government Announcements',
    'Public Policy'
  ];

  const fetchNews = () => {
    setLoading(true);
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNews(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFetchRssFeeds = async () => {
    setFetchingRss(true);
    showToast('Fetching latest configured RSS feeds...', 'info');
    try {
      const res = await fetch('/api/news/fetch', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Feed sync complete: ${data.totalNew} new articles fetched`, 'success');
        fetchNews();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      showToast(e.message || 'Error fetching RSS feeds', 'error');
    } finally {
      setFetchingRss(false);
    }
  };

  const handleToggleBookmark = async (item: NewsBrief) => {
    const updated = !item.is_bookmarked;
    try {
      const res = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_bookmarked: updated })
      });
      if (res.ok) {
        showToast(updated ? 'Saved for later review' : 'Removed from saved', 'info');
        fetchNews();
      }
    } catch (e) {
      showToast('Error updating bookmark', 'error');
    }
  };

  const handleToggleImportance = async (item: NewsBrief) => {
    const nextLevel: ImportanceLevel = item.importance === 'critical' ? 'medium' : 'critical';
    try {
      const res = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, importance: nextLevel })
      });
      if (res.ok) {
        showToast(`Importance set to ${nextLevel.toUpperCase()}`, 'success');
        fetchNews();
      }
    } catch (e) {
      showToast('Error updating importance', 'error');
    }
  };

  const handleSavePrivateNote = async () => {
    if (!noteItem) return;
    try {
      const res = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: noteItem.id, private_notes: privateNoteText })
      });
      if (res.ok) {
        showToast('Private note saved', 'success');
        setNoteItem(null);
        fetchNews();
      }
    } catch (e) {
      showToast('Error saving note', 'error');
    }
  };

  const handleApprovePublish = async (item: NewsBrief) => {
    try {
      const res = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          status: 'published',
          approved_at: new Date().toISOString(),
          approved_by: 'Super Admin'
        })
      });
      if (res.ok) {
        showToast('Article published to public /news!', 'success');
        fetchNews();
      }
    } catch (e) {
      showToast('Error publishing article', 'error');
    }
  };

  const handleApplySummary = async (summary_en: string, summary_hi: string, points_en?: string[], points_hi?: string[]) => {
    if (!aiItem) return;
    try {
      const res = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: aiItem.id,
          summary_en,
          summary_hi,
          key_points_en: points_en,
          key_points_hi: points_hi,
          ai_generated: true,
          ai_provider: 'Gemini 1.5 Flash'
        })
      });
      if (res.ok) {
        showToast('AI summaries saved to database', 'success');
        setAiItem(null);
        fetchNews();
      }
    } catch (e) {
      showToast('Error saving AI summary', 'error');
    }
  };

  const filteredNews = news.filter(n => {
    const matchesSearch = !search.trim() || (
      n.headline_en?.toLowerCase().includes(search.toLowerCase()) ||
      n.headline_hi?.toLowerCase().includes(search.toLowerCase()) ||
      n.source?.toLowerCase().includes(search.toLowerCase())
    );

    const matchesImportance = selectedImportance === 'all' || n.importance === selectedImportance;
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;

    return matchesSearch && matchesImportance && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Daily News Briefing & AI Summarization"
        subtitle="AI-assisted news intelligence, Hindi/English summarization, and verified media coverage"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchRssFeeds}
              disabled={fetchingRss}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingRss ? 'animate-spin' : ''}`} />
              <span>{fetchingRss ? 'Fetching Feeds...' : 'Fetch Daily RSS'}</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Priority:
            </span>
            {['all', 'critical', 'high', 'medium', 'general'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedImportance(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                  selectedImportance === lvl
                    ? 'bg-purple-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search briefing items..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
              />
            </div>
          </div>
        </div>

        {/* News Cards */}
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Radio className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No news briefings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click "Fetch Daily RSS" to aggregate live Rajasthan recruitment and governance news.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 border transition-all ${
                  item.importance === 'critical'
                    ? 'border-red-200 shadow-sm bg-red-50/20'
                    : 'border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-5">
                  
                  {/* Left: Content */}
                  <div className="flex-1 space-y-3">
                    
                    {/* Header line */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-100">
                        {item.source}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {item.category}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.published_date || item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </span>

                      {/* Importance Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        item.importance === 'critical'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : item.importance === 'high'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.importance}
                      </span>

                      {/* AI Generated tag */}
                      {item.ai_generated && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>AI Summarized</span>
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <div>
                      <h3 className="text-base font-bold text-navy-900 leading-snug">
                        {item.headline_en}
                      </h3>
                      {item.headline_hi && (
                        <h4 className="text-sm font-semibold text-purple-950 font-hindi mt-1">
                          {item.headline_hi}
                        </h4>
                      )}
                    </div>

                    {/* Bilingual Summaries */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {item.summary_hi && (
                        <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 font-hindi">
                          <span className="block font-bold text-purple-950 mb-1 text-[11px]">
                            हिन्दी सारांश (Hindi Summary):
                          </span>
                          <p className="text-slate-700 leading-relaxed">{item.summary_hi}</p>
                        </div>
                      )}

                      {item.summary_en && (
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="block font-bold text-slate-700 mb-1 text-[11px]">
                            English Summary:
                          </span>
                          <p className="text-slate-600 leading-relaxed">{item.summary_en}</p>
                        </div>
                      )}
                    </div>

                    {/* Private Notes Display */}
                    {item.private_notes && (
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
                        <div>
                          <strong>Internal Movement Note:</strong> {item.private_notes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions Column */}
                  <div className="flex flex-row lg:flex-col gap-2 shrink-0 self-stretch lg:self-auto justify-end">
                    
                    {/* AI Summarize Assistant */}
                    <button
                      onClick={() => setAiItem(item)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent-yellow" />
                      <span>Summarize with AI</span>
                    </button>

                    {/* Read Original Article */}
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-900 text-xs font-bold transition-colors"
                    >
                      <span>Read Original</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => handleToggleBookmark(item)}
                      className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        item.is_bookmarked
                          ? 'border-purple-300 bg-purple-50 text-purple-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.is_bookmarked ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-purple-700" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                          <span>Save Later</span>
                        </>
                      )}
                    </button>

                    {/* Mark as Important */}
                    <button
                      onClick={() => handleToggleImportance(item)}
                      className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        item.importance === 'critical'
                          ? 'border-red-300 bg-red-100 text-red-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <AlertTriangle className={`w-3.5 h-3.5 ${item.importance === 'critical' ? 'text-red-700' : 'text-slate-400'}`} />
                      <span>{item.importance === 'critical' ? 'Urgent / Critical' : 'Mark Important'}</span>
                    </button>

                    {/* Add Private Note */}
                    <button
                      onClick={() => {
                        setNoteItem(item);
                        setPrivateNoteText(item.private_notes || '');
                      }}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                    >
                      <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.private_notes ? 'Edit Note' : 'Add Note'}</span>
                    </button>

                    {/* Publish toggle */}
                    {item.status !== 'published' && (
                      <button
                        onClick={() => handleApprovePublish(item)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer mt-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Publish to /news</span>
                      </button>
                    )}

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* AI Assistant Modal */}
      {aiItem && (
        <AIAssistantModal
          newsItem={aiItem}
          onClose={() => setAiItem(null)}
          onApplySummary={handleApplySummary}
        />
      )}

      {/* Private Note Modal */}
      {noteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-purple-800" />
                <span>Private Movement Note</span>
              </h3>
              <button
                onClick={() => setNoteItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Add private notes visible only to Satyendra Rao and authorized movement admins:
            </p>

            <textarea
              rows={4}
              value={privateNoteText}
              onChange={e => setPrivateNoteText(e.target.value)}
              placeholder="e.g. Discuss with Advocate in High Court hearing on Friday..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setNoteItem(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrivateNote}
                className="px-4 py-1.5 rounded-lg bg-purple-900 text-white text-xs font-bold hover:bg-purple-800"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

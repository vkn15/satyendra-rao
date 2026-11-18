'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AIAssistantModal from '@/components/admin/AIAssistantModal';
import { useToast } from '@/context/ToastContext';
import { NewsBrief, ImportanceLevel, PublicationStatus } from '@/types';
import { 
  Sparkles, 
  RefreshCw, 
  Plus, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  ShieldCheck, 
  XCircle, 
  Share2,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function AdminNewsPage() {
  const { showToast } = useToast();
  const [news, setNews] = useState<NewsBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRss, setFetchingRss] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // AI Assistant Modal state
  const [activeAIItem, setActiveAIItem] = useState<NewsBrief | null>(null);

  // Edit / Create Modal state
  const [editingItem, setEditingItem] = useState<NewsBrief | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [form, setForm] = useState({
    headline_en: '',
    headline_hi: '',
    source: '',
    source_url: '',
    category: 'Policy & Governance',
    importance: 'medium' as ImportanceLevel,
    summary_en: '',
    summary_hi: '',
    private_notes: '',
    status: 'pending_review' as PublicationStatus
  });

  const fetchNews = () => {
    setLoading(true);
    let url = '/api/news';
    if (statusFilter !== 'all') url += `?status=${statusFilter}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNews(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, [statusFilter]);

  const handleFetchRssFeeds = async () => {
    setFetchingRss(true);
    showToast('Fetching configured RSS feeds & generating AI summaries...', 'info');
    try {
      const res = await fetch('/api/news/fetch', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Feed sync complete: ${data.totalNew} new articles summarized and queued for review`, 'success');
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

  const handleApprove = async (item: NewsBrief) => {
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
        showToast('Article approved and published to website!', 'success');
        fetchNews();
      }
    } catch (e) {
      showToast('Failed to approve', 'error');
    }
  };

  const handleReject = async (item: NewsBrief) => {
    try {
      const res = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          status: 'draft'
        })
      });
      if (res.ok) {
        showToast('Article moved to draft', 'info');
        fetchNews();
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const openEdit = (item: NewsBrief) => {
    setEditingItem(item);
    setForm({
      headline_en: item.headline_en,
      headline_hi: item.headline_hi,
      source: item.source,
      source_url: item.source_url,
      category: item.category,
      importance: item.importance,
      summary_en: item.summary_en,
      summary_hi: item.summary_hi,
      private_notes: item.private_notes || '',
      status: item.status
    });
  };

  const openCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setForm({
      headline_en: '',
      headline_hi: '',
      source: 'Government / Commission Press Desk',
      source_url: '',
      category: 'Policy & Governance',
      importance: 'medium',
      summary_en: '',
      summary_hi: '',
      private_notes: '',
      status: 'pending_review'
    });
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch('/api/news', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            ...form
          })
        });
        if (res.ok) {
          showToast('Article updated successfully', 'success');
          setEditingItem(null);
          fetchNews();
        }
      } else {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            published_date: new Date().toISOString(),
            ai_generated: false
          })
        });
        if (res.ok) {
          showToast('New briefing created', 'success');
          setIsCreating(false);
          fetchNews();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving article', 'error');
    }
  };

  // Filtered List
  const filtered = news.filter(item => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.headline_en.toLowerCase().includes(q) ||
        item.headline_hi.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.summary_en.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="News Briefings & AI Hub"
        subtitle="AI summarization, authorized RSS feeds ingestion, review queue & multi-channel publishing"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchRssFeeds}
              disabled={fetchingRss}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingRss ? 'animate-spin' : ''}`} />
              <span>{fetchingRss ? 'Summarizing Feeds...' : 'Fetch RSS & AI Summarize'}</span>
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-yellow hover:bg-amber-400 text-navy-900 font-bold text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Briefing</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Status Tabs and Search */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {[
              { id: 'all', label: 'All Articles' },
              { id: 'pending_review', label: 'Pending Review', badge: news.filter(n => n.status === 'pending_review').length },
              { id: 'published', label: 'Published' },
              { id: 'draft', label: 'Drafts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-navy-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent-yellow text-navy-900 text-[10px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search headline, source..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-700"
            />
          </div>
        </div>

        {/* News Table / Cards */}
        <div className="space-y-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs transition-all ${
                item.status === 'pending_review'
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                
                {/* Left: Article Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-900">
                      {item.category}
                    </span>

                    <span className="text-slate-500">
                      {new Date(item.published_date).toLocaleDateString()}
                    </span>

                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700">
                      {item.source}
                    </span>

                    {/* Status Badge */}
                    {item.status === 'published' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Published
                      </span>
                    )}
                    {item.status === 'pending_review' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </span>
                    )}
                    {item.status === 'draft' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        Draft
                      </span>
                    )}

                    {item.ai_generated && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-accent-gold" />
                        AI Summarized
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-navy-900 leading-snug">
                    {item.headline_en}
                  </h3>
                  <h4 className="text-sm font-semibold text-purple-950 font-hindi">
                    {item.headline_hi}
                  </h4>

                  {/* Summary Snippets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                    <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 font-hindi">
                      <span className="block font-bold text-purple-900 mb-1">
                        हिन्दी सारांश:
                      </span>
                      <p className="line-clamp-2">{item.summary_hi}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="block font-bold text-slate-700 mb-1">
                        English Summary:
                      </span>
                      <p className="line-clamp-2">{item.summary_en}</p>
                    </div>
                  </div>

                  {item.private_notes && (
                    <div className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                      <strong>Admin Note:</strong> {item.private_notes}
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 self-stretch sm:self-auto justify-center">
                  
                  {/* AI Assistant Action Button */}
                  <button
                    onClick={() => setActiveAIItem(item)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 text-xs font-bold transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                    <span>AI Assistant Actions</span>
                  </button>

                  {/* Approve / Publish */}
                  {item.status !== 'published' ? (
                    <button
                      onClick={() => handleApprove(item)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReject(item)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                    >
                      Unpublish (Draft)
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-purple-200 text-purple-900 hover:bg-purple-50 text-xs font-bold"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit Article</span>
                  </button>

                  {/* Source link */}
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-700 text-[11px]"
                  >
                    <span>View Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                </div>

              </div>
            </div>
          ))}
        </div>

      </main>

      {/* AI Assistant Drawer */}
      {activeAIItem && (
        <AIAssistantModal
          newsItem={activeAIItem}
          onClose={() => setActiveAIItem(null)}
          onApplySummary={(en, hi) => {
            fetch('/api/news', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: activeAIItem.id,
                summary_en: en,
                summary_hi: hi
              })
            }).then(() => fetchNews());
          }}
        />
      )}

      {/* Edit / Create Form Modal with Separate Hindi & English Fields */}
      {(editingItem || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingItem ? 'Edit News Briefing (Bilingual)' : 'Create New News Briefing'}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="text-white/70 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    English Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.headline_en}
                    onChange={e => setForm({ ...form, headline_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-hindi">
                    हिन्दी शीर्षक (Hindi Headline) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.headline_hi}
                    onChange={e => setForm({ ...form, headline_hi: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Name *</label>
                  <input
                    type="text"
                    required
                    value={form.source}
                    onChange={e => setForm({ ...form, source: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source URL *</label>
                  <input
                    type="url"
                    required
                    value={form.source_url}
                    onChange={e => setForm({ ...form, source_url: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Importance</label>
                  <select
                    value={form.importance}
                    onChange={e => setForm({ ...form, importance: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    English Summary (AI or Reviewed) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.summary_en}
                    onChange={e => setForm({ ...form, summary_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-hindi">
                    हिन्दी सारांश (Hindi Summary) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.summary_hi}
                    onChange={e => setForm({ ...form, summary_hi: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 font-hindi leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Private Admin Notes</label>
                  <input
                    type="text"
                    value={form.private_notes}
                    onChange={e => setForm({ ...form, private_notes: e.target.value })}
                    placeholder="Internal reference or review notes..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold"
                >
                  Save Briefing
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

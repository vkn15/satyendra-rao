'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { NewsBrief, ImportanceLevel, PublicationStatus } from '@/types';
import { 
  Newspaper, 
  RefreshCw, 
  Plus, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  XCircle, 
  Calendar, 
  Trash2,
  Link2
} from 'lucide-react';

export default function AdminNewsPage() {
  const { showToast } = useToast();
  const [news, setNews] = useState<NewsBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRss, setFetchingRss] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

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
    status: 'published' as PublicationStatus
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
    showToast('Fetching latest configured RSS feeds...', 'info');
    try {
      const res = await fetch('/api/news/fetch', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Feed sync complete: ${data.totalNew} new articles added to news list`, 'success');
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
        showToast('Article published to website!', 'success');
        fetchNews();
      }
    } catch (e) {
      showToast('Failed to publish', 'error');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article link?')) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('News article deleted successfully', 'success');
        fetchNews();
      } else {
        showToast('Failed to delete news article', 'error');
      }
    } catch (e) {
      showToast('Error deleting article', 'error');
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
      source: 'Dainik Bhaskar',
      source_url: '',
      category: 'Policy & Governance',
      importance: 'medium',
      summary_en: '',
      summary_hi: '',
      private_notes: '',
      status: 'published'
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
          showToast('News link updated successfully', 'success');
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
          showToast('New news article link created', 'success');
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
        title="News & Press Links Management"
        subtitle="Manage verified news articles, direct press links, and media coverage updates without AI summarization"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchRssFeeds}
              disabled={fetchingRss}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingRss ? 'animate-spin' : ''}`} />
              <span>{fetchingRss ? 'Syncing Feeds...' : 'Sync RSS Feeds'}</span>
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-yellow hover:bg-amber-400 text-navy-900 font-bold text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add News Link</span>
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
              { id: 'published', label: 'Published' },
              { id: 'pending_review', label: 'Pending Review', badge: news.filter(n => n.status === 'pending_review').length },
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

        {/* News Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Newspaper className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No news articles found</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-200 transition-all"
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  
                  {/* Left: Article Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-900">
                        {item.category}
                      </span>

                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.published_date).toLocaleDateString()}
                      </span>

                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-purple-900">
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
                    </div>

                    <h3 className="text-base font-bold text-navy-900 leading-snug">
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-900 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{item.headline_en}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </h3>
                    <h4 className="text-sm font-semibold text-purple-950 font-hindi">
                      {item.headline_hi}
                    </h4>

                    {/* Direct Link Banner */}
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-950 bg-purple-50/70 px-3 py-1.5 rounded-xl border border-purple-100 max-w-2xl">
                      <Link2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span className="truncate">{item.source_url}</span>
                    </div>

                    {/* Excerpts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                      {item.summary_hi && (
                        <div className="p-3 bg-purple-50/30 rounded-xl border border-purple-100/60 font-hindi">
                          <span className="block font-bold text-purple-900 mb-1">
                            हिन्दी विवरण:
                          </span>
                          <p className="line-clamp-2">{item.summary_hi}</p>
                        </div>
                      )}

                      {item.summary_en && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="block font-bold text-slate-700 mb-1">
                            English Excerpt:
                          </span>
                          <p className="line-clamp-2">{item.summary_en}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row lg:flex-col gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                    
                    {/* Direct Test Link */}
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-colors border border-purple-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Direct Link</span>
                    </a>

                    {/* Approve / Publish */}
                    {item.status !== 'published' ? (
                      <button
                        onClick={() => handleApprove(item)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(item)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                      >
                        Unpublish
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(item)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-purple-200 text-purple-900 hover:bg-purple-50 text-xs font-bold"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {/* Edit / Create Form Modal */}
      {(editingItem || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingItem ? 'Edit News Article Link' : 'Add Direct News Article Link'}
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
                    placeholder="e.g. High Court Mandates Transparent Answer Key Objections"
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
                    placeholder="उदा. उत्तर कुंजी आपत्तियों के पारदर्शी निस्तारण पर उच्च न्यायालय का आदेश"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">News Source Name *</label>
                  <input
                    type="text"
                    required
                    value={form.source}
                    onChange={e => setForm({ ...form, source: e.target.value })}
                    placeholder="e.g. Dainik Bhaskar, Times of India, Rajasthan Patrika, PIB"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Legal & Judiciary">Legal & Judiciary</option>
                    <option value="Policy & Governance">Policy & Governance</option>
                    <option value="Recruitment Exams">Recruitment Exams</option>
                    <option value="Institutional Reforms">Institutional Reforms</option>
                    <option value="Youth Advocacy">Youth Advocacy</option>
                    <option value="Press & Media">Press & Media</option>
                  </select>
                </div>
              </div>

              {/* Direct News URL with Test Button */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Direct News URL * (Original Article Link)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={form.source_url}
                    onChange={e => setForm({ ...form, source_url: e.target.value })}
                    placeholder="https://www.bhaskar.com/rajasthan/news/... or https://timesofindia.indiatimes.com/..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 font-mono"
                  />
                  {form.source_url && (
                    <a
                      href={form.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 flex items-center gap-1 font-bold shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Link</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    English Excerpt / News Summary
                  </label>
                  <textarea
                    rows={3}
                    value={form.summary_en}
                    onChange={e => setForm({ ...form, summary_en: e.target.value })}
                    placeholder="Brief news excerpt from the original report..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-hindi">
                    हिन्दी विवरण / संक्षिप्त अंश
                  </label>
                  <textarea
                    rows={3}
                    value={form.summary_hi}
                    onChange={e => setForm({ ...form, summary_hi: e.target.value })}
                    placeholder="समाचार का संक्षिप्त मुख्य विवरण..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 font-hindi leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Importance Level</label>
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
                  Save News Link
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

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
  Link2,
  Star,
  Image as ImageIcon,
  Filter
} from 'lucide-react';

export default function AdminNewsPage() {
  const { showToast } = useToast();
  const [news, setNews] = useState<NewsBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingRss, setFetchingRss] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Edit / Create Modal state
  const [editingItem, setEditingItem] = useState<NewsBrief | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  // Form State
  const [form, setForm] = useState({
    headline_en: '',
    headline_hi: '',
    source: '',
    source_url: '',
    category: 'Rajasthan News',
    importance: 'medium' as ImportanceLevel,
    summary_en: '',
    summary_hi: '',
    featured_image: '',
    is_featured: false,
    published_date: new Date().toISOString().split('T')[0],
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
      showToast('Error approving news', 'error');
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
        showToast('Article status moved to draft', 'info');
        fetchNews();
      }
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  const handleToggleFeatured = async (item: NewsBrief) => {
    try {
      const updated = !item.is_featured;
      const res = await fetch('/api/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          is_featured: updated
        })
      });
      if (res.ok) {
        showToast(updated ? 'Featured on Homepage!' : 'Removed from Featured', 'success');
        fetchNews();
      }
    } catch (e) {
      showToast('Error updating featured status', 'error');
    }
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
          showToast('News article updated successfully!', 'success');
          setEditingItem(null);
          fetchNews();
        } else {
          showToast('Failed to update news article', 'error');
        }
      } else {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            published_date: form.published_date || new Date().toISOString()
          })
        });
        if (res.ok) {
          showToast('News article published successfully!', 'success');
          setIsCreating(false);
          fetchNews();
        } else {
          showToast('Failed to create news article', 'error');
        }
      }
    } catch (e) {
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this news article?')) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('News article deleted', 'info');
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
      category: item.category || 'Rajasthan News',
      importance: item.importance || 'medium',
      summary_en: item.summary_en || '',
      summary_hi: item.summary_hi || '',
      featured_image: item.featured_image || '',
      is_featured: item.is_featured ?? false,
      published_date: item.published_date ? item.published_date.split('T')[0] : new Date().toISOString().split('T')[0],
      private_notes: item.private_notes || '',
      status: item.status || 'published'
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
      category: 'Rajasthan News',
      importance: 'medium',
      summary_en: '',
      summary_hi: '',
      featured_image: '',
      is_featured: false,
      published_date: new Date().toISOString().split('T')[0],
      private_notes: '',
      status: 'published'
    });
  };

  const filteredNews = news.filter(n => {
    const matchesSearch = !search.trim() || (
      n.headline_en?.toLowerCase().includes(search.toLowerCase()) ||
      n.headline_hi?.toLowerCase().includes(search.toLowerCase()) ||
      n.source?.toLowerCase().includes(search.toLowerCase()) ||
      n.category?.toLowerCase().includes(search.toLowerCase())
    );

    const matchesCategory = categoryFilter === 'all' || n.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Manage News & Press Links"
        subtitle="Publish, curate, and direct-link verified news and recruitment reports across Rajasthan"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchRssFeeds}
              disabled={fetchingRss}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
              title="Sync latest RSS feeds from verified media houses"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingRss ? 'animate-spin' : ''}`} />
              <span>{fetchingRss ? 'Syncing...' : 'Sync RSS Feeds'}</span>
            </button>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-accent-yellow" />
              <span>Create News Article</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status tabs */}
            {['all', 'published', 'pending_review', 'draft'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-purple-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-700"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search news..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-700"
              />
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex justify-center items-center text-slate-400">
              <div className="w-8 h-8 border-3 border-purple-800 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-navy-900">No news articles found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No news articles match your filter. You can create a news article or sync live RSS feeds.
              </p>
              <button
                onClick={openCreate}
                className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-800 transition-colors cursor-pointer"
              >
                Create News Article
              </button>
            </div>
          ) : (
            filteredNews.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  
                  {/* Left: Article Details */}
                  <div className="flex-1 space-y-2">
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

                      {/* Status badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status === 'published' ? 'Published' : 'Draft / Pending'}
                      </span>

                      {/* Featured Star */}
                      {item.is_featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-yellow text-navy-900 flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Homepage Featured</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-navy-900 hover:text-purple-900 transition-colors">
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <span>{item.headline_en}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </h3>

                    {item.headline_hi && (
                      <h4 className="text-sm font-semibold text-purple-950 font-hindi">
                        {item.headline_hi}
                      </h4>
                    )}

                    {/* Direct Link Banner */}
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-950 bg-purple-50/70 px-3 py-1.5 rounded-xl border border-purple-100 max-w-2xl">
                      <Link2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span className="truncate">{item.source_url}</span>
                    </div>

                    {/* Excerpts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs text-slate-600">
                      {item.summary_hi && (
                        <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100/60 font-hindi">
                          <span className="block font-bold text-purple-900 mb-0.5 text-[11px]">
                            हिन्दी विवरण:
                          </span>
                          <p className="line-clamp-2">{item.summary_hi}</p>
                        </div>
                      )}

                      {item.summary_en && (
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="block font-bold text-slate-700 mb-0.5 text-[11px]">
                            English Excerpt:
                          </span>
                          <p className="line-clamp-2">{item.summary_en}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row lg:flex-col gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                    
                    {/* Featured toggle */}
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        item.is_featured
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'border border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                      title={item.is_featured ? 'Remove from Homepage' : 'Feature on Homepage'}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.is_featured ? 'fill-current text-amber-600' : ''}`} />
                      <span>{item.is_featured ? 'Featured' : 'Feature'}</span>
                    </button>

                    {/* Direct Test Link */}
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-colors border border-purple-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Direct Link</span>
                    </a>

                    {/* Approve / Publish */}
                    {item.status !== 'published' ? (
                      <button
                        onClick={() => handleApprove(item)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Publish</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(item)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                      >
                        Unpublish
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(item)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-purple-200 text-purple-900 hover:bg-purple-50 text-xs font-bold cursor-pointer"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingItem ? 'Edit News Article Link' : 'Create / Add News Article'}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="text-white/70 hover:text-white cursor-pointer"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">News Source *</label>
                  <input
                    type="text"
                    required
                    value={form.source}
                    onChange={e => setForm({ ...form, source: e.target.value })}
                    placeholder="e.g. Dainik Bhaskar, Times of India, Rajasthan Patrika"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publication Date</label>
                  <input
                    type="date"
                    value={form.published_date}
                    onChange={e => setForm({ ...form, published_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Direct News URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Source Article URL * (Verified Link)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={form.source_url}
                    onChange={e => setForm({ ...form, source_url: e.target.value })}
                    placeholder="https://www.bhaskar.com/... or https://timesofindia.indiatimes.com/..."
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

              {/* Featured Image */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Featured Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.featured_image}
                  onChange={e => setForm({ ...form, featured_image: e.target.value })}
                  placeholder="https://images.unsplash.com/... or article image URL"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    English Summary / Article Content
                  </label>
                  <textarea
                    rows={4}
                    value={form.summary_en}
                    onChange={e => setForm({ ...form, summary_en: e.target.value })}
                    placeholder="Summary or content of the news article in English..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-hindi">
                    हिन्दी सारांश / समाचार विवरण
                  </label>
                  <textarea
                    rows={4}
                    value={form.summary_hi}
                    onChange={e => setForm({ ...form, summary_hi: e.target.value })}
                    placeholder="समाचार का विवरण हिन्दी में..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 font-hindi leading-relaxed"
                  />
                </div>
              </div>

              {/* Featured & Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600 border-slate-300"
                  />
                  <div>
                    <span className="font-bold text-navy-900 block">Feature on Homepage</span>
                    <span className="text-[10px] text-slate-500">Highlight this news item on the public homepage feed</span>
                  </div>
                </label>

                <div>
                  <label className="block font-bold text-navy-900 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="draft">Draft (Private)</option>
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold cursor-pointer"
                >
                  Save News Article
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { YouTubeVideo } from '@/types';
import { 
  Youtube, 
  Plus, 
  FileEdit, 
  Trash2, 
  ExternalLink, 
  Play, 
  Clock, 
  Eye, 
  Search, 
  Check, 
  X,
  AlertCircle,
  Star,
  Globe,
  Radio,
  Filter
} from 'lucide-react';

function extractYouTubeId(input: string): string {
  if (!input) return '';
  const clean = input.trim();
  if (clean.length === 11 && !clean.includes('/') && !clean.includes('?')) {
    return clean;
  }
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : clean;
}

export default function AdminVideosPage() {
  const { showToast } = useToast();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'hi' | 'en'>('hi');

  const [form, setForm] = useState({
    video_id: '',
    title_en: '',
    title_hi: '',
    description_en: '',
    description_hi: '',
    category: 'Speeches',
    duration: '15:00',
    views_count: 50000,
    thumbnail_url: '',
    is_featured: false,
    is_published: true
  });

  const categories = [
    'Speeches',
    'Investigations',
    'Documentary',
    'Policy Explained',
    'Press Conference',
    'Student Townhalls'
  ];

  const fetchVideos = () => {
    setLoading(true);
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVideos(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingVideo(null);
    setForm({
      video_id: '',
      title_en: '',
      title_hi: '',
      description_en: '',
      description_hi: '',
      category: 'Speeches',
      duration: '15:00',
      views_count: 5000,
      thumbnail_url: '',
      is_featured: false,
      is_published: true
    });
  };

  const openEdit = (v: YouTubeVideo) => {
    setEditingVideo(v);
    setIsCreating(false);
    setForm({
      video_id: v.video_id,
      title_en: v.title_en,
      title_hi: v.title_hi,
      description_en: v.description_en,
      description_hi: v.description_hi,
      category: v.category || 'Speeches',
      duration: v.duration || '15:00',
      views_count: v.views_count || 5000,
      thumbnail_url: v.thumbnail_url || '',
      is_featured: v.is_featured ?? false,
      is_published: v.is_published ?? true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = extractYouTubeId(form.video_id);
    if (!cleanId) {
      showToast('Please enter a valid YouTube Video ID or URL', 'error');
      return;
    }

    const autoThumb = form.thumbnail_url || `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;

    try {
      if (editingVideo) {
        const res = await fetch('/api/videos', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingVideo.id,
            ...form,
            thumbnail_url: autoThumb,
            video_id: cleanId
          })
        });
        if (res.ok) {
          showToast('Video details updated successfully!', 'success');
          setEditingVideo(null);
          fetchVideos();
        }
      } else {
        const res = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            thumbnail_url: autoThumb,
            video_id: cleanId
          })
        });
        if (res.ok) {
          showToast('New video added and published!', 'success');
          setIsCreating(false);
          fetchVideos();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving video', 'error');
    }
  };

  const handleToggleFeatured = async (v: YouTubeVideo) => {
    try {
      const updatedFeatured = !v.is_featured;
      const res = await fetch('/api/videos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: v.id,
          is_featured: updatedFeatured
        })
      });
      if (res.ok) {
        showToast(updatedFeatured ? 'Featured on Homepage!' : 'Removed from Featured', 'success');
        fetchVideos();
      }
    } catch (e: any) {
      showToast('Error updating featured status', 'error');
    }
  };

  const handleTogglePublished = async (v: YouTubeVideo) => {
    try {
      const updatedPublished = v.is_published === false ? true : false;
      const res = await fetch('/api/videos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: v.id,
          is_published: updatedPublished
        })
      });
      if (res.ok) {
        showToast(updatedPublished ? 'Video published to Media page' : 'Video unpublished (Draft)', 'info');
        fetchVideos();
      }
    } catch (e: any) {
      showToast('Error updating publish status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this video from the website?')) return;
    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Video removed successfully', 'info');
        fetchVideos();
      }
    } catch (e: any) {
      showToast('Error deleting video', 'error');
    }
  };

  const filteredVideos = videos.filter(v => {
    const matchesSearch = !search.trim() || (
      v.title_en?.toLowerCase().includes(search.toLowerCase()) ||
      v.title_hi?.toLowerCase().includes(search.toLowerCase()) ||
      v.category?.toLowerCase().includes(search.toLowerCase()) ||
      v.video_id?.toLowerCase().includes(search.toLowerCase())
    );

    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const currentPreviewId = extractYouTubeId(form.video_id);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Manage YouTube Videos"
        subtitle="Add, feature, and embed speeches, briefings, and townhall videos"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-yellow" />
            <span>Add YouTube Video</span>
          </button>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Search, Filter & Stats Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Videos: <strong className="text-navy-900">{videos.length}</strong>
            </span>
            <span>•</span>
            <span className="text-xs font-bold text-purple-900">
              Featured: {videos.filter(v => v.is_featured).length}
            </span>
            <span>•</span>
            <span className="text-xs font-bold text-emerald-700">
              Published: {videos.filter(v => v.is_published !== false).length}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-700"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, ID or topic..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-700"
              />
            </div>
          </div>
        </div>

        {/* Video Cards Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Youtube className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No videos found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No YouTube videos matched your search or category filter. Try clearing filters or add a new video.
            </p>
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-800 transition-colors"
            >
              Add Video Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(v => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden group">
                    <img
                      src={v.thumbnail_url || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`}
                      alt={v.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Featured Star Badge */}
                    {v.is_featured && (
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-accent-yellow text-navy-900 text-[10px] font-black flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Homepage Featured</span>
                      </div>
                    )}

                    {/* Published Status Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                      v.is_published !== false 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-700 text-slate-200'
                    }`}>
                      {v.is_published !== false ? 'Published' : 'Draft / Unlisted'}
                    </div>

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-purple-950/85 text-white text-[10px] font-bold">
                      {v.category}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                      {v.duration}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>YouTube ID: <code className="text-purple-900 font-mono font-bold">{v.video_id}</code></span>
                      <span>{v.views_count?.toLocaleString() || 5000} views</span>
                    </div>

                    <h3 className="text-sm font-bold text-navy-900 line-clamp-1">
                      {v.title_en}
                    </h3>
                    <h4 className="text-xs font-semibold text-purple-950 font-hindi line-clamp-1">
                      {v.title_hi}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {v.description_en || v.description_hi}
                    </p>
                  </div>
                </div>

                {/* Quick Toggle Controls & Actions */}
                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(v)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                        v.is_featured
                          ? 'border-amber-300 bg-amber-50 text-amber-700'
                          : 'border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                      }`}
                      title={v.is_featured ? 'Remove from Homepage' : 'Feature on Homepage'}
                    >
                      <Star className={`w-3.5 h-3.5 ${v.is_featured ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePublished(v)}
                      className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-colors ${
                        v.is_published !== false
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                      title="Toggle Public / Draft status"
                    >
                      {v.is_published !== false ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://www.youtube.com/watch?v=${v.video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 font-bold"
                      title="Verify on YouTube"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => openEdit(v)}
                      className="p-1.5 rounded-lg border border-slate-200 text-purple-900 hover:bg-purple-50 font-bold cursor-pointer"
                      title="Edit Video"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingVideo) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-purple-200 max-h-[92vh] overflow-y-auto space-y-5 text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-600 fill-current" />
                <h3 className="text-base font-bold text-navy-900">
                  {editingVideo ? 'Edit YouTube Video' : 'Add New YouTube Video'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingVideo(null);
                  setIsCreating(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* YouTube Link or ID */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  YouTube Video URL, Shorts URL, or Video ID *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://www.youtube.com/watch?v=satyendra or shorts or ID"
                    value={form.video_id}
                    onChange={e => setForm({ ...form, video_id: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-purple-700"
                  />
                  {currentPreviewId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${currentPreviewId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-1 shrink-0 hover:bg-rose-100 transition-colors"
                      title="Test video link on YouTube"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Link</span>
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Extracted YouTube ID: <strong className="text-purple-900 font-mono">{currentPreviewId || 'None'}</strong>
                </p>
              </div>

              {/* Live Preview Embed */}
              {currentPreviewId && currentPreviewId.length === 11 && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video relative">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${currentPreviewId}`}
                    title="Preview"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              )}

              {/* Language Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 w-fit">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('hi')}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    activeLangTab === 'hi'
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    activeLangTab === 'en'
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Hindi Tab */}
              {activeLangTab === 'hi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      वीडियो शीर्षक (Hindi Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_hi}
                      onChange={e => setForm({ ...form, title_hi: e.target.value })}
                      placeholder="उदा. जयपुर महापंचायत में सत्येंद्र राव का संबोधन"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      वीडियो विवरण (Hindi Description)
                    </label>
                    <textarea
                      rows={3}
                      value={form.description_hi}
                      onChange={e => setForm({ ...form, description_hi: e.target.value })}
                      placeholder="वक्तव्य का संक्षिप्त सारांश..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                    />
                  </div>
                </div>
              )}

              {/* English Tab */}
              {activeLangTab === 'en' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Video Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_en}
                      onChange={e => setForm({ ...form, title_en: e.target.value })}
                      placeholder="e.g. Satyendra Rao Addresses Jaipur Maha-Panchayat"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Video Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={form.description_en}
                      onChange={e => setForm({ ...form, description_en: e.target.value })}
                      placeholder="Brief overview of the speech or briefing..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (e.g. 18:45)</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Views</label>
                  <input
                    type="number"
                    value={form.views_count}
                    onChange={e => setForm({ ...form, views_count: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Featured & Publish Toggles */}
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
                    <span className="text-[10px] text-slate-500">Show this video in the homepage featured media reel</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={e => setForm({ ...form, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600 border-slate-300"
                  />
                  <div>
                    <span className="font-bold text-navy-900 block">Published Status</span>
                    <span className="text-[10px] text-slate-500">Visible to public website visitors on /media</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Leave empty to use automatic high-res YouTube thumbnail"
                  value={form.thumbnail_url}
                  onChange={e => setForm({ ...form, thumbnail_url: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideo(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Save Video
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

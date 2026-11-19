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
  AlertCircle
} from 'lucide-react';

function extractYouTubeId(input: string): string {
  if (!input) return '';
  const clean = input.trim();
  if (clean.length === 11 && !clean.includes('/') && !clean.includes('?')) {
    return clean;
  }
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : clean;
}

export default function AdminVideosPage() {
  const { showToast } = useToast();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
    thumbnail_url: ''
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
      views_count: 50000,
      thumbnail_url: ''
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
      category: v.category,
      duration: v.duration,
      views_count: v.views_count,
      thumbnail_url: v.thumbnail_url
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = extractYouTubeId(form.video_id);
    if (!cleanId) {
      showToast('Please enter a valid YouTube Video ID or URL', 'error');
      return;
    }

    try {
      if (editingVideo) {
        const res = await fetch('/api/videos', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingVideo.id,
            ...form,
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
            video_id: cleanId
          })
        });
        if (res.ok) {
          showToast('New video added to website!', 'success');
          setIsCreating(false);
          fetchVideos();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving video', 'error');
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
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      v.title_en.toLowerCase().includes(q) ||
      v.title_hi.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.video_id.toLowerCase().includes(q)
    );
  });

  const currentPreviewId = extractYouTubeId(form.video_id);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="YouTube Videos & Media Archive"
        subtitle="Manage and update YouTube videos, speeches, and video metadata across the website"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Video</span>
          </button>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Search & Stats Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Active Videos: <strong className="text-navy-900">{videos.length}</strong>
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search videos by title or category..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-700"
            />
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(v => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={v.thumbnail_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                    alt={v.title_en}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-900/90 text-white text-[10px] font-bold">
                    {v.category}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                    {v.duration}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>ID: <code className="text-purple-900 font-mono font-bold">{v.video_id}</code></span>
                    <span>{v.views_count.toLocaleString()} views</span>
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

              {/* Actions */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`https://www.youtube.com/watch?v=${v.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <Youtube className="w-3.5 h-3.5 fill-current" />
                  <span>Verify on YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(v)}
                    className="p-1.5 rounded-lg border border-slate-200 text-purple-900 hover:bg-purple-50 font-bold"
                    title="Edit Video"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* CREATE / EDIT MODAL */}
      {(isCreating || editingVideo) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/75 backdrop-blur-sm animate-fade-in">
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
                  YouTube Video URL or Video ID *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://www.youtube.com/watch?v=jNQXAC9IVRw or jNQXAC9IVRw"
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Leave empty to use automatic high-res Unsplash/YouTube thumbnail"
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
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

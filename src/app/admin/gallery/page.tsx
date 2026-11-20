'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { 
  Image as ImageIcon, 
  Plus, 
  FileEdit, 
  Trash2, 
  ExternalLink, 
  Star, 
  Calendar,
  X
} from 'lucide-react';

interface GalleryPhoto {
  id: string;
  title_en: string;
  title_hi: string;
  image_url: string;
  category: string;
  date: string;
  caption_en?: string;
  caption_hi?: string;
  is_featured: boolean;
}

export default function AdminGalleryPage() {
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    title_en: '',
    title_hi: '',
    image_url: '',
    category: 'Rallies',
    date: new Date().toISOString().split('T')[0],
    caption_en: '',
    caption_hi: '',
    is_featured: true
  });

  const categories = [
    'Rallies',
    'Padyatra',
    'Conclave',
    'Press Conference',
    'Student Dialogues',
    'Legal Filings'
  ];

  const fetchPhotos = () => {
    setLoading(true);
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPhotos(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingPhoto(null);
    setForm({
      title_en: '',
      title_hi: '',
      image_url: '/images/satyendra_about_bw.jpg',
      category: 'Rallies',
      date: new Date().toISOString().split('T')[0],
      caption_en: '',
      caption_hi: '',
      is_featured: true
    });
  };

  const openEdit = (p: GalleryPhoto) => {
    setEditingPhoto(p);
    setIsCreating(false);
    setForm({
      title_en: p.title_en,
      title_hi: p.title_hi,
      image_url: p.image_url,
      category: p.category,
      date: p.date,
      caption_en: p.caption_en || '',
      caption_hi: p.caption_hi || '',
      is_featured: p.is_featured
    });
  };

  const handleToggleFeatured = async (p: GalleryPhoto) => {
    try {
      const updated = !p.is_featured;
      const res = await fetch('/api/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, is_featured: updated })
      });
      if (res.ok) {
        showToast(updated ? 'Featured on Media Gallery!' : 'Removed from Featured', 'success');
        fetchPhotos();
      }
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from the media gallery?')) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Photo deleted successfully', 'info');
        fetchPhotos();
      }
    } catch (e) {
      showToast('Error deleting photo', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPhoto) {
        const res = await fetch('/api/gallery', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPhoto.id, ...form })
        });
        if (res.ok) {
          showToast('Photo details updated!', 'success');
          setEditingPhoto(null);
          fetchPhotos();
        }
      } else {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('New photo added to Media Gallery!', 'success');
          setIsCreating(false);
          fetchPhotos();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving photo', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Media Gallery Management"
        subtitle="Upload and feature photographs from movement rallies, padyatras, and student conclaves"
        actions={
          <div className="flex items-center gap-2">
            <a
              href="/media"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview /media</span>
            </a>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-accent-yellow" />
              <span>Add Photograph</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No photos in gallery</h3>
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs"
            >
              Add First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map(p => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden group">
                    <img
                      src={p.image_url}
                      alt={p.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-950/80 text-white text-[10px] font-bold">
                      {p.category}
                    </div>
                    {p.is_featured && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent-yellow text-navy-900 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <h3 className="text-sm font-bold text-navy-900 line-clamp-1">
                      {p.title_en}
                    </h3>
                    <h4 className="text-xs font-semibold text-purple-950 font-hindi line-clamp-1">
                      {p.title_hi}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {p.caption_en || p.caption_hi}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      p.is_featured
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${p.is_featured ? 'fill-current text-amber-600' : ''}`} />
                    <span>{p.is_featured ? 'Featured' : 'Feature'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold transition-colors cursor-pointer"
                      title="Edit photo"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                      title="Delete photo"
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
      {(isCreating || editingPhoto) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingPhoto ? 'Edit Photo Details' : 'Add Gallery Photograph'}
              </h3>
              <button
                onClick={() => {
                  setEditingPhoto(null);
                  setIsCreating(false);
                }}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Image URL or Path *
                </label>
                <input
                  type="text"
                  required
                  value={form.image_url}
                  onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder="/images/satyendra_about_bw.jpg or https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={form.title_en}
                  onChange={e => setForm({ ...form, title_en: e.target.value })}
                  placeholder="e.g. Ajmer to Jaipur Padyatra Rally"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-hindi">शीर्षक (हिन्दी) *</label>
                <input
                  type="text"
                  required
                  value={form.title_hi}
                  onChange={e => setForm({ ...form, title_hi: e.target.value })}
                  placeholder="उदा. अजमेर से जयपुर 135 किमी पदयात्रा"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-hindi"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caption / Description (English)</label>
                <textarea
                  rows={2}
                  value={form.caption_en}
                  onChange={e => setForm({ ...form, caption_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-hindi">विवरण (हिन्दी)</label>
                <textarea
                  rows={2}
                  value={form.caption_hi}
                  onChange={e => setForm({ ...form, caption_hi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-hindi"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPhoto(null);
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
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

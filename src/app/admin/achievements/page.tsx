'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { 
  Award, 
  Plus, 
  FileEdit, 
  Trash2, 
  Star, 
  Calendar, 
  XCircle, 
  TrendingUp, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface Achievement {
  id: string;
  year: string;
  title_en: string;
  title_hi: string;
  impact_metric_en: string;
  impact_metric_hi: string;
  description_en: string;
  description_hi: string;
  category: string;
  is_featured?: boolean;
}

export default function AdminAchievementsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'hi' | 'en'>('hi');

  const [form, setForm] = useState({
    year: '2026',
    title_en: '',
    title_hi: '',
    impact_metric_en: '',
    impact_metric_hi: '',
    description_en: '',
    description_hi: '',
    category: 'Milestone',
    is_featured: true
  });

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/achievements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setForm({
      year: new Date().getFullYear().toString(),
      title_en: '',
      title_hi: '',
      impact_metric_en: '',
      impact_metric_hi: '',
      description_en: '',
      description_hi: '',
      category: 'Policy Landmark',
      is_featured: true
    });
  };

  const openEdit = (item: Achievement) => {
    setEditingItem(item);
    setIsCreating(false);
    setForm({
      year: item.year,
      title_en: item.title_en,
      title_hi: item.title_hi,
      impact_metric_en: item.impact_metric_en || '',
      impact_metric_hi: item.impact_metric_hi || '',
      description_en: item.description_en || '',
      description_hi: item.description_hi || '',
      category: item.category || 'Milestone',
      is_featured: item.is_featured ?? true
    });
  };

  const handleToggleFeatured = async (item: Achievement) => {
    try {
      const updated = !item.is_featured;
      const res = await fetch('/api/achievements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_featured: updated })
      });
      if (res.ok) {
        showToast(updated ? 'Featured on /about page!' : 'Removed from featured', 'success');
        fetchItems();
      }
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement milestone?')) return;
    try {
      const res = await fetch(`/api/achievements?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Achievement milestone removed', 'info');
        fetchItems();
      }
    } catch (e) {
      showToast('Error deleting milestone', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch('/api/achievements', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...form })
        });
        if (res.ok) {
          showToast('Achievement updated successfully!', 'success');
          setEditingItem(null);
          fetchItems();
        }
      } else {
        const res = await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('New achievement added to movement timeline!', 'success');
          setIsCreating(false);
          fetchItems();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving achievement', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Achievements & Movement Milestones"
        subtitle="Manage key legal victories, youth padyatras, and reform milestones displayed on the /about page"
        actions={
          <div className="flex items-center gap-2">
            <a
              href="/about#milestones"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Milestones</span>
            </a>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-accent-yellow" />
              <span>Add Achievement</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No achievements recorded</h3>
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs"
            >
              Add First Milestone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-purple-100 text-purple-950 font-mono">
                      {item.year}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-navy-900 leading-snug">
                      {item.title_en}
                    </h3>
                    <h4 className="text-sm font-semibold text-purple-950 font-hindi mt-0.5">
                      {item.title_hi}
                    </h4>
                  </div>

                  {item.impact_metric_en && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{item.impact_metric_en}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.description_en || item.description_hi}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      item.is_featured
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.is_featured ? 'fill-current text-amber-600' : ''}`} />
                    <span>{item.is_featured ? 'Featured' : 'Not Featured'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold transition-colors cursor-pointer"
                      title="Edit Milestone"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                      title="Delete Milestone"
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
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingItem ? 'Edit Achievement Milestone' : 'Add New Movement Achievement'}
                </h3>
                <p className="text-xs text-purple-200">Bilingual Milestone Details</p>
              </div>

              <div className="inline-flex items-center bg-purple-900 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('hi')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeLangTab === 'hi' ? 'bg-accent-yellow text-navy-900' : 'text-white'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeLangTab === 'en' ? 'bg-accent-yellow text-navy-900' : 'text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Year / Timeline (e.g. 2023 or 2024 - 2025) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-purple-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Legal Win, Padyatra, Conclave, Policy Landmark"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* HINDI TAB */}
              {activeLangTab === 'hi' && (
                <div className="space-y-4 font-hindi">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      उपलब्धि का शीर्षक (हिन्दी) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_hi}
                      onChange={e => setForm({ ...form, title_hi: e.target.value })}
                      placeholder="उदा. अजमेर से जयपुर 135 किमी विशाल पदयात्रा"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      प्रभाव आंकड़ा (Hindi Impact Metric)
                    </label>
                    <input
                      type="text"
                      value={form.impact_metric_hi}
                      onChange={e => setForm({ ...form, impact_metric_hi: e.target.value })}
                      placeholder="उदा. 10,000+ प्रतियोगी छात्र सम्मिलित"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      विस्तृत विवरण (हिन्दी)
                    </label>
                    <textarea
                      rows={4}
                      value={form.description_hi}
                      onChange={e => setForm({ ...form, description_hi: e.target.value })}
                      placeholder="आंदोलन की विस्तृत जानकारी..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* ENGLISH TAB */}
              {activeLangTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Achievement Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_en}
                      onChange={e => setForm({ ...form, title_en: e.target.value })}
                      placeholder="e.g. 135 km Historic Foot March (Ajmer to Jaipur)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Impact Metric (English)
                    </label>
                    <input
                      type="text"
                      value={form.impact_metric_en}
                      onChange={e => setForm({ ...form, impact_metric_en: e.target.value })}
                      placeholder="e.g. 10,000+ Aspirants Mobilized"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Detailed Description (English)
                    </label>
                    <textarea
                      rows={4}
                      value={form.description_en}
                      onChange={e => setForm({ ...form, description_en: e.target.value })}
                      placeholder="Comprehensive overview of the milestone..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

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
                  className="px-6 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { Blog } from '@/types';
import { FileText, Plus, FileEdit, Calendar, Eye, Clock, XCircle } from 'lucide-react';

export default function AdminBlogsPage() {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'hi' | 'en'>('hi');

  const [form, setForm] = useState({
    slug: '',
    title_en: '',
    title_hi: '',
    excerpt_en: '',
    excerpt_hi: '',
    content_en: '',
    content_hi: '',
    author: 'Satyendra Rao',
    reading_time_minutes: 5,
    tags: ['Youth Reform'],
    status: 'published' as 'published' | 'draft',
    meta_description_en: '',
    meta_description_hi: ''
  });

  const fetchBlogs = () => {
    setLoading(true);
    fetch('/api/blogs?status=all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingBlog(null);
    setForm({
      slug: `policy-article-${Date.now().toString(36)}`,
      title_en: '',
      title_hi: '',
      excerpt_en: '',
      excerpt_hi: '',
      content_en: '',
      content_hi: '',
      author: 'Satyendra Rao',
      reading_time_minutes: 5,
      tags: ['Recruitment Policy', 'Youth Rights'],
      status: 'published',
      meta_description_en: '',
      meta_description_hi: ''
    });
  };

  const openEdit = (b: Blog) => {
    setEditingBlog(b);
    setIsCreating(false);
    setForm({
      slug: b.slug,
      title_en: b.title_en,
      title_hi: b.title_hi,
      excerpt_en: b.excerpt_en,
      excerpt_hi: b.excerpt_hi,
      content_en: b.content_en,
      content_hi: b.content_hi,
      author: b.author,
      reading_time_minutes: b.reading_time_minutes,
      tags: b.tags || [],
      status: b.status,
      meta_description_en: b.meta_description_en || '',
      meta_description_hi: b.meta_description_hi || ''
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        const res = await fetch('/api/blogs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingBlog.id,
            ...form
          })
        });
        if (res.ok) {
          showToast('Article updated in both languages', 'success');
          setEditingBlog(null);
          fetchBlogs();
        }
      } else {
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            published_date: new Date().toISOString()
          })
        });
        if (res.ok) {
          showToast('New article created', 'success');
          setIsCreating(false);
          fetchBlogs();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving article', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Blogs & Policy Papers"
        subtitle="Author, review and maintain separate Hindi & English policy essays"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(b => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-purple-900">{b.author}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {b.views_count.toLocaleString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-900 leading-snug">
                  {b.title_en}
                </h3>
                <h4 className="text-sm font-semibold text-purple-950 font-hindi">
                  {b.title_hi}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-3">
                  {b.excerpt_en}
                </p>
              </div>

              <button
                onClick={() => openEdit(b)}
                className="w-full py-2.5 rounded-xl border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit Bilingual Article</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Editor Modal with Separate Hindi & English Content Fields */}
      {(editingBlog || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col">
            
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingBlog ? 'Edit Policy Article' : 'Compose Policy Article'}
                </h3>
                <p className="text-xs text-purple-200">Separate Hindi & English Review Tabs</p>
              </div>

              <div className="inline-flex items-center bg-purple-900 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('hi')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeLangTab === 'hi' ? 'bg-accent-yellow text-navy-900' : 'text-white'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeLangTab === 'en' ? 'bg-accent-yellow text-navy-900' : 'text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* HINDI TAB */}
              {activeLangTab === 'hi' && (
                <div className="space-y-4 font-hindi">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      लेख का हिन्दी शीर्षक (Hindi Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_hi}
                      onChange={e => setForm({ ...form, title_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      संक्षिप्त विवरण (Hindi Excerpt) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.excerpt_hi}
                      onChange={e => setForm({ ...form, excerpt_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      संपूर्ण लेख सामग्री (Hindi Full Content) *
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={form.content_hi}
                      onChange={e => setForm({ ...form, content_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 leading-relaxed font-hindi"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      एसईओ विवरण (Hindi SEO Description)
                    </label>
                    <input
                      type="text"
                      value={form.meta_description_hi}
                      onChange={e => setForm({ ...form, meta_description_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* ENGLISH TAB */}
              {activeLangTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Article Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_en}
                      onChange={e => setForm({ ...form, title_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Excerpt (English) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.excerpt_en}
                      onChange={e => setForm({ ...form, excerpt_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Content (English) *
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={form.content_en}
                      onChange={e => setForm({ ...form, content_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      SEO Meta Description (English)
                    </label>
                    <input
                      type="text"
                      value={form.meta_description_en}
                      onChange={e => setForm({ ...form, meta_description_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reading Time (Minutes)</label>
                  <input
                    type="number"
                    value={form.reading_time_minutes}
                    onChange={e => setForm({ ...form, reading_time_minutes: parseInt(e.target.value) || 4 })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlog(null);
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
                  Save Article
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

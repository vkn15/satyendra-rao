'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { Blog } from '@/types';
import { 
  FileText, 
  Plus, 
  FileEdit, 
  Calendar, 
  Eye, 
  Clock, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Quote, 
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function AdminBlogsPage() {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'hi' | 'en'>('hi');

  const contentHiRef = useRef<HTMLTextAreaElement>(null);
  const contentEnRef = useRef<HTMLTextAreaElement>(null);

  const blogCategories = [
    'Youth Employment Reforms',
    'Recruitment Transparency & Exams',
    'Constitutional Rights & Public Policy',
    'Education & Skill Development',
    'Rural Governance & Accountability'
  ];

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
    tagsString: 'Youth Reform, Transparency',
    cover_image: '',
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

  const generateSlug = () => {
    const base = form.title_en || form.title_hi || 'youth-policy';
    const slugified = base
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setForm(prev => ({ ...prev, slug: slugified || `article-${Date.now().toString(36)}` }));
  };

  const insertMarkdown = (syntaxType: string) => {
    const isHindi = activeLangTab === 'hi';
    const textarea = isHindi ? contentHiRef.current : contentEnRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = isHindi ? form.content_hi : form.content_en;
    const selectedText = currentVal.substring(start, end);

    let replacement = '';
    switch (syntaxType) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'h2':
        replacement = `\n## ${selectedText || 'Section Heading'}\n`;
        break;
      case 'h3':
        replacement = `\n### ${selectedText || 'Sub-heading'}\n`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'List item 1'}\n- List item 2\n`;
        break;
      case 'list-ordered':
        replacement = `\n1. ${selectedText || 'First point'}\n2. Second point\n`;
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'Important statement or quote'}\n`;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link Title'}](https://)`;
        break;
      case 'image':
        replacement = `\n![${selectedText || 'Image Description'}](https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80)\n`;
        break;
      default:
        replacement = selectedText;
    }

    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    if (isHindi) {
      setForm(prev => ({ ...prev, content_hi: newVal }));
    } else {
      setForm(prev => ({ ...prev, content_en: newVal }));
    }
  };

  const openCreate = () => {
    setIsCreating(true);
    setEditingBlog(null);
    setForm({
      slug: `youth-reform-${Date.now().toString(36)}`,
      title_en: '',
      title_hi: '',
      excerpt_en: '',
      excerpt_hi: '',
      content_en: '',
      content_hi: '',
      author: 'Satyendra Rao',
      reading_time_minutes: 5,
      tagsString: 'Recruitment Policy, Youth Rights, Transparency',
      cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
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
      author: b.author || 'Satyendra Rao',
      reading_time_minutes: b.reading_time_minutes || 5,
      tagsString: Array.isArray(b.tags) ? b.tags.join(', ') : 'Youth Reform',
      cover_image: b.cover_image || '',
      status: b.status || 'published',
      meta_description_en: b.meta_description_en || '',
      meta_description_hi: b.meta_description_hi || ''
    });
  };

  const handleTogglePublished = async (b: Blog) => {
    const updatedStatus = b.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch('/api/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: b.id, status: updatedStatus })
      });
      if (res.ok) {
        showToast(updatedStatus === 'published' ? 'Article published to live blog!' : 'Article set to Draft', 'info');
        fetchBlogs();
      }
    } catch (e) {
      showToast('Error updating blog status', 'error');
    }
  };

  const handleDelete = async (b: Blog) => {
    if (!confirm(`Are you sure you want to permanently delete "${b.title_en}"?`)) return;
    try {
      const res = await fetch(`/api/blogs?id=${b.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Blog article deleted successfully', 'info');
        fetchBlogs();
      } else {
        showToast('Failed to delete blog article', 'error');
      }
    } catch (e) {
      showToast('Error deleting blog article', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug.trim()) {
      showToast('Slug is required for the blog article URL', 'error');
      return;
    }

    const tagsArray = form.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      if (editingBlog) {
        const res = await fetch('/api/blogs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingBlog.id,
            slug: form.slug.trim(),
            title_en: form.title_en,
            title_hi: form.title_hi,
            excerpt_en: form.excerpt_en,
            excerpt_hi: form.excerpt_hi,
            content_en: form.content_en,
            content_hi: form.content_hi,
            author: form.author,
            reading_time_minutes: form.reading_time_minutes,
            tags: tagsArray,
            cover_image: form.cover_image,
            status: form.status,
            meta_description_en: form.meta_description_en,
            meta_description_hi: form.meta_description_hi
          })
        });
        if (res.ok) {
          showToast('Article updated in both Hindi & English', 'success');
          setEditingBlog(null);
          fetchBlogs();
        }
      } else {
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: form.slug.trim(),
            title_en: form.title_en,
            title_hi: form.title_hi,
            excerpt_en: form.excerpt_en,
            excerpt_hi: form.excerpt_hi,
            content_en: form.content_en,
            content_hi: form.content_hi,
            author: form.author,
            published_date: new Date().toISOString(),
            reading_time_minutes: form.reading_time_minutes,
            tags: tagsArray,
            cover_image: form.cover_image,
            status: form.status,
            meta_description_en: form.meta_description_en,
            meta_description_hi: form.meta_description_hi
          })
        });
        if (res.ok) {
          showToast('New article published to website!', 'success');
          setIsCreating(false);
          fetchBlogs();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving article', 'error');
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = !search.trim() || (
      b.title_en?.toLowerCase().includes(search.toLowerCase()) ||
      b.title_hi?.toLowerCase().includes(search.toLowerCase()) ||
      b.slug?.toLowerCase().includes(search.toLowerCase())
    );

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Manage Blogs & Policy Essays"
        subtitle="Write, format with rich text, and publish bilingual Hindi & English articles"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-yellow" />
            <span>Write New Blog</span>
          </button>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {(['all', 'published', 'draft'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-purple-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search blogs by title or slug..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-700"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No blog articles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start drafting your first policy essay, movement update, or recruitment reform brief.
            </p>
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-800 transition-colors cursor-pointer"
            >
              Write First Blog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map(b => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Cover image if available */}
                  {b.cover_image && (
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img
                        src={b.cover_image}
                        alt={b.title_en}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'
                      }`}>
                        {b.status === 'published' ? 'Published' : 'Draft'}
                      </div>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    {!b.cover_image && (
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-purple-900">{b.author}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {b.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        /{b.slug}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-navy-900 leading-snug line-clamp-2">
                      {b.title_en}
                    </h3>
                    <h4 className="text-xs font-semibold text-purple-950 font-hindi line-clamp-2">
                      {b.title_hi}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3">
                      {b.excerpt_en || b.excerpt_hi}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{b.reading_time_minutes || 5} min read</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{b.views_count?.toLocaleString() || 0} views</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublished(b)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        b.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {b.status === 'published' ? 'Published' : 'Draft'}
                    </button>

                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-purple-900 hover:bg-white transition-colors"
                      title="View live blog post"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(b)}
                      className="p-1.5 rounded-lg border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold transition-colors cursor-pointer"
                      title="Edit article"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                      title="Delete article"
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

      {/* Editor Modal with Rich Text Formatting Toolbar */}
      {(editingBlog || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingBlog ? 'Edit Blog Article' : 'Compose Blog Article'}
                </h3>
                <p className="text-xs text-purple-200">Bilingual Hindi & English Rich Text Editor</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center bg-purple-900 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('hi')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeLangTab === 'hi' ? 'bg-accent-yellow text-navy-900' : 'text-white'
                    }`}
                  >
                    हिन्दी (Hindi)
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

                <button
                  onClick={() => {
                    setEditingBlog(null);
                    setIsCreating(false);
                  }}
                  className="text-white/70 hover:text-white cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Slugs and General settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">SEO URL Slug * (/blog/[slug])</label>
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
                    >
                      Generate from Title
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^\w-]/g, '') })}
                    placeholder="e.g. youth-employment-reforms"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-purple-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  >
                    <option value="published">Published (Live on /blog)</option>
                    <option value="draft">Draft (Private)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Featured Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={form.cover_image}
                    onChange={e => setForm({ ...form, cover_image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.tagsString}
                    onChange={e => setForm({ ...form, tagsString: e.target.value })}
                    placeholder="Youth, Education, Employment, RPSC"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Rich text helper toolbar */}
              <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-xl flex flex-wrap items-center gap-1">
                <span className="text-[11px] font-bold text-purple-900 mr-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent-yellow" />
                  Formatting Tools:
                </span>
                <button
                  type="button"
                  onClick={() => insertMarkdown('bold')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('italic')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('h2')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Heading 2"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('h3')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Heading 3"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('list')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('list-ordered')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Numbered List"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('quote')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Blockquote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('link')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Insert Link"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('image')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-slate-700 hover:text-purple-900 hover:bg-purple-100 font-bold"
                  title="Insert Image"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
              </div>

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
                      placeholder="उदा. राजस्थान भर्ती परीक्षाओं में सुधार की आवश्यकता"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      संक्षिप्त विवरण (Hindi Excerpt / Summary) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.excerpt_hi}
                      onChange={e => setForm({ ...form, excerpt_hi: e.target.value })}
                      placeholder="लेख का मुख्य सारांश..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      संपूर्ण लेख सामग्री (Hindi Full Content with Markdown) *
                    </label>
                    <textarea
                      ref={contentHiRef}
                      rows={12}
                      required
                      value={form.content_hi}
                      onChange={e => setForm({ ...form, content_hi: e.target.value })}
                      placeholder="## मुख्य बिंदु&#10;&#10;यहाँ विस्तृत लेख लिखें..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-purple-700 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Hindi SEO Meta Description
                    </label>
                    <input
                      type="text"
                      value={form.meta_description_hi}
                      onChange={e => setForm({ ...form, meta_description_hi: e.target.value })}
                      placeholder="गूगल सर्च के लिए संक्षिप्त विवरण (160 अक्षरों के भीतर)"
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
                      placeholder="e.g. Urgent Need for Transparent Examination Calendars"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Summary Excerpt (English) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.excerpt_en}
                      onChange={e => setForm({ ...form, excerpt_en: e.target.value })}
                      placeholder="Brief excerpt highlighting the core problem and policy remedy..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Content (English Markdown) *
                    </label>
                    <textarea
                      ref={contentEnRef}
                      rows={12}
                      required
                      value={form.content_en}
                      onChange={e => setForm({ ...form, content_en: e.target.value })}
                      placeholder="## Introduction&#10;&#10;Write full article content here with Markdown formatting..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-purple-700 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      English SEO Meta Description
                    </label>
                    <input
                      type="text"
                      value={form.meta_description_en}
                      onChange={e => setForm({ ...form, meta_description_en: e.target.value })}
                      placeholder="Search engine snippet under 160 characters"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Author & Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Reading Time (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.reading_time_minutes}
                    onChange={e => setForm({ ...form, reading_time_minutes: parseInt(e.target.value) || 5 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlog(null);
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
                  Save Blog Article
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

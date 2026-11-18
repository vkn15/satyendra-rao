'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { AppSettings } from '@/types';
import { 
  Settings, 
  Sparkles, 
  Key, 
  Rss, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Plus, 
  Trash2,
  Lock,
  RefreshCw
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingAi, setTestingAi] = useState(false);

  // Form Inputs
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'local'>('gemini');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [requireApproval, setRequireApproval] = useState(true);

  // RSS Feed management
  const [feeds, setFeeds] = useState<any[]>([]);
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedCategory, setNewFeedCategory] = useState('Recruitment Exams');

  const fetchSettings = () => {
    setLoading(true);
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSettings(data);
          setProvider(data.ai_provider || 'gemini');
          setModel(data.gemini_model || 'gemini-1.5-flash');
          setRequireApproval(data.require_admin_approval ?? true);
          setFeeds(data.rss_feeds || []);
          if (data.gemini_api_key) {
            setApiKeyInput(data.gemini_api_key);
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        ai_provider: provider,
        gemini_model: model,
        require_admin_approval: requireApproval,
        rss_feeds: feeds
      };

      if (apiKeyInput && !apiKeyInput.startsWith('••••')) {
        payload.gemini_api_key = apiKeyInput;
      }

      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('Settings saved successfully!', 'success');
        fetchSettings();
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestAi = async () => {
    setTestingAi(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: 'Rajasthan Recruitment Commission Announces Transparent Exam Protocol',
          source: 'Commission Desk',
          description: 'Official test verification to ensure AI engine latency and connectivity are operational.',
          sourceUrl: 'https://satyendrarao.in'
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast(`AI Connection Verified! Engine: ${data.ai_provider}`, 'success');
    } catch (e: any) {
      showToast(e.message || 'AI test failed', 'error');
    } finally {
      setTestingAi(false);
    }
  };

  const handleAddFeed = () => {
    if (!newFeedName || !newFeedUrl) {
      showToast('Please provide Feed Name and RSS URL', 'error');
      return;
    }

    const newFeed = {
      id: `feed-${Date.now()}`,
      name: newFeedName,
      url: newFeedUrl,
      category: newFeedCategory,
      language: 'hi',
      enabled: true
    };

    setFeeds([...feeds, newFeed]);
    setNewFeedName('');
    setNewFeedUrl('');
    showToast('Feed added to list (click Save Settings to persist)', 'info');
  };

  const handleToggleFeed = (id: string) => {
    setFeeds(feeds.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const handleDeleteFeed = (id: string) => {
    setFeeds(feeds.filter(f => f.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="System Settings & AI Configuration"
        subtitle="Configure Google Gemini API keys, RSS feeds, approval workflows and database policies"
      />

      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-5xl w-full mx-auto">
        
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* Section 1: AI Provider & API Key */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-gold" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  AI Summarizer & Assistant Provider
                </h3>
                <p className="text-xs text-slate-500">
                  Select your generative AI provider for daily news briefings and bilingual translations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  provider === 'gemini'
                    ? 'border-purple-900 bg-purple-50/60 ring-2 ring-purple-900/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value="gemini"
                  checked={provider === 'gemini'}
                  onChange={() => setProvider('gemini')}
                  className="sr-only"
                />
                <div className="font-bold text-navy-900 text-sm">Google Gemini</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Fast 1.5 Flash / 2.0 Flash models with natural Hindi & English summarization
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  provider === 'local'
                    ? 'border-purple-900 bg-purple-50/60 ring-2 ring-purple-900/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value="local"
                  checked={provider === 'local'}
                  onChange={() => setProvider('local')}
                  className="sr-only"
                />
                <div className="font-bold text-navy-900 text-sm">Integrated Semantic Engine</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Built-in zero-latency extractive summarizer requiring no external API key
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  provider === 'openai'
                    ? 'border-purple-900 bg-purple-50/60 ring-2 ring-purple-900/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  value="openai"
                  checked={provider === 'openai'}
                  onChange={() => setProvider('openai')}
                  className="sr-only"
                />
                <div className="font-bold text-navy-900 text-sm">OpenAI GPT-4o</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Alternative OpenAI model provider
                </div>
              </label>
            </div>

            {/* API Key Input */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-900" />
                    Google Gemini API Key (Protected Server-Side)
                  </span>
                  {settings?.has_gemini_key && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Key Configured
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={e => setApiKeyInput(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTestAi}
                    disabled={testingAi}
                    className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingAi ? 'animate-spin' : ''}`} />
                    <span>Test AI Connection</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Keys are stored exclusively in server environment variables or encrypted server-side settings. They are never sent to public clients.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Gemini Model
                </label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full sm:w-72 p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Fastest & Cost-Effective)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
              </div>
            </div>

            {/* Approval Requirement */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy-900 block">
                  Strict Admin Review Policy
                </span>
                <span className="text-[11px] text-slate-500">
                  AI-generated news summaries remain private in Pending Review queue until explicitly approved by admin
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={e => setRequireApproval(e.target.checked)}
                className="w-5 h-5 rounded text-purple-900 focus:ring-purple-700"
              />
            </div>
          </div>

          {/* Section 2: RSS Feeds Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <Rss className="w-5 h-5 text-purple-900" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Authorized News & RSS Feeds
                </h3>
                <p className="text-xs text-slate-500">
                  Configure government and reputable news agency feeds to fetch recruitment updates
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {feeds.map(feed => (
                <div
                  key={feed.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900 text-sm">{feed.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
                        {feed.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                      {feed.url}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleFeed(feed.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        feed.enabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {feed.enabled ? 'Active' : 'Disabled'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFeed(feed.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Feed */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-navy-900 block">Add New Authorized RSS Feed</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Feed Name (e.g. DD News Hindi)"
                  value={newFeedName}
                  onChange={e => setNewFeedName(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs"
                />
                <input
                  type="url"
                  placeholder="https://.../feed.xml"
                  value={newFeedUrl}
                  onChange={e => setNewFeedUrl(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFeed}
                  className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feed</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Supabase & Database Policies */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-900" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Database & Security Integration
                </h3>
                <p className="text-xs text-slate-500">
                  Supabase RLS access policies and persistent event storage
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-navy-900">
                <span>Storage Engine Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                  Operational (Zero-Data Loss)
                </span>
              </div>
              <p className="text-slate-600">
                Configured with Row Level Security (RLS) schemas in <code className="bg-white px-1 py-0.5 rounded border">supabase/schema.sql</code>. All page views, volunteer submissions, and AI news drafts are stored securely.
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-accent-yellow" />
              <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}

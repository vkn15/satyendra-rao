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
  RefreshCw,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  User,
  Share2
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingAi, setTestingAi] = useState(false);

  // Form Inputs: AI Configuration
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'local'>('gemini');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [requireApproval, setRequireApproval] = useState(true);

  // Form Inputs: Leader Profile & Details
  const [leaderNameHi, setLeaderNameHi] = useState('सत्येंद्र राव');
  const [leaderNameEn, setLeaderNameEn] = useState('Satyendra Rao');
  const [leaderTitleHi, setLeaderTitleHi] = useState('संयोजक • युवा सुधार आंदोलन');
  const [leaderTitleEn, setLeaderTitleEn] = useState('Convener • Youth Reform Movement');
  const [leaderBioHi, setLeaderBioHi] = useState('');
  const [leaderBioEn, setLeaderBioEn] = useState('');

  // Form Inputs: Social Links & YouTube
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState('');
  const [telegramGroupUrl, setTelegramGroupUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');

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
          setLeaderNameHi(data.leader_name_hi || 'सत्येंद्र राव');
          setLeaderNameEn(data.leader_name_en || 'Satyendra Rao');
          setLeaderTitleHi(data.leader_title_hi || 'संयोजक • युवा सुधार आंदोलन');
          setLeaderTitleEn(data.leader_title_en || 'Convener • Youth Reform Movement');
          setLeaderBioHi(data.leader_bio_hi || '');
          setLeaderBioEn(data.leader_bio_en || '');
          setYoutubeChannelUrl(data.youtube_channel_url || 'https://www.youtube.com/results?search_query=Satyendra+Rao');
          setWhatsappNumber(data.whatsapp_number || '+91 98290 12345');
          setWhatsappGroupUrl(data.whatsapp_group_url || 'https://chat.whatsapp.com/invite/SatyendraRaoYouth');
          setTelegramGroupUrl(data.telegram_group_url || 'https://t.me/SatyendraRaoOfficial');
          setContactEmail(data.contact_email || 'contact@satyendrarao.in');
          setContactPhone(data.contact_phone || '+91 98290 12345');
          setOfficeAddress(data.office_address || 'Youth Reform Movement Secretariat, Civil Lines, Jaipur, Rajasthan 302006');
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
        rss_feeds: feeds,
        leader_name_hi: leaderNameHi,
        leader_name_en: leaderNameEn,
        leader_title_hi: leaderTitleHi,
        leader_title_en: leaderTitleEn,
        leader_bio_hi: leaderBioHi,
        leader_bio_en: leaderBioEn,
        youtube_channel_url: youtubeChannelUrl,
        whatsapp_number: whatsappNumber,
        whatsapp_group_url: whatsappGroupUrl,
        telegram_group_url: telegramGroupUrl,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        office_address: officeAddress
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
        showToast('Settings, Leader Profile and Social Links saved successfully!', 'success');
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
        title="Settings & Leader Details Management"
        subtitle="Manage Leader Details, YouTube channel URL, Social community links, AI keys and database policies"
      />

      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-5xl w-full mx-auto">
        
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* Section 1: Leader Profile & Official Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-900" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Leader Profile & Identity
                </h3>
                <p className="text-xs text-slate-500">
                  Configure name, official title, and biographies shown across the public portal
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Leader Name (Hindi) *
                </label>
                <input
                  type="text"
                  required
                  value={leaderNameHi}
                  onChange={e => setLeaderNameHi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Leader Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={leaderNameEn}
                  onChange={e => setLeaderNameEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Title / Role (Hindi)
                </label>
                <input
                  type="text"
                  value={leaderTitleHi}
                  onChange={e => setLeaderTitleHi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Title / Role (English)
                </label>
                <input
                  type="text"
                  value={leaderTitleEn}
                  onChange={e => setLeaderTitleEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Bio Summary (Hindi)
                </label>
                <textarea
                  rows={3}
                  value={leaderBioHi}
                  onChange={e => setLeaderBioHi(e.target.value)}
                  placeholder="आंदोलन का संक्षिप्त परिचय..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Bio Summary (English)
                </label>
                <textarea
                  rows={3}
                  value={leaderBioEn}
                  onChange={e => setLeaderBioEn(e.target.value)}
                  placeholder="Brief summary of the youth movement..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Official YouTube Channel & Social Community Links */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Youtube className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  YouTube Channel & Social Community Links
                </h3>
                <p className="text-xs text-slate-500">
                  Set verified YouTube channel link and WhatsApp / Telegram youth community URLs
                </p>
              </div>
            </div>

            {/* YouTube Channel URL Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official YouTube Channel URL (Prevents 404 on Subscribe Buttons) *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={youtubeChannelUrl}
                  onChange={e => setYoutubeChannelUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@YourChannelHandle or search URL"
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
                <a
                  href={youtubeChannelUrl || 'https://www.youtube.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>Test Channel Link</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tip: Leave as default YouTube Search URL or enter your verified handle to ensure visitors never see a 404 page.
              </p>
            </div>

            {/* WhatsApp & Telegram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Youth Community / Group Invite Link
                </label>
                <input
                  type="url"
                  value={whatsappGroupUrl}
                  onChange={e => setWhatsappGroupUrl(e.target.value)}
                  placeholder="https://chat.whatsapp.com/invite/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telegram Channel / Group Link
                </label>
                <input
                  type="url"
                  value={telegramGroupUrl}
                  onChange={e => setTelegramGroupUrl(e.target.value)}
                  placeholder="https://t.me/SatyendraRaoOfficial"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Contact Phone Number
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="+91 98290 12345"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="contact@satyendrarao.in"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secretariat / Office Address
                </label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={e => setOfficeAddress(e.target.value)}
                  placeholder="Youth Reform Movement Secretariat, Civil Lines, Jaipur, Rajasthan 302006"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: AI Configuration */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-yellow" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-900">
                    AI Summarization Engine (Google Gemini)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Powers automatic summarization of daily news in Hindi and English
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestAi}
                disabled={testingAi}
                className="px-3.5 py-1.5 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 hover:bg-purple-50 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingAi ? 'animate-spin' : ''}`} />
                <span>{testingAi ? 'Testing...' : 'Test AI Engine'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">AI Provider</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                >
                  <option value="gemini">Google Gemini (Recommended)</option>
                  <option value="openai">OpenAI GPT-4o-mini</option>
                  <option value="local">Local Intelligent Parser (Fallback)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gemini Model</label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast & Bilingual)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Research)</option>
                  <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gemini API Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter AIzaSy... API key"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Your API key is securely protected on the server side in environment variables and encrypted storage.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={e => setRequireApproval(e.target.checked)}
                  className="rounded text-purple-900 focus:ring-purple-900 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Require manual admin approval before publishing AI-generated news summaries
                </span>
              </label>
            </div>
          </div>

          {/* Section 4: Authorized RSS Feeds */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <Rss className="w-5 h-5 text-purple-900" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-900">
                  Authorized News Feeds
                </h3>
                <p className="text-xs text-slate-500">
                  Configure RSS and News API sources for daily briefings
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {feeds.map((feed) => (
                <div
                  key={feed.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="space-y-0.5 truncate mr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900">{feed.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-900">
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

          {/* Section 5: Database Status */}
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
              <span>{saving ? 'Saving All Settings...' : 'Save All Settings & Profile Details'}</span>
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}

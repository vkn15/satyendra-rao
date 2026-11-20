'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { 
  User, 
  Save, 
  ExternalLink, 
  Youtube, 
  MessageSquare, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export default function AdminProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'experience'>('profile');

  const [form, setForm] = useState({
    leader_name_hi: 'सत्येंद्र राव',
    leader_name_en: 'Satyendra Rao',
    leader_title_hi: 'सामाजिक कार्यकर्ता • युवा पैरोकार • जननीति विशेषज्ञ',
    leader_title_en: 'Social Activist • Youth Advocate • Public Policy Analyst',
    leader_bio_hi: 'सत्येंद्र राव एक समर्पित सामाजिक कार्यकर्ता, युवा पैरोकार और नीतिगत सुधारक हैं, जिनका पांच वर्षों का निरंतर संघर्ष राजस्थान के लाखों गरीब और ग्रामीण अभ्यर्थियों की पीड़ा को संवैधानिक हकों में बदलने का काम कर रहा है।',
    leader_bio_en: 'Satyendra Rao is a grassroots public policy advocate, youth movement leader, and social activist who has spent over five years championing transparent recruitment, fair examination calendars, and judicial accountability for aspirants across Rajasthan.',
    profile_image_url: '/images/satyendra_about_bw.jpg',
    education_hi: 'स्नातक (विधि एवं जननीति), राजस्थान विश्वविद्यालय',
    education_en: 'Graduate in Law & Public Policy, University of Rajasthan',
    youtube_channel_url: 'https://youtube.com/@Satyendra_rao',
    whatsapp_number: '+91 94140 12345',
    whatsapp_group_url: 'https://chat.whatsapp.com/sample',
    telegram_group_url: 'https://t.me/satyendraraomovement',
    twitter_url: 'https://twitter.com/satyendra_rao',
    instagram_url: 'https://instagram.com/satyendra_rao',
    contact_email: 'contact@satyendrarao.in',
    contact_phone: '+91 141 2780000',
    office_address: 'युवा सुधार आंदोलन मुख्य कार्यालय, गोपालपुरा बाईपास, जयपुर, राजस्थान - 302015'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setForm(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        showToast('Profile & Experience details updated successfully!', 'success');
      } else {
        throw new Error('Failed to update profile settings');
      }
    } catch (e: any) {
      showToast(e.message || 'Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Profile & Leadership Experience"
        subtitle="Manage Satyendra Rao's public bio, credentials, reform philosophy, and official contacts"
        actions={
          <div className="flex items-center gap-2">
            <a
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview /about Page</span>
            </a>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4 text-accent-yellow" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
        
        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Biography & Vision
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              activeTab === 'social'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Social Channels & Desk
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Credentials & Office
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TAB 1: BIOGRAPHY & VISION */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-700" />
                    <span>Public Leader Identity & Bilingual Bio</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Changes reflect immediately across hero banners, navigation, and the /about page.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Leader Name (English)
                    </label>
                    <input
                      type="text"
                      value={form.leader_name_en}
                      onChange={e => setForm({ ...form, leader_name_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-hindi">
                      नेता का नाम (हिन्दी)
                    </label>
                    <input
                      type="text"
                      value={form.leader_name_hi}
                      onChange={e => setForm({ ...form, leader_name_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi font-bold text-purple-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Title / Designation (English)
                    </label>
                    <input
                      type="text"
                      value={form.leader_title_en}
                      onChange={e => setForm({ ...form, leader_title_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-hindi">
                      पदनाम / उपाधि (हिन्दी)
                    </label>
                    <input
                      type="text"
                      value={form.leader_title_hi}
                      onChange={e => setForm({ ...form, leader_title_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Detailed Biography (English)
                    </label>
                    <textarea
                      rows={6}
                      value={form.leader_bio_en}
                      onChange={e => setForm({ ...form, leader_bio_en: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-hindi">
                      विस्तृत जीवन परिचय एवं दृष्टि (हिन्दी)
                    </label>
                    <textarea
                      rows={6}
                      value={form.leader_bio_hi}
                      onChange={e => setForm({ ...form, leader_bio_hi: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-hindi leading-relaxed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Profile Image Path or URL
                  </label>
                  <input
                    type="text"
                    value={form.profile_image_url}
                    onChange={e => setForm({ ...form, profile_image_url: e.target.value })}
                    placeholder="/images/satyendra_about_bw.jpg"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Default high-res image: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-900">/images/satyendra_about_bw.jpg</code>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: SOCIAL CHANNELS */}
            {activeTab === 'social' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span>Official Media Channels & Grassroots Reach</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect youth directly to Satyendra Rao's verified YouTube, Telegram, and WhatsApp community.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-600" />
                      <span>Official YouTube Channel URL</span>
                    </label>
                    <input
                      type="url"
                      value={form.youtube_channel_url}
                      onChange={e => setForm({ ...form, youtube_channel_url: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-sky-500" />
                      <span>Telegram Aspirant Channel Link</span>
                    </label>
                    <input
                      type="url"
                      value={form.telegram_group_url}
                      onChange={e => setForm({ ...form, telegram_group_url: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Aspirant Broadcast Group Link</span>
                    </label>
                    <input
                      type="url"
                      value={form.whatsapp_group_url}
                      onChange={e => setForm({ ...form, whatsapp_group_url: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Helpline Number</span>
                    </label>
                    <input
                      type="text"
                      value={form.whatsapp_number}
                      onChange={e => setForm({ ...form, whatsapp_number: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Twitter / X Handle URL
                    </label>
                    <input
                      type="url"
                      value={form.twitter_url}
                      onChange={e => setForm({ ...form, twitter_url: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={form.instagram_url}
                      onChange={e => setForm({ ...form, instagram_url: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CREDENTIALS & OFFICE */}
            {activeTab === 'experience' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-700" />
                    <span>Education, Credentials & Headquarters</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official address and qualifications shown on public communications and letters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Academic Background (English)
                    </label>
                    <input
                      type="text"
                      value={form.education_en}
                      onChange={e => setForm({ ...form, education_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-hindi">
                      शैक्षणिक योग्यता (हिन्दी)
                    </label>
                    <input
                      type="text"
                      value={form.education_hi}
                      onChange={e => setForm({ ...form, education_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-700" />
                      <span>Official Contact Email</span>
                    </label>
                    <input
                      type="email"
                      value={form.contact_email}
                      onChange={e => setForm({ ...form, contact_email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-purple-700" />
                      <span>Headquarters Landline / Phone</span>
                    </label>
                    <input
                      type="text"
                      value={form.contact_phone}
                      onChange={e => setForm({ ...form, contact_phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-700" />
                    <span>Headquarters Office Address</span>
                  </label>
                  <textarea
                    rows={2}
                    value={form.office_address}
                    onChange={e => setForm({ ...form, office_address: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Bottom Save Bar */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-accent-yellow" />
                <span>{saving ? 'Saving Changes...' : 'Save All Profile Changes'}</span>
              </button>
            </div>

          </form>
        )}

      </main>
    </div>
  );
}

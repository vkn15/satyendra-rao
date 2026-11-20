'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { Campaign } from '@/types';
import { Megaphone, FileEdit, CheckCircle2, Plus, Users, Scale, BookOpen } from 'lucide-react';

export default function AdminCampaignsPage() {
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'hi' | 'en'>('hi');

  const [form, setForm] = useState({
    title_en: '',
    title_hi: '',
    tagline_en: '',
    tagline_hi: '',
    description_en: '',
    description_hi: '',
    impact_metric_en: '',
    impact_metric_hi: '',
    demands_en: [''],
    demands_hi: [''],
    participants_count: 0,
    target_participants: 100000,
    status: 'active' as Campaign['status']
  });

  const fetchCampaigns = () => {
    setLoading(true);
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const openEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setForm({
      title_en: c.title_en,
      title_hi: c.title_hi,
      tagline_en: c.tagline_en,
      tagline_hi: c.tagline_hi,
      description_en: c.description_en,
      description_hi: c.description_hi,
      impact_metric_en: c.impact_metric_en,
      impact_metric_hi: c.impact_metric_hi,
      demands_en: c.demands_en || [''],
      demands_hi: c.demands_hi || [''],
      participants_count: c.participants_count,
      target_participants: c.target_participants,
      status: c.status
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    try {
      const res = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCampaign.id,
          ...form
        })
      });

      if (res.ok) {
        showToast('Campaign details updated in both languages!', 'success');
        setEditingCampaign(null);
        fetchCampaigns();
      }
    } catch (e: any) {
      showToast(e.message || 'Error updating campaign', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Campaigns Management"
        subtitle="Maintain bilingual policy campaigns, participant counts and statutory demands"
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 uppercase">
                    {c.status}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {c.participants_count.toLocaleString()} Pledged
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-navy-900 leading-snug">
                    {c.title_en}
                  </h3>
                  <h4 className="text-sm font-semibold text-purple-950 font-hindi">
                    {c.title_hi}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {c.description_en}
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600">
                  <span className="font-bold text-purple-900 block font-hindi">प्रभाव (Impact):</span>
                  <span>{c.impact_metric_hi}</span>
                </div>
              </div>

              <button
                onClick={() => openEdit(c)}
                className="w-full py-2.5 rounded-xl border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit Bilingual Content</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Edit Modal with Separate Hindi & English Content Fields */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col">
            
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Edit Campaign Content</h3>
                <p className="text-xs text-purple-200">Separate Hindi & English Fields for Independent Review</p>
              </div>
              
              {/* Language Switcher Tabs */}
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
                      अभियान का शीर्षक (Hindi Title) *
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
                      टैगलाइन / उपशीर्षक (Hindi Tagline)
                    </label>
                    <input
                      type="text"
                      value={form.tagline_hi}
                      onChange={e => setForm({ ...form, tagline_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      अभियान का विस्तृत विवरण (Hindi Description) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.description_hi}
                      onChange={e => setForm({ ...form, description_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      प्रभाव विवरण (Hindi Impact Metric)
                    </label>
                    <input
                      type="text"
                      value={form.impact_metric_hi}
                      onChange={e => setForm({ ...form, impact_metric_hi: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>
                </div>
              )}

              {/* ENGLISH TAB */}
              {activeLangTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Campaign Title (English) *
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
                      Campaign Tagline (English)
                    </label>
                    <input
                      type="text"
                      value={form.tagline_en}
                      onChange={e => setForm({ ...form, tagline_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Detailed Description (English) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.description_en}
                      onChange={e => setForm({ ...form, description_en: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
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
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>
                </div>
              )}

              {/* Common Metrics */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pledged Participants</label>
                  <input
                    type="number"
                    value={form.participants_count}
                    onChange={e => setForm({ ...form, participants_count: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Mobilization</label>
                  <input
                    type="number"
                    value={form.target_participants}
                    onChange={e => setForm({ ...form, target_participants: parseInt(e.target.value) || 0 })}
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
                    <option value="active">Active</option>
                    <option value="in_progress">In Progress</option>
                    <option value="achieved">Achieved</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold"
                >
                  Save Campaign
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

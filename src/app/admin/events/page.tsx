'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { 
  Calendar, 
  Plus, 
  FileEdit, 
  Trash2, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Users, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MovementEvent {
  id: string;
  title_en: string;
  title_hi: string;
  date: string;
  time: string;
  location: string;
  district: string;
  category: string;
  description_en: string;
  description_hi: string;
  rsvp_url?: string;
  status: 'upcoming' | 'live' | 'completed';
}

export default function AdminEventsPage() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<MovementEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<MovementEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'hi' | 'en'>('hi');

  const [form, setForm] = useState({
    title_en: '',
    title_hi: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    location: '',
    district: 'Jaipur',
    category: 'Student Townhall',
    description_en: '',
    description_hi: '',
    rsvp_url: '',
    status: 'upcoming' as MovementEvent['status']
  });

  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreate = () => {
    setIsCreating(true);
    setEditingEvent(null);
    setForm({
      title_en: '',
      title_hi: '',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      location: 'Jaipur',
      district: 'Jaipur',
      category: 'Youth Conclave',
      description_en: '',
      description_hi: '',
      rsvp_url: '',
      status: 'upcoming'
    });
  };

  const openEdit = (e: MovementEvent) => {
    setEditingEvent(e);
    setIsCreating(false);
    setForm({
      title_en: e.title_en,
      title_hi: e.title_hi,
      date: e.date,
      time: e.time,
      location: e.location,
      district: e.district,
      category: e.category,
      description_en: e.description_en,
      description_hi: e.description_hi,
      rsvp_url: e.rsvp_url || '',
      status: e.status
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Event deleted successfully', 'info');
        fetchEvents();
      }
    } catch (e) {
      showToast('Error deleting event', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const res = await fetch('/api/events', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEvent.id, ...form })
        });
        if (res.ok) {
          showToast('Event updated successfully!', 'success');
          setEditingEvent(null);
          fetchEvents();
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (res.ok) {
          showToast('New event scheduled and published!', 'success');
          setIsCreating(false);
          fetchEvents();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving event', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Movement Events & Rallies"
        subtitle="Schedule upcoming youth townhalls, padyatras, and legal awareness workshops across Rajasthan"
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-yellow" />
            <span>Schedule Event</span>
          </button>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-800 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No events scheduled</h3>
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs"
            >
              Schedule First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-900">
                      {item.category}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      item.status === 'upcoming'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'live'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
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

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-purple-800" />
                      <span>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-purple-800" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-purple-800 shrink-0 mt-0.5" />
                    <span>{item.location} ({item.district})</span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description_en || item.description_hi}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {item.rsvp_url ? (
                    <a
                      href={item.rsvp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-purple-900 hover:text-purple-700 flex items-center gap-1"
                    >
                      <span>RSVP Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <span className="text-[11px] text-slate-400">Open Public Attendance</span>}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold transition-colors cursor-pointer"
                      title="Edit Event"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                      title="Delete Event"
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
      {(isCreating || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-purple-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingEvent ? 'Edit Movement Event' : 'Schedule Movement Event'}
                </h3>
                <p className="text-xs text-purple-200">Bilingual Event Details</p>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:00 AM"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue / Full Address *</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Birla Auditorium, Statue Circle"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">District / City *</label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={e => setForm({ ...form, district: e.target.value })}
                    placeholder="e.g. Jaipur, Sikar, Kota, Jodhpur"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* HINDI TAB */}
              {activeLangTab === 'hi' && (
                <div className="space-y-4 font-hindi">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      कार्यक्रम का नाम (हिन्दी) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_hi}
                      onChange={e => setForm({ ...form, title_hi: e.target.value })}
                      placeholder="उदा. राजस्थान युवा सुधार महासम्मेलन"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      कार्यक्रम का विवरण (हिन्दी)
                    </label>
                    <textarea
                      rows={3}
                      value={form.description_hi}
                      onChange={e => setForm({ ...form, description_hi: e.target.value })}
                      placeholder="कार्यक्रम का उद्देश्य एवं रूपरेखा..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi"
                    />
                  </div>
                </div>
              )}

              {/* ENGLISH TAB */}
              {activeLangTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Event Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title_en}
                      onChange={e => setForm({ ...form, title_en: e.target.value })}
                      placeholder="e.g. Statewide Youth Townhall on Recruitment Integrity"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Event Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={form.description_en}
                      onChange={e => setForm({ ...form, description_en: e.target.value })}
                      placeholder="Description of the event..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  RSVP or Registration URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.rsvp_url}
                  onChange={e => setForm({ ...form, rsvp_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
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
                  Save Event
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

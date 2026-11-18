'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { Volunteer } from '@/types';
import { Users, Search, Filter, Phone, Mail, MapPin, CheckCircle2, Clock, XCircle, FileEdit } from 'lucide-react';

export default function AdminVolunteersPage() {
  const { showToast } = useToast();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [editingVol, setEditingVol] = useState<Volunteer | null>(null);
  const [tempStatus, setTempStatus] = useState<Volunteer['status']>('new');
  const [tempNotes, setTempNotes] = useState('');

  const fetchVolunteers = () => {
    setLoading(true);
    let url = '/api/volunteers';
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (districtFilter !== 'all') params.append('district', districtFilter);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVolunteers(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter, districtFilter]);

  const handleUpdateStatus = async () => {
    if (!editingVol) return;
    try {
      const res = await fetch('/api/volunteers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingVol.id,
          status: tempStatus,
          notes: tempNotes
        })
      });

      if (res.ok) {
        showToast('Volunteer status updated!', 'success');
        setEditingVol(null);
        fetchVolunteers();
      }
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  const filtered = volunteers.filter(v => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        v.full_name.toLowerCase().includes(q) ||
        v.phone.toLowerCase().includes(q) ||
        v.district.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const districts = [
    'Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Sikar', 'Alwar'
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Volunteer Mobilization Network"
        subtitle="Manage youth coordinators, college mobilizers and legal research volunteers"
      />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="all">All Statuses ({volunteers.length})</option>
              <option value="new">New Applications</option>
              <option value="contacted">Contacted</option>
              <option value="active">Active Coordinators</option>
              <option value="on_hold">On Hold</option>
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="all">All Districts</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search volunteer name, phone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-700"
            />
          </div>
        </div>

        {/* Volunteers Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Volunteer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Role & Occupation</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-900 text-sm">{v.full_name}</div>
                      <div className="text-[11px] text-slate-400">
                        Registered: {new Date(v.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Phone className="w-3 h-3 text-purple-700" />
                        <span>{v.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{v.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="w-3 h-3 text-accent-gold" />
                        <span>{v.district}, {v.state}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-purple-900">{v.preferred_role}</div>
                      <div className="text-slate-500 text-[11px]">{v.occupation || 'Student'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : v.status === 'on_hold'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {v.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingVol(v);
                          setTempStatus(v.status);
                          setTempNotes(v.notes || '');
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-purple-900 hover:bg-purple-50 font-bold"
                        title="Update Status / Notes"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Update Volunteer Modal */}
      {editingVol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-purple-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900">
                Update Volunteer: {editingVol.full_name}
              </h3>
              <button onClick={() => setEditingVol(null)} className="text-slate-400 hover:text-slate-700">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status</label>
              <select
                value={tempStatus}
                onChange={e => setTempStatus(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
              >
                <option value="new">New Application</option>
                <option value="contacted">Contacted / Briefed</option>
                <option value="active">Active District Coordinator</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Coordinator Notes</label>
              <textarea
                rows={3}
                value={tempNotes}
                onChange={e => setTempNotes(e.target.value)}
                placeholder="Internal notes on mobilization, assigned colleges, contact history..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingVol(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="px-5 py-2 rounded-xl bg-purple-900 text-white font-bold hover:bg-purple-950"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

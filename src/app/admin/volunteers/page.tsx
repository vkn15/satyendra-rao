'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useToast } from '@/context/ToastContext';
import { Volunteer } from '@/types';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileEdit, 
  Download,
  Calendar,
  Briefcase
} from 'lucide-react';

export default function AdminVolunteersPage() {
  const { showToast } = useToast();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
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

  const handleExportCSV = () => {
    if (volunteers.length === 0) {
      showToast('No volunteer records to export', 'error');
      return;
    }

    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'District', 'State', 'Occupation', 'Preferred Role', 'Status', 'Registered Date', 'Notes'];
    const rows = filtered.map(v => [
      `"${v.id}"`,
      `"${v.full_name.replace(/"/g, '""')}"`,
      `"${v.phone}"`,
      `"${v.email}"`,
      `"${v.district}"`,
      `"${v.state}"`,
      `"${(v.occupation || '').replace(/"/g, '""')}"`,
      `"${(v.preferred_role || '').replace(/"/g, '""')}"`,
      `"${v.status}"`,
      `"${new Date(v.created_at).toISOString().split('T')[0]}"`,
      `"${(v.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `volunteers_satyendra_rao_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Volunteer data exported to CSV successfully!', 'success');
  };

  const filtered = volunteers.filter(v => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      v.full_name?.toLowerCase().includes(q) ||
      v.phone?.toLowerCase().includes(q) ||
      v.district?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q)
    );

    const matchesRole = roleFilter === 'all' || v.preferred_role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const districts = [
    'Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Sikar', 'Alwar', 'Bharatpur', 'Jhunjhunu', 'Nagaur', 'Churu', 'Pali', 'Barmer', 'Bhilwara'
  ];

  const roles = [
    'District Coordinator',
    'College Campus Mobilizer',
    'Legal & RTI Research',
    'Social Media & Digital Campaigner',
    'Event Volunteer',
    'General Volunteer'
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Volunteer Mobilization Network"
        subtitle="Manage grassroots youth coordinators, college mobilizers and legal research volunteers"
        actions={
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            title="Download full volunteer database as CSV"
          >
            <Download className="w-3.5 h-3.5 text-accent-yellow" />
            <span>Export CSV</span>
          </button>
        }
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

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
            >
              <option value="all">All Roles</option>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, district..."
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-purple-800 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No volunteers match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-navy-900 text-sm">{v.full_name}</div>
                        <div className="text-[11px] text-slate-400">
                          Registered: {new Date(v.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium font-mono">
                          <Phone className="w-3 h-3 text-purple-700 shrink-0" />
                          <span>{v.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{v.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="w-3 h-3 text-accent-yellow shrink-0" />
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
                          className="p-1.5 rounded-lg border border-slate-200 text-purple-900 hover:bg-purple-50 font-bold transition-colors cursor-pointer"
                          title="Update Status / Notes"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Update Volunteer Modal */}
      {editingVol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900">
                Update Volunteer: {editingVol.full_name}
              </h3>
              <button onClick={() => setEditingVol(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
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
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="px-5 py-2 rounded-xl bg-purple-900 text-white font-bold hover:bg-purple-950 cursor-pointer"
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

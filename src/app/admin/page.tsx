'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { AnalyticsStats, NewsBrief, Volunteer } from '@/types';
import { 
  Users, 
  Eye, 
  UserCheck, 
  Megaphone, 
  Newspaper, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [pendingNews, setPendingNews] = useState<NewsBrief[]>([]);
  const [recentVolunteers, setRecentVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/stats?range=30d').then(r => r.json()),
      fetch('/api/news?status=pending_review').then(r => r.json()),
      fetch('/api/volunteers').then(r => r.json()),
    ])
      .then(([statsData, newsData, volData]) => {
        if (!statsData.error) setStats(statsData);
        if (Array.isArray(newsData)) setPendingNews(newsData);
        if (Array.isArray(volData)) setRecentVolunteers(volData.slice(0, 5));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Movement Operations Overview"
        subtitle="Live tracking telemetry, pending AI news summaries, and grassroots volunteers"
      />

      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Visitors</span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-navy-900">
              {stats?.totalVisitors.toLocaleString() || '...'}
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real database sessions</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Page Views (30d)</span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-navy-900">
              {stats?.totalPageViews.toLocaleString() || '...'}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Daily avg: ~{stats ? Math.round(stats.totalPageViews / 30) : 0} views
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Volunteers</span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-navy-900">
              {stats?.volunteerRegistrations.toLocaleString() || '...'}
            </div>
            <p className="text-xs text-purple-900 font-bold">
              33 Rajasthan Districts
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Pending AI Reviews</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700">
              {pendingNews.length}
            </div>
            <p className="text-xs text-amber-800 font-semibold">
              Awaiting admin verification
            </p>
          </div>

        </div>

        {/* 2 Column Row: Pending AI News Reviews & Recent Volunteers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Pending AI News Summaries */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Pending AI News Review Queue</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Articles fetched and summarized by AI requiring verification
                </p>
              </div>

              <a
                href="/admin/news"
                className="text-xs font-bold text-purple-900 hover:underline flex items-center gap-1"
              >
                <span>Full Review Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {pendingNews.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                All AI news briefings are reviewed and up to date!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingNews.slice(0, 4).map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-900">{item.source}</span>
                      <span className="text-slate-500">{new Date(item.published_date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xs font-bold text-navy-900 line-clamp-1">
                      {item.headline_en}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 font-hindi">
                      {item.summary_hi}
                    </p>
                    <div className="pt-1 flex items-center justify-end">
                      <a
                        href="/admin/news"
                        className="text-xs font-bold text-purple-900 hover:underline"
                      >
                        Review & Approve →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Volunteers */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-900" />
                  <span>Recent Volunteers</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Latest registrations from website portal
                </p>
              </div>

              <a
                href="/admin/volunteers"
                className="text-xs font-bold text-purple-900 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2.5">
              {recentVolunteers.map(v => (
                <div
                  key={v.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">{v.full_name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {v.district}, {v.state} • {v.phone}
                    </p>
                    <span className="text-[10px] font-semibold text-purple-900">
                      {v.preferred_role}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

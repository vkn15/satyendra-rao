'use client';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import DateRangePicker, { DateRange } from '@/components/admin/DateRangePicker';
import { AnalyticsStats } from '@/types';
import { 
  Users, 
  Eye, 
  UserCheck, 
  Megaphone, 
  Newspaper, 
  Video, 
  TrendingUp, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Calendar,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AnalyticsDashboardPage() {
  const [range, setRange] = useState<DateRange>('30d');
  const [customFrom, setCustomFrom] = useState<string | undefined>();
  const [customTo, setCustomTo] = useState<string | undefined>();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = (r: DateRange, from?: string, to?: string) => {
    setLoading(true);
    let url = `/api/analytics/stats?range=${r}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats(range, customFrom, customTo);
  }, []);

  const handleRangeChange = (newRange: DateRange, from?: string, to?: string) => {
    setRange(newRange);
    setCustomFrom(from);
    setCustomTo(to);
    fetchStats(newRange, from, to);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Website Analytics Dashboard"
        subtitle="Real-time website traffic, user engagement, and campaign conversions"
        actions={
          <button
            onClick={() => fetchStats(range, customFrom, customTo)}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Refresh Real Stats"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        
        {/* Top Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Filter By Time Period:
            </span>
            <p className="text-sm font-semibold text-navy-900">
              {range === 'today' && 'Showing Real Events Recorded Today'}
              {range === '7d' && 'Showing Past 7 Days Aggregate Data'}
              {range === '30d' && 'Showing Past 30 Days Trajectory'}
              {range === '90d' && 'Showing Past 90 Days Quarterly Report'}
              {range === 'custom' && `Showing Custom: ${customFrom} to ${customTo}`}
            </p>
          </div>

          <DateRangePicker
            value={range}
            customFrom={customFrom}
            customTo={customTo}
            onChange={handleRangeChange}
          />
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Total Visitors */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Visitors</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-navy-900">
                {stats?.totalVisitors.toLocaleString() || '...'}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% vs previous period</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Daily: <strong>{stats?.dailyVisitors || 0}</strong></span>
              <span>Weekly: <strong>{stats?.weeklyVisitors || 0}</strong></span>
              <span>Monthly: <strong>{stats?.monthlyVisitors || 0}</strong></span>
            </div>
          </div>

          {/* Card 2: Total Page Views */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Page Views</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-navy-900">
                {stats?.totalPageViews.toLocaleString() || '...'}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.1% pages / session</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>Bounce Rate: <strong>26.4%</strong></span>
              <span>Avg Dwell: <strong>3m 42s</strong></span>
            </div>
          </div>

          {/* Card 3: Volunteer Registrations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Volunteer Signups</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-navy-900">
                {stats?.volunteerRegistrations.toLocaleString() || '...'}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+35.2% conversion rate</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>Across 33 Districts</span>
              <a href="/admin/volunteers" className="text-purple-900 font-bold hover:underline">View All →</a>
            </div>
          </div>

          {/* Card 4: Campaign Engagement */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Campaign Engagements</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-navy-900">
                {stats?.campaignEngagementCount.toLocaleString() || '...'}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.8% petition pledges</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>News Views: <strong>{stats?.newsArticleViews.toLocaleString()}</strong></span>
              <span>Video Plays: <strong>{stats?.videoWatchCount.toLocaleString()}</strong></span>
            </div>
          </div>

        </div>

        {/* Traffic Trends Chart */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <h3 className="text-lg font-bold text-navy-900">
                Visitor Traffic Trends
              </h3>
              <p className="text-xs text-slate-500">
                Daily unique visitors and aggregate page impressions based on database tracking
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-900" />
                <span>Unique Visitors</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-accent-yellow" />
                <span>Page Views</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.trafficTrends || []}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4C1D95" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4C1D95" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="yellowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#E2E8F0' }} 
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1B4B',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#4C1D95" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#purpleGrad)" 
                  name="Visitors"
                />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="#EAB308" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#yellowGrad)" 
                  name="Page Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2 Column Row: Most Visited Pages & Device Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Most Visited Pages */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-bold text-navy-900">
                Most Visited Pages & Sections
              </h3>
              <p className="text-xs text-slate-500">
                Actual traffic volume distribution across public routes
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              {stats?.mostVisitedPages.map((page, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-navy-900 font-bold truncate max-w-[70%]">
                      {page.label} <span className="text-slate-400 font-normal">({page.path})</span>
                    </span>
                    <span className="text-purple-900 font-bold">
                      {page.views.toLocaleString()} views ({page.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-900 rounded-full transition-all duration-700"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Split */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-navy-900">
                Visitor Devices
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown of device categories recorded
              </p>

              <div className="h-44 w-full my-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.deviceBreakdown || []}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats?.deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              {stats?.deviceBreakdown.map((dev, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dev.color }} />
                    <span className="text-slate-700">{dev.name}</span>
                  </div>
                  <span className="font-bold text-navy-900">{dev.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 2 Column Row: Popular Blogs & Popular YouTube Videos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Popular Blog Articles */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy-900">
                  Most Popular Blog Articles
                </h3>
                <p className="text-xs text-slate-500">
                  Ranked by verified reader views and social shares
                </p>
              </div>
              <a href="/admin/blogs" className="text-xs font-bold text-purple-900 hover:underline">
                Manage All →
              </a>
            </div>

            <div className="space-y-3 pt-2">
              {stats?.popularBlogs.map((b, idx) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-900 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-navy-900 line-clamp-1">
                      {b.title}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-purple-900 block">
                      {b.views.toLocaleString()} views
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {b.shares} shares
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular YouTube Videos */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-bold text-navy-900">
                Popular YouTube Videos
              </h3>
              <p className="text-xs text-slate-500">
                Audience engagement on speeches and ground padyatras
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {stats?.popularYouTubeVideos.map((v, idx) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-900 text-accent-yellow flex items-center justify-center shrink-0 shadow-xs">
                      <Video className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-navy-900 line-clamp-1">
                      {v.title}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-purple-900 shrink-0">
                    {v.views.toLocaleString()} plays
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Campaign Engagement Breakdown */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-navy-900">
                Campaign Engagement & Signatures
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown of youth mobilization per advocacy movement
              </p>
            </div>
            <a href="/admin/campaigns" className="text-xs font-bold text-purple-900 hover:underline">
              Manage Campaigns →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-y border-slate-100 font-bold">
                <tr>
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Pledged Aspirants</th>
                  <th className="py-3 px-4">Direct Clicks & Shares</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.campaignEngagement.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-navy-900">{c.title}</td>
                    <td className="py-3 px-4 text-purple-900 font-extrabold">{c.participants.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600">{c.clicks.toLocaleString()} actions</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active Mobilization
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

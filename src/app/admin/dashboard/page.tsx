'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Users, 
  Eye, 
  UserCheck, 
  Megaphone, 
  Newspaper, 
  Youtube,
  FileText,
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  PlusCircle,
  ExternalLink,
  User,
  Calendar,
  Radio,
  RefreshCw
} from 'lucide-react';
import { AnalyticsStats, Blog, NewsBrief, Volunteer, YouTubeVideo, Campaign } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [news, setNews] = useState<NewsBrief[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, blogsRes, videosRes, newsRes, campRes, volRes] = await Promise.all([
        fetch('/api/analytics/stats?range=30d').then(r => r.json()).catch(() => null),
        fetch('/api/blogs').then(r => r.json()).catch(() => []),
        fetch('/api/videos').then(r => r.json()).catch(() => []),
        fetch('/api/news').then(r => r.json()).catch(() => []),
        fetch('/api/campaigns').then(r => r.json()).catch(() => []),
        fetch('/api/volunteers').then(r => r.json()).catch(() => []),
      ]);

      if (statsRes && !statsRes.error) setStats(statsRes);
      if (Array.isArray(blogsRes)) setBlogs(blogsRes);
      if (Array.isArray(videosRes)) setVideos(videosRes);
      if (Array.isArray(newsRes)) setNews(newsRes);
      if (Array.isArray(campRes)) setCampaigns(campRes);
      if (Array.isArray(volRes)) setVolunteers(volRes);
    } catch (e) {
      console.error('Error fetching dashboard overview data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const publishedBlogsCount = blogs.filter(b => b.status === 'published').length;
  const publishedNewsCount = news.filter(n => n.status === 'published' || !n.status).length;
  const publishedVideosCount = videos.filter(v => v.is_published !== false).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <AdminHeader
        title="Dashboard Overview"
        subtitle={`Welcome back, Satyendra Rao • ${todayFormatted}`}
        actions={
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
        }
      />

      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        
        {/* Welcome Banner & Quick Actions */}
        <div className="bg-linear-to-r from-purple-950 via-purple-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent-yellow/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent-yellow text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सत्येंद्र राव • युवा सुधार आंदोलन</span>
            </div>

            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome back, Satyendra Rao
              </h2>
              <p className="text-purple-200 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                Today is <strong className="text-white">{todayFormatted}</strong>. Manage and publish your movement’s blogs, verified news, YouTube videos, active campaigns, and grassroots volunteer engagement across Rajasthan.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-2.5">
                Quick Action Shortcuts
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/admin/videos?action=new"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent-yellow text-navy-900 hover:bg-yellow-400 font-bold text-xs shadow-sm hover:shadow transition-all"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-600" />
                  <span>Add YouTube Video</span>
                </Link>

                <Link
                  href="/admin/blogs?action=new"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-200" />
                  <span>Write Blog</span>
                </Link>

                <Link
                  href="/admin/news?action=new"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs transition-all"
                >
                  <Newspaper className="w-3.5 h-3.5 text-purple-200" />
                  <span>Publish News</span>
                </Link>

                <Link
                  href="/admin/campaigns?action=new"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs transition-all"
                >
                  <Megaphone className="w-3.5 h-3.5 text-purple-200" />
                  <span>Add Campaign</span>
                </Link>

                <Link
                  href="/admin/profile"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs transition-all"
                >
                  <User className="w-3.5 h-3.5 text-purple-200" />
                  <span>Update Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Real KPI Cards */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-black text-navy-900 uppercase tracking-wider">
              Real Database Metrics
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Synchronized with verified local & Supabase storage
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Blogs */}
            <Link
              href="/admin/blogs"
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Published Blogs
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-navy-900">
                {loading ? '...' : publishedBlogsCount}
              </div>
              <p className="text-[11px] text-purple-700 font-semibold mt-1">
                Bilingual Articles →
              </p>
            </Link>

            {/* YouTube Videos */}
            <Link
              href="/admin/videos"
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  YouTube Videos
                </span>
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Youtube className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-navy-900">
                {loading ? '...' : publishedVideosCount}
              </div>
              <p className="text-[11px] text-red-600 font-semibold mt-1">
                Embedded & Synced →
              </p>
            </Link>

            {/* News Articles */}
            <Link
              href="/admin/news"
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  News Coverage
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Newspaper className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-navy-900">
                {loading ? '...' : publishedNewsCount}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                Live Press Links →
              </p>
            </Link>

            {/* Active Campaigns */}
            <Link
              href="/admin/campaigns"
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Movement Campaigns
                </span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Megaphone className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-navy-900">
                {loading ? '...' : campaigns.length}
              </div>
              <p className="text-[11px] text-purple-800 font-semibold mt-1">
                Active Movements →
              </p>
            </Link>

            {/* Volunteers */}
            <Link
              href="/admin/volunteers"
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Volunteers
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-navy-900">
                {loading ? '...' : volunteers.length}
              </div>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">
                Grassroots Youth →
              </p>
            </Link>

          </div>
        </div>

        {/* 2-Column Split: Latest News Briefing & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Latest News Briefing (2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-700" />
                  <span>Latest News Briefing & Media Updates</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Verified press coverage and Rajasthan recruitment reforms
                </p>
              </div>

              <Link
                href="/admin/daily-news"
                className="text-xs font-bold text-purple-900 hover:text-purple-700 flex items-center gap-1"
              >
                <span>AI Briefing Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center text-slate-400">
                <div className="w-6 h-6 border-2 border-purple-800 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : news.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No news articles available. Click "Publish News" to add one.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {news.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                          {item.source}
                        </span>
                        <span>•</span>
                        <span>{new Date(item.published_date || item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>•</span>
                        <span className="text-slate-600 font-medium">{item.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-navy-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                        {item.headline_en}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.summary_en || item.summary_hi}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-purple-300 text-slate-600 hover:text-purple-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <Link
                        href={`/admin/news`}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-900 hover:bg-purple-100 text-xs font-bold transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Website Activity & Volunteers (1 Column) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Recent Volunteers</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Latest grassroots registrations
                  </p>
                </div>
                <Link
                  href="/admin/volunteers"
                  className="text-xs font-bold text-purple-900 hover:text-purple-700"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center items-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-purple-800 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : volunteers.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No volunteer registrations recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 mt-2">
                  {volunteers.slice(0, 5).map((vol) => (
                    <div key={vol.id} className="py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {vol.full_name ? vol.full_name.charAt(0).toUpperCase() : 'V'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-navy-900 leading-tight">
                            {vol.full_name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {vol.district || 'Rajasthan'} • {vol.phone}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {new Date(vol.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Link to Analytics */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/admin/analytics"
                className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Full Analytics Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

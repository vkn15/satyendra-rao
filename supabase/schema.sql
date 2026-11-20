-- ============================================================
-- SATYENDRA RAO YOUTH REFORM MOVEMENT
-- Supabase Database Schema & Access Policies
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PAGE VIEWS TABLE (Real Website Analytics)
create table if not exists public.page_views (
  id uuid primary key default uuid_generate_v4(),
  path text not null,
  title text,
  visitor_id text not null,
  session_id text not null,
  referrer text,
  user_agent text,
  device_type text check (device_type in ('mobile', 'desktop', 'tablet')),
  language text default 'hi',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_page_views_created_at on public.page_views(created_at);
create index if not exists idx_page_views_path on public.page_views(path);
create index if not exists idx_page_views_visitor on public.page_views(visitor_id);

-- 2. ANALYTICS EVENTS TABLE
create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,
  path text not null,
  visitor_id text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_analytics_events_type on public.analytics_events(event_type);
create index if not exists idx_analytics_events_created_at on public.analytics_events(created_at);

-- 3. NEWS BRIEFS TABLE (AI-Powered Daily News)
create table if not exists public.news_briefs (
  id uuid primary key default uuid_generate_v4(),
  headline_en text not null,
  headline_hi text not null,
  source text not null,
  source_url text not null,
  published_date timestamp with time zone default timezone('utc'::text, now()),
  category text default 'General',
  importance text default 'medium' check (importance in ('critical', 'high', 'medium', 'general')),
  summary_en text not null,
  summary_hi text not null,
  key_points_en jsonb default '[]'::jsonb,
  key_points_hi jsonb default '[]'::jsonb,
  status text default 'pending_review' check (status in ('draft', 'pending_review', 'approved', 'published')),
  private_notes text,
  views_count integer default 0,
  ai_generated boolean default true,
  ai_provider text,
  approved_at timestamp with time zone,
  approved_by text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_news_status on public.news_briefs(status);
create index if not exists idx_news_published on public.news_briefs(published_date);

-- 4. CAMPAIGNS TABLE (Bilingual)
create table if not exists public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title_en text not null,
  title_hi text not null,
  tagline_en text,
  tagline_hi text,
  description_en text not null,
  description_hi text not null,
  demands_en jsonb default '[]'::jsonb,
  demands_hi jsonb default '[]'::jsonb,
  status text default 'active' check (status in ('active', 'in_progress', 'achieved')),
  participants_count integer default 0,
  target_participants integer default 100000,
  impact_metric_en text,
  impact_metric_hi text,
  icon text default 'scale',
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BLOGS TABLE (Bilingual)
create table if not exists public.blogs (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title_en text not null,
  title_hi text not null,
  excerpt_en text not null,
  excerpt_hi text not null,
  content_en text not null,
  content_hi text not null,
  author text default 'Satyendra Rao',
  published_date timestamp with time zone default timezone('utc'::text, now()),
  reading_time_minutes integer default 4,
  views_count integer default 0,
  tags jsonb default '[]'::jsonb,
  cover_image text,
  meta_description_en text,
  meta_description_hi text,
  status text default 'published' check (status in ('published', 'draft')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. VOLUNTEERS TABLE
create table if not exists public.volunteers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text not null,
  state text not null default 'Rajasthan',
  district text not null,
  occupation text,
  skills_interests jsonb default '[]'::jsonb,
  preferred_role text,
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'active', 'on_hold')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. YOUTUBE VIDEOS TABLE
create table if not exists public.youtube_videos (
  id uuid primary key default uuid_generate_v4(),
  video_id text not null,
  title_en text not null,
  title_hi text not null,
  description_en text,
  description_hi text,
  thumbnail_url text,
  duration text default '10:00',
  views_count integer default 0,
  published_date timestamp with time zone default timezone('utc'::text, now()),
  category text default 'Speeches'
);

-- 8. APP SETTINGS TABLE
create table if not exists public.app_settings (
  id text primary key default 'default',
  settings_json jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table public.page_views enable row level security;
alter table public.analytics_events enable row level security;
alter table public.news_briefs enable row level security;
alter table public.campaigns enable row level security;
alter table public.blogs enable row level security;
alter table public.volunteers enable row level security;
alter table public.youtube_videos enable row level security;
alter table public.app_settings enable row level security;

-- Public can INSERT page views and analytics events
create policy "Allow public insert into page_views" on public.page_views for insert with check (true);
create policy "Allow public insert into analytics_events" on public.analytics_events for insert with check (true);

-- Public can SELECT published news briefs only
create policy "Allow public read published news" on public.news_briefs for select using (status = 'published');

-- Public can SELECT published campaigns, blogs, youtube videos
create policy "Allow public read campaigns" on public.campaigns for select using (true);
create policy "Allow public read published blogs" on public.blogs for select using (status = 'published');
create policy "Allow public read youtube_videos" on public.youtube_videos for select using (true);

-- Public can INSERT volunteer registration
create policy "Allow public insert volunteer" on public.volunteers for insert with check (true);

-- Admins (authenticated or service role) have full access to everything
create policy "Allow admin all access to page_views" on public.page_views for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow admin all access to analytics_events" on public.analytics_events for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow admin all access to news_briefs" on public.news_briefs for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow admin all access to campaigns" on public.campaigns for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow admin all access to blogs" on public.blogs for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow admin all access to volunteers" on public.volunteers for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow admin all access to youtube_videos" on public.youtube_videos for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow admin all access to app_settings" on public.app_settings for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow public read app_settings" on public.app_settings for select using (true);
-- 9. ADMIN ROLES & USERS TABLE
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text default 'admin' check (role in ('super_admin', 'admin', 'editor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on admin_users
alter table public.admin_users enable row level security;

-- Function to check if the current user is an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid()
  );
$$;

-- Policies for admin_users
create policy "Allow admins to read admin_users"
on public.admin_users for select
using (auth.uid() = id or public.is_admin() or auth.role() = 'service_role');

create policy "Allow super admin to manage admin_users"
on public.admin_users for all
using (
  exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'super_admin'
  ) or auth.role() = 'service_role'
);

-- INSTRUCTIONS TO CREATE FIRST ADMIN USER IN SUPABASE:
-- 1. Create a user in Supabase Auth via Dashboard: Authentication -> Users -> Add User.
-- 2. Run the SQL below to grant super_admin privileges:
--    insert into public.admin_users (id, email, role)
--    select id, email, 'super_admin'
--    from auth.users
--    where email = 'satyendra.rao@example.com' -- replace with actual admin email
--    on conflict (id) do nothing;


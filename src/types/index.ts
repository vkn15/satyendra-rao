export type Language = 'hi' | 'en';

export interface PageView {
  id: string;
  path: string;
  title?: string;
  visitor_id: string;
  session_id: string;
  referrer?: string;
  user_agent?: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  language: string;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: 'page_view' | 'video_watch' | 'volunteer_submit' | 'campaign_click' | 'news_read' | 'charter_download' | 'share';
  path: string;
  visitor_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AnalyticsStats {
  totalVisitors: number;
  dailyVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  totalPageViews: number;
  volunteerRegistrations: number;
  campaignEngagementCount: number;
  newsArticleViews: number;
  videoWatchCount: number;
  trafficTrends: {
    date: string;
    visitors: number;
    pageViews: number;
  }[];
  mostVisitedPages: {
    path: string;
    label: string;
    views: number;
    percentage: number;
  }[];
  popularBlogs: {
    id: string;
    title: string;
    views: number;
    shares: number;
  }[];
  popularYouTubeVideos: {
    id: string;
    title: string;
    views: number;
    video_id: string;
  }[];
  campaignEngagement: {
    id: string;
    title: string;
    participants: number;
    clicks: number;
  }[];
  deviceBreakdown: {
    name: string;
    value: number;
    color: string;
  }[];
  periodComparison: {
    visitorsChange: number;
    pageViewsChange: number;
    volunteersChange: number;
  };
}

export type ImportanceLevel = 'critical' | 'high' | 'medium' | 'general';
export type PublicationStatus = 'draft' | 'pending_review' | 'approved' | 'published';

export interface NewsBrief {
  id: string;
  headline_en: string;
  headline_hi: string;
  source: string;
  source_url: string;
  published_date: string;
  category: string;
  importance: ImportanceLevel;
  summary_en: string;
  summary_hi: string;
  key_points_en?: string[];
  key_points_hi?: string[];
  status: PublicationStatus;
  private_notes?: string;
  is_bookmarked?: boolean;
  views_count: number;
  ai_generated: boolean;
  ai_provider?: string;
  approved_at?: string;
  approved_by?: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title_en: string;
  title_hi: string;
  tagline_en: string;
  tagline_hi: string;
  description_en: string;
  description_hi: string;
  demands_en: string[];
  demands_hi: string[];
  status: 'active' | 'in_progress' | 'achieved';
  participants_count: number;
  target_participants: number;
  impact_metric_en: string;
  impact_metric_hi: string;
  icon: string;
  is_featured: boolean;
  created_at: string;
}

export interface Blog {
  id: string;
  slug: string;
  title_en: string;
  title_hi: string;
  excerpt_en: string;
  excerpt_hi: string;
  content_en: string;
  content_hi: string;
  author: string;
  published_date: string;
  reading_time_minutes: number;
  views_count: number;
  tags: string[];
  cover_image?: string;
  meta_description_en?: string;
  meta_description_hi?: string;
  status: 'published' | 'draft';
}

export interface Volunteer {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  occupation: string;
  skills_interests: string[];
  preferred_role: string;
  message?: string;
  status: 'new' | 'contacted' | 'active' | 'on_hold';
  notes?: string;
  created_at: string;
}

export interface YouTubeVideo {
  id: string;
  video_id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  thumbnail_url: string;
  duration: string;
  views_count: number;
  published_date: string;
  category: string;
}

export interface AppSettings {
  ai_provider: 'gemini' | 'openai' | 'local';
  gemini_api_key?: string;
  openai_api_key?: string;
  has_gemini_key?: boolean;
  has_openai_key?: boolean;
  gemini_model: string;
  rss_feeds: {
    id: string;
    name: string;
    url: string;
    category: string;
    language: 'hi' | 'en' | 'mixed';
    enabled: boolean;
  }[];
  auto_fetch_interval_minutes: number;
  require_admin_approval: boolean;
  last_fetched_at?: string;
  // Leader Profile & Social Media Links
  leader_name_hi?: string;
  leader_name_en?: string;
  leader_title_hi?: string;
  leader_title_en?: string;
  leader_bio_hi?: string;
  leader_bio_en?: string;
  youtube_channel_url?: string;
  whatsapp_number?: string;
  whatsapp_group_url?: string;
  telegram_group_url?: string;
  contact_email?: string;
  contact_phone?: string;
  office_address?: string;
}

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  let vid = localStorage.getItem('sr_visitor_id');
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('sr_visitor_id', vid);
  }
  return vid;
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sid = sessionStorage.getItem('sr_session_id');
  if (!sid) {
    sid = 's_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    sessionStorage.setItem('sr_session_id', sid);
  }
  return sid;
}

export function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export async function trackEvent(eventType: string, metadata?: Record<string, any>, customPath?: string) {
  try {
    const visitor_id = getOrCreateVisitorId();
    const path = customPath || (typeof window !== 'undefined' ? window.location.pathname : '/');

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'event',
        event_type: eventType,
        path,
        visitor_id,
        metadata
      })
    });
  } catch (e) {
    // Silent fail to not disrupt user experience
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track on actual navigation or first load
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const visitor_id = getOrCreateVisitorId();
    const session_id = getOrCreateSessionId();
    const device_type = getDeviceType();
    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        path: pathname,
        title: typeof document !== 'undefined' ? document.title : '',
        visitor_id,
        session_id,
        referrer,
        device_type,
        language
      })
    }).catch(() => {});
  }, [pathname, language]);

  return null;
}

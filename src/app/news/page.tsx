import React from 'react';
import { getDatabase } from '@/lib/storage';
import NewsClient from '@/components/public/NewsClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Daily News & Media Coverage | Satyendra Rao',
  description: 'Direct press coverage, newspaper links, judicial rulings, and youth employment reform reports.'
};

export default function NewsPage() {
  const db = getDatabase();
  const initialNews = (db.news_briefs || []).filter(n => n.status === 'published');

  return <NewsClient initialNews={initialNews} />;
}

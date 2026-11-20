import React from 'react';
import { getDatabase } from '@/lib/storage';
import BlogPageClient from '@/components/public/BlogPageClient';

export const dynamic = 'force-dynamic';

export default function BlogPage() {
  const db = getDatabase();
  const blogs = db.blogs?.filter(b => b.status === 'published') || [];

  return (
    <BlogPageClient initialBlogs={blogs} />
  );
}

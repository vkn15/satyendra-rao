import React from 'react';
import { notFound } from 'next/navigation';
import { getDatabase } from '@/lib/storage';
import SingleBlogClient from '@/components/public/SingleBlogClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function SingleBlogPage({ params }: PageProps) {
  const db = getDatabase();
  const blog = db.blogs?.find(b => b.slug === params.slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = db.blogs?.filter(b => b.slug !== params.slug).slice(0, 3) || [];

  return (
    <SingleBlogClient initialBlog={blog} relatedBlogs={relatedBlogs} />
  );
}

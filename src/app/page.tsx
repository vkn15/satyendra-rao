import React from 'react';
import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import FeatureBar from '@/components/public/FeatureBar';
import KeySectionRow from '@/components/public/KeySectionRow';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import Footer from '@/components/public/Footer';
import HomeLatestNews from '@/components/public/HomeLatestNews';
import HomeVolunteerSection from '@/components/public/HomeVolunteerSection';
import HomeMediaSection from '@/components/public/HomeMediaSection';
import HomeBlogSection from '@/components/public/HomeBlogSection';
import { getDatabase } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDatabase();
  const initialBlogs = db.blogs?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Exact Approved Hero Section from Poster */}
        <HeroSection />

        {/* 4 Feature Pillars on Lavender */}
        <FeatureBar />

        {/* 3 Core Blocks from Poster (About, Key Campaigns, Youth Charter) */}
        <KeySectionRow />

        {/* 5 Impact Metrics with Rajasthan Silhouette */}
        <ImpactRibbon />

        {/* AI-Powered Daily News Highlights */}
        <HomeLatestNews />

        {/* Video Speeches & Ground Rallies (Shadcn UI Video Strip) */}
        <HomeMediaSection />

        {/* Thought Leadership & Policy Blog Posts (Untitled UI 3-Column Grid) */}
        <HomeBlogSection initialBlogs={initialBlogs} />

        {/* Fast Volunteer Registration */}
        <HomeVolunteerSection />
      </main>
      <Footer />
    </div>
  );
}

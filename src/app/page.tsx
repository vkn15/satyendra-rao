import React from 'react';
import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import FeatureBar from '@/components/public/FeatureBar';
import AboutSectionRefined from '@/components/public/AboutSectionRefined';
import KeySectionRow from '@/components/public/KeySectionRow';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import Footer from '@/components/public/Footer';
import HomeLatestNews from '@/components/public/HomeLatestNews';
import HomeMediaSection from '@/components/public/HomeMediaSection';
import HomeBlogSection from '@/components/public/HomeBlogSection';
import HomeVolunteerSection from '@/components/public/HomeVolunteerSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section with New Satyendra Rao Portrait */}
        <HeroSection />

        {/* 4 Feature Pillars on Lavender */}
        <FeatureBar />

        {/* Refined About Section Matching Image 3 Reference */}
        <AboutSectionRefined />

        {/* 3 Core Blocks (Campaigns & Youth Charter) */}
        <KeySectionRow />

        {/* 5 Impact Metrics with Fort Silhouette */}
        <ImpactRibbon />

        {/* YouTube Recent Videos Strip Matching Image 1 Reference */}
        <HomeMediaSection />

        {/* AI-Powered Daily News Highlights */}
        <HomeLatestNews />

        {/* All Blog Posts Grid Matching Image 5 Reference */}
        <HomeBlogSection />

        {/* Grassroots Volunteer Registration */}
        <HomeVolunteerSection />
      </main>
      <Footer />
    </div>
  );
}

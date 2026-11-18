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

export default function HomePage() {
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

        {/* Video Speeches & Ground Rallies */}
        <HomeMediaSection />

        {/* Fast Volunteer Registration */}
        <HomeVolunteerSection />
      </main>
      <Footer />
    </div>
  );
}

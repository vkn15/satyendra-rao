'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Campaign } from '@/types';
import { Scale, BookOpen, Users, ShieldCheck, CheckCircle2, ArrowRight, Share2, Award } from 'lucide-react';

export default function CampaignsPage() {
  const { isHindi } = useLanguage();
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleSupport = (c: Campaign) => {
    trackEvent('campaign_click', { campaign_id: c.id, slug: c.slug });
    showToast(isHindi ? `आपने '${c.title_hi}' अभियान को अपना समर्थन दिया!` : `You supported '${c.title_en}'!`, 'success');
  };

  const handleShare = (c: Campaign) => {
    trackEvent('share', { campaign_id: c.id });
    if (navigator.share) {
      navigator.share({
        title: isHindi ? c.title_hi : c.title_en,
        text: isHindi ? c.tagline_hi : c.tagline_en,
        url: window.location.href + '#' + c.slug
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href + '#' + c.slug);
      showToast(isHindi ? 'अभियान लिंक कॉपी किया गया' : 'Campaign link copied', 'info');
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'scale': return Scale;
      case 'book': return BookOpen;
      default: return Users;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-b from-purple-950 via-purple-900 to-[#1E0836] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-yellow text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHindi ? 'न्याय के लिए जनक्रांति' : 'People\'s Advocacy Campaigns'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-hindi">
                {isHindi ? 'युवाओं के हक में मुख्य जनअभियान' : 'Core Youth Advocacy Campaigns'}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-purple-200 leading-relaxed font-hindi">
                {isHindi 
                  ? 'पारदर्शी परीक्षा प्रणाली, भर्ती आयोगों की जवाबदेही और युवाओं के भविष्य की सुरक्षा हेतु सत्येंद्र राव के नेतृत्व में जारी निर्णायक आंदोलन।'
                  : 'Sustained ground campaigns fighting for candidate justice, commission integrity, and uncompromised recruitment timelines.'}
              </p>
            </div>
          </div>
        </section>

        {/* Campaigns List */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {campaigns.map((c) => {
              const Icon = getIcon(c.icon);
              const progress = Math.min(100, Math.round((c.participants_count / c.target_participants) * 100));

              return (
                <div
                  key={c.id}
                  id={c.slug}
                  className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-card hover:shadow-hover transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <div className="lg:col-span-8 space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-900 shrink-0">
                          <Icon className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-accent-gold uppercase tracking-wider font-hindi">
                            {isHindi ? c.tagline_hi : c.tagline_en}
                          </span>
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-navy-900 font-hindi">
                            {isHindi ? c.title_hi : c.title_en}
                          </h2>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-hindi">
                        {isHindi ? c.description_hi : c.description_en}
                      </p>

                      {/* Demands Section */}
                      <div className="pt-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-purple-900 mb-2 font-hindi">
                          {isHindi ? 'प्रमुख नीतिगत मांगें (Key Demands):' : 'Key Statutory Demands:'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {(isHindi ? c.demands_hi : c.demands_en).map((dem, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-hindi">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{dem}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right Action Column */}
                    <div className="lg:col-span-4 bg-purple-50/60 rounded-2xl p-6 border border-purple-100 space-y-5">
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>{isHindi ? 'जनसहभागिता लक्ष्य' : 'Mobilization Goal'}</span>
                          <span className="text-purple-900 font-extrabold">{progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-purple-200/80 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-800 to-purple-600 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                          <span className="font-bold text-navy-900">
                            {c.participants_count.toLocaleString()} {isHindi ? 'समर्थक' : 'Pledged'}
                          </span>
                          <span>
                            {isHindi ? 'लक्ष्य:' : 'Target:'} {c.target_participants.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-purple-100 text-xs">
                        <span className="font-bold text-purple-900 block mb-0.5">
                          {isHindi ? 'अभियान प्रभाव:' : 'Campaign Impact:'}
                        </span>
                        <span className="text-slate-700 font-medium">
                          {isHindi ? c.impact_metric_hi : c.impact_metric_en}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 pt-1">
                        <button
                          onClick={() => handleSupport(c)}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition-all"
                        >
                          <Users className="w-4 h-4 text-accent-yellow" />
                          <span>{isHindi ? 'इस अभियान का समर्थन करें' : 'Pledge Support to Campaign'}</span>
                        </button>

                        <button
                          onClick={() => handleShare(c)}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold text-xs transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'अभियान साझा करें' : 'Share Campaign'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <ImpactRibbon />
      </main>

      <Footer />
    </div>
  );
}

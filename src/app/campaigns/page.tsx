'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Campaign } from '@/types';
import { 
  Scale, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Award,
  X,
  Send,
  Heart
} from 'lucide-react';

export default function CampaignsPage() {
  const { isHindi } = useLanguage();
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [pledgeCampaign, setPledgeCampaign] = useState<Campaign | null>(null);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);
  const [pledgeForm, setPledgeForm] = useState({
    name: '',
    phone: '',
    district: 'Jaipur'
  });

  const districts = [
    'Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Sikar',
    'Alwar', 'Bharatpur', 'Bhilwara', 'Nagaur', 'Pali', 'Chittorgarh', 'Jhunjhunu'
  ];

  useEffect(() => {
    fetch('/api/campaigns')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const openPledgeModal = (c: Campaign) => {
    setPledgeCampaign(c);
    setPledgeSuccess(false);
    setPledgeForm({ name: '', phone: '', district: 'Jaipur' });
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeForm.name || !pledgeForm.phone) {
      showToast(isHindi ? 'कृपया नाम और मोबाइल नंबर दर्ज करें' : 'Please enter your name and phone', 'error');
      return;
    }

    if (!pledgeCampaign) return;

    // Increment local participant count
    setCampaigns(prev => prev.map(c => 
      c.id === pledgeCampaign.id ? { ...c, participants_count: c.participants_count + 1 } : c
    ));

    // Track analytics
    trackEvent('campaign_click', {
      campaign_id: pledgeCampaign.id,
      slug: pledgeCampaign.slug,
      supporter: pledgeForm.name,
      district: pledgeForm.district
    });

    // Also register as supporter in volunteers DB
    fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: pledgeForm.name,
        phone: pledgeForm.phone,
        email: `${pledgeForm.name.toLowerCase().replace(/\s+/g, '')}@supporter.in`,
        state: 'Rajasthan',
        district: pledgeForm.district,
        occupation: 'Campaign Supporter',
        preferred_role: `Supporter: ${pledgeCampaign.title_en}`,
        message: `Pledged support to ${pledgeCampaign.title_hi}`
      })
    }).catch(() => {});

    setPledgeSuccess(true);
    showToast(isHindi ? 'आपका समर्थन दर्ज कर लिया गया है!' : 'Your pledge has been recorded!', 'success');
  };

  const handleShare = (c: Campaign) => {
    trackEvent('share', { campaign_id: c.id });
    const shareText = isHindi 
      ? `मैंने सत्येंद्र राव के '${c.title_hi}' अभियान को अपना समर्थन दिया है। आप भी जुड़ें:`
      : `I pledged support to Satyendra Rao's campaign '${c.title_en}'. Join here:`;
    const shareUrl = window.location.href + '#' + c.slug;

    if (navigator.share) {
      navigator.share({
        title: isHindi ? c.title_hi : c.title_en,
        text: shareText,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
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
                  ? 'पारदर्शी परीक्षा प्रणाली, भर्ती आयोगों की जवाबदेही और युवाओं के भविष्य की सुरक्षा हेतु सत्येंद्र राव के नेतृत्व में जारी निर्णायक आंदोलन। किसी भी अभियान से अभी जुड़ें।'
                  : 'Sustained ground campaigns fighting for candidate justice, commission integrity, and uncompromised recruitment timelines. Join any campaign now.'}
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
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block font-hindi">
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
                            {c.participants_count.toLocaleString()} {isHindi ? 'समर्थक जुड़े' : 'Supporters'}
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
                          onClick={() => openPledgeModal(c)}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition-all"
                        >
                          <Users className="w-4 h-4 text-accent-yellow" />
                          <span>{isHindi ? 'इस अभियान से जुड़ें / समर्थन दें' : 'Join / Pledge Support to Campaign'}</span>
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

      {/* JOIN CAMPAIGN PLEDGE MODAL */}
      {pledgeCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-purple-100 space-y-5 text-xs relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Heart className="w-4 h-4 text-rose-600 fill-current" />
                <span>{isHindi ? 'अभियान समर्थन पत्र' : 'Campaign Pledge Support'}</span>
              </div>
              <button
                onClick={() => setPledgeCampaign(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pledgeSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-navy-900 font-hindi">
                    {isHindi ? 'समर्थन सफलतापूर्वक दर्ज!' : 'Support Successfully Pledged!'}
                  </h3>
                  <p className="text-xs text-slate-500 font-hindi">
                    {isHindi 
                      ? `आपने '${pledgeCampaign.title_hi}' अभियान को अपना समर्थन दिया है।`
                      : `You have pledged support to '${pledgeCampaign.title_en}'.`}
                  </p>
                </div>

                {/* Digital Supporter Certificate */}
                <div className="p-4 rounded-2xl bg-purple-950 text-white border border-accent-yellow/30 text-left space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent-yellow block">
                    CAMPAIGN SUPPORTER BADGE
                  </span>
                  <div className="text-sm font-bold font-hindi">{pledgeForm.name}</div>
                  <div className="text-xs text-purple-200 font-hindi">{pledgeCampaign.title_hi}</div>
                  <div className="text-[11px] text-slate-400">{pledgeForm.district}, Rajasthan • 2026</div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setPledgeCampaign(null)}
                    className="px-6 py-2.5 rounded-xl bg-purple-900 text-white font-bold text-xs"
                  >
                    {isHindi ? 'पूर्ण' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-navy-900 font-hindi leading-snug">
                    {isHindi ? pledgeCampaign.title_hi : pledgeCampaign.title_en}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 font-hindi">
                    {isHindi 
                      ? 'लाखों छात्रों के हकों के इस जनआंदोलन में अपना नाम और मोबाइल दर्ज कर समर्थन दें।' 
                      : 'Join thousands of citizens pledging their voice to this statutory reform.'}
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHindi ? 'आपका पूरा नाम *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isHindi ? 'उदा. अमित कुमार शर्मा' : 'e.g. Amit Kumar'}
                    value={pledgeForm.name}
                    onChange={e => setPledgeForm({ ...pledgeForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-hindi focus:ring-1 focus:ring-purple-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isHindi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290 XXXXX"
                      value={pledgeForm.phone}
                      onChange={e => setPledgeForm({ ...pledgeForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isHindi ? 'जिला (District)' : 'District'}
                    </label>
                    <select
                      value={pledgeForm.district}
                      onChange={e => setPledgeForm({ ...pledgeForm, district: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPledgeCampaign(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold shadow-md"
                  >
                    <Send className="w-3.5 h-3.5 text-accent-yellow" />
                    <span>{isHindi ? 'समर्थन पत्र हस्ताक्षर करें' : 'Sign & Pledge Support'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

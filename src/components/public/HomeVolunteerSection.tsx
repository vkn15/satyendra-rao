'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { Users, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function HomeVolunteerSection() {
  const { t, isHindi } = useLanguage();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    state: 'Rajasthan',
    district: 'Jaipur',
    occupation: '',
    preferred_role: 'District Youth Coordinator',
    message: ''
  });

  const districts = [
    'Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Sikar',
    'Alwar', 'Bharatpur', 'Bhilwara', 'Nagaur', 'Pali', 'Chittorgarh',
    'Jhunjhunu', 'Churu', 'Dausa', 'Sawai Madhopur', 'Barmer', 'Jaisalmer'
  ];

  const roles = [
    { id: 'District Youth Coordinator', label_hi: 'जिला युवा समन्वयक', label_en: 'District Youth Coordinator' },
    { id: 'Legal & RTI Research Team', label_hi: 'विधिक एवं आरटीआई शोध दल', label_en: 'Legal & RTI Research Team' },
    { id: 'Campus & College Mobilizer', label_hi: 'कॉलेज एवं कोचिंग कैंपस मोबिलाइज़र', label_en: 'Campus & College Mobilizer' },
    { id: 'Social Media & Digital Outreach', label_hi: 'सोशल मीडिया एवं डिजिटल प्रचार', label_en: 'Social Media & Digital Outreach' },
    { id: 'Student Grievance Cell', label_hi: 'छात्र शिकायत निवारण प्रकोष्ठ', label_en: 'Student Grievance Cell' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone || !formData.email) {
      showToast(isHindi ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to register');

      setSubmitted(true);
      showToast(t.volSuccessMsg, 'success');
      trackEvent('volunteer_submit', {
        district: formData.district,
        role: formData.preferred_role
      });
    } catch (err: any) {
      showToast(isHindi ? 'पंजीकरण में त्रुटि आई, पुनः प्रयास करें' : 'Registration failed, please try again', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="volunteer-section" className="py-20 bg-royal-lavender/60 border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-navy-900 rounded-3xl p-8 sm:p-12 shadow-2xl text-white relative overflow-hidden">
          
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Mission & Pledges */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-accent-yellow">
                <Users className="w-4 h-4" />
                <span>{isHindi ? 'सत्याग्रह का हिस्सा बनें' : 'Be the Change'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black leading-tight font-hindi">
                {t.volHeading}
              </h2>

              <p className="text-sm sm:text-base text-purple-100 leading-relaxed font-hindi">
                {t.volSubtitle}
              </p>

              <div className="space-y-3 pt-2 text-sm text-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{isHindi ? 'प्रत्येक जिले में आधिकारिक युवा प्रतिनिधि' : 'Official Youth Representative in each district'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{isHindi ? 'सत्येंद्र राव के साथ प्रत्यक्ष संवाद एवं रणनीति बैठक' : 'Direct meetings & policy sessions with Satyendra Rao'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-yellow/20 flex items-center justify-center text-accent-yellow shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{isHindi ? 'प्रतियोगी छात्रों के अधिकारों की सुरक्षा' : 'Protection of competitive aspirants\' rights'}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2 text-xs text-purple-300">
                <ShieldCheck className="w-4 h-4 text-accent-yellow" />
                <span>{isHindi ? 'आपकी जानकारी पूर्णतः सुरक्षित एवं गोपनीय रखी जाएगी।' : 'Your data is strictly confidential.'}</span>
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="lg:col-span-7 bg-white text-navy-900 rounded-2xl p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <div className="py-6 space-y-6 animate-fade-in">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-navy-900 font-hindi">
                      {isHindi ? 'बधाई! आप युवा सुधार आंदोलन से जुड़ चुके हैं' : 'Welcome to the Youth Reform Movement!'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto font-hindi">
                      {t.volSuccessMsg}
                    </p>
                  </div>

                  {/* Digital Membership ID Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950 via-purple-900 to-navy-950 text-white border-2 border-accent-yellow/40 shadow-xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-yellow block">
                          OFFICIAL MEMBERSHIP CARD
                        </span>
                        <h4 className="text-sm font-bold text-white font-hindi">
                          सत्येंद्र राव युवा सत्याग्रह
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        VERIFIED MEMBER
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-purple-300 block uppercase">Member Name</span>
                        <span className="font-bold text-white text-sm font-hindi">{formData.full_name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300 block uppercase">District & State</span>
                        <span className="font-bold text-white font-hindi">{formData.district}, Rajasthan</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300 block uppercase">Assigned Role</span>
                        <span className="font-bold text-accent-yellow font-hindi">{formData.preferred_role}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-purple-300 block uppercase">Member ID</span>
                        <span className="font-mono font-bold text-purple-200">SR-2026-{formData.phone.slice(-4) || '8842'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-purple-200">
                      <span>सत्य • पारदर्शिता • युवा अधिकार</span>
                      <span className="font-hindi text-accent-yellow">सत्येंद्र राव</span>
                    </div>
                  </div>

                  {/* Instant Community Join Actions */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-700 block text-center">
                      {isHindi ? 'आंदोलन की आगामी रणनीतियों हेतु आधिकारिक ग्रुप से जुड़ें:' : 'Join our official volunteer groups to receive meeting updates:'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href="https://chat.whatsapp.com/invite/SatyendraRaoYouth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.177.181-.076.355.101.173.449.741.964 1.2.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
                        </svg>
                        <span>{isHindi ? 'व्हाट्सएप ग्रुप से जुड़ें' : 'Join WhatsApp Group'}</span>
                      </a>

                      <a
                        href="https://t.me/SatyendraRaoOfficial"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                        </svg>
                        <span>{isHindi ? 'टेलीग्राम चैनल से जुड़ें' : 'Join Telegram Channel'}</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          full_name: '',
                          phone: '',
                          email: '',
                          state: 'Rajasthan',
                          district: 'Jaipur',
                          occupation: '',
                          preferred_role: 'District Youth Coordinator',
                          message: ''
                        });
                      }}
                      className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                    >
                      {isHindi ? 'अन्य साथी का पंजीकरण करें' : 'Register Another Volunteer'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.volName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder={isHindi ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.volPhone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98290 XXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.volEmail} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="youremail@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.volDistrict} *
                      </label>
                      <select
                        value={formData.district}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent bg-white"
                      >
                        {districts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.volOccupation}
                      </label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                        placeholder={isHindi ? 'छात्र / अधिवक्ता / शिक्षक' : 'Student / Advocate / Teacher'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        {t.volRole}
                      </label>
                      <select
                        value={formData.preferred_role}
                        onChange={e => setFormData({ ...formData, preferred_role: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent bg-white"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>
                            {isHindi ? r.label_hi : r.label_en}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {t.volMessage}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isHindi ? 'आप इस आंदोलन में किस प्रकार योगदान देना चाहते हैं...' : 'How would you like to contribute to the movement...'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-accent-yellow" />
                    <span>{submitting ? (isHindi ? 'जमा हो रहा है...' : 'Submitting...') : (isHindi ? 'कार्यकर्ता के रूप में जुड़ें' : 'Join as Volunteer')}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

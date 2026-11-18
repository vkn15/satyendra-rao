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
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-navy-900 font-hindi">
                    {isHindi ? 'पंजीकरण सफल रहा!' : 'Registration Successful!'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto font-hindi">
                    {t.volSuccessMsg}
                  </p>
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
                    className="mt-4 px-6 py-2.5 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors"
                  >
                    {isHindi ? 'अन्य साथी का पंजीकरण करें' : 'Register Another Volunteer'}
                  </button>
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

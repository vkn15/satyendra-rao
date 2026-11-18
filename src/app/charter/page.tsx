'use client';

import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ImpactRibbon from '@/components/public/ImpactRibbon';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { trackEvent } from '@/components/shared/AnalyticsTracker';
import { 
  ClipboardList, 
  CheckCircle2, 
  Download, 
  Share2, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  FileText,
  AlertOctagon,
  Scale
} from 'lucide-react';

export default function CharterPage() {
  const { isHindi } = useLanguage();
  const { showToast } = useToast();

  const charterPoints = [
    {
      num: 1,
      title_hi: 'सभी भर्ती प्रक्रियाएँ अधिकतम 90 दिनों में पूरी हों',
      title_en: 'Statutory 90-Day Ceiling from Notification to Final Appointment',
      desc_hi: 'विज्ञप्ति प्रकाशन से लेकर लिखित परीक्षा, दस्तावेज सत्यापन और अंतिम नियुक्ति पत्र देने तक अधिकतम 90 दिनों की समय-सीमा का कानूनी प्रावधान हो। बेवजह की देरी पर अधिकारियों पर जुर्माना लगाया जाए।',
      desc_en: 'A legal ceiling mandating complete recruitment cycles within 90 days. Fines and administrative penalties on officials for unjustified postponements.'
    },
    {
      num: 2,
      title_hi: 'RPSC / RSSB में संपूर्ण पारदर्शिता और जवाबदेही',
      title_en: 'Comprehensive Transparency & Accountability in RPSC / RSSB',
      desc_hi: 'आयोग के अध्यक्ष एवं सदस्यों की नियुक्ति उच्च न्यायालय के सेवानिवृत्त न्यायाधीशों व शिक्षाविदों की चयन समिति द्वारा हो। परीक्षा के 48 घंटे में प्रमाणित उत्तर कुंजी और ओएमआर स्कैन प्रतियां सार्वजनिक हों।',
      desc_en: 'Depoliticized collegium appointments for commission members. Certified answer keys and scanned OMR carbon copies published online within 48 hours.'
    },
    {
      num: 3,
      title_hi: 'नियमित वार्षिक भर्ती कैलेंडर और रिक्त पदों की समय पर पूर्ति',
      title_en: 'Mandatory Annual Recruitment Calendar & Timely Filling of Vacancies',
      desc_hi: 'संघ लोक सेवा आयोग (UPSC) की तर्ज पर प्रत्येक वर्ष 1 जनवरी को स्थायी परीक्षा कैलेंडर जारी किया जाए और किसी भी परिस्थिति में पूर्व निर्धारित तारीखों में संशोधन न किया जाए।',
      desc_en: 'UPSC-modeled annual examination calendar published every January 1st with strictly non-negotiable test dates.'
    },
    {
      num: 4,
      title_hi: 'प्रमाणिक एवं आधिकारिक अध्ययन सामग्री की आधिकारिक सूची',
      title_en: 'Standard Authorized Reference Study Material from State Academies',
      desc_hi: 'राजस्थान हिंदी ग्रंथ अकादमी एवं एनसीईआरटी की आधिकारिक पुस्तकों पर आधारित निश्चित पाठ्यक्रम जारी हो। विवादित प्रश्नों पर निजी गाइडों के बजाय केवल मानक पुस्तकों को ही विधिक मान्यता दी जाए।',
      desc_en: 'Official curriculum strictly mapped to NCERT and State Hindi Granth Academy textbooks, barring ambiguous questions from unauthorized private guides.'
    },
    {
      num: 5,
      title_hi: 'NA (Not Available) पदों की जवाबदेही तय हो',
      title_en: 'Strict Accountability on NA (Not Available) Vacancy Declarations',
      desc_hi: 'आरक्षित एवं विशेष वर्गों के पदों को "योग्य अभ्यर्थी उपलब्ध नहीं" (NA) दिखाकर कैरी-फॉरवर्ड करने की प्रथा बंद हो। न्यूनतम अंकों के बहाने युवाओं के हकों का हनन रोका जाए।',
      desc_en: 'Abolishing the loophole of declaring reserved category vacancies as "Not Available" without independent audit and review.'
    },
    {
      num: 6,
      title_hi: 'परीक्षा केंद्रों का गृह जिला या निकटतम संभाग मुख्यालय में आवंटन',
      title_en: 'Center Allocation Limited to Candidate Home or Adjoining Districts',
      desc_hi: 'महिला अभ्यर्थियों एवं दिव्यांगों को उनके गृह जिले में ही केंद्र दिया जाए। किसी भी परीक्षार्थी को 150 किमी से अधिक दूर न भेजा जाए ताकि यात्रा दुर्घटनाओं व मानसिक तनाव से मुक्ति मिले।',
      desc_en: 'Home-district examination centers for women and differently abled candidates, with an absolute 150 km distance ceiling for all applicants.'
    },
    {
      num: 7,
      title_hi: 'बायोमेट्रिक, आइरिस एवं फेस रिकॉग्निशन तकनीक से नकल पर पूर्ण रोक',
      title_en: 'Biometric, Iris & AI Facial Verification to Prevent Impersonation',
      desc_hi: 'डमी परीक्षार्थियों और गिरोहों की रोकथाम के लिए परीक्षा केंद्र के प्रवेश द्वार पर आधुनिक बायोमेट्रिक व आधार आधारित सत्यापन अनिवार्य हो।',
      desc_en: 'Aadhaar-linked biometric and iris authentication at examination gates to completely eradicate dummy candidate syndicates.'
    },
    {
      num: 8,
      title_hi: 'अभ्यर्थियों के लिए निःशुल्क यात्रा और परीक्षा बीमा सुरक्षा कानून',
      title_en: 'Free Candidate Transit & Administrative Exam Cancellation Insurance',
      desc_hi: 'परीक्षा प्रवेश पत्र के आधार पर रोडवेज एवं एक्सप्रेस बसों में निःशुल्क यात्रा की स्थायी व्यवस्था हो। प्रशासनिक चूक से पेपर रद्द होने पर प्रत्येक अभ्यर्थी को ₹5,000 की क्षतिपूर्ति दी जाए।',
      desc_en: 'Permanent free transit on roadways buses via admit cards, plus mandatory ₹5,000 state compensation per candidate if an exam is cancelled due to administrative failure.'
    },
    {
      num: 9,
      title_hi: 'भर्ती विवादों के त्वरित निस्तारण हेतु स्वतंत्र "युवा लोकपाल"',
      title_en: 'Independent Youth Lokpal for Fast-Track Grievance Redressal',
      desc_hi: 'न्यायालयीन मुकदमों में वर्षों तक भर्तियां उलझने से बचाने के लिए एक स्वतंत्र ट्रिब्यूनल (युवा लोकपाल) का गठन हो जो 30 दिनों में सभी विधिक आपत्तियों का अंतिम फैसला करे।',
      desc_en: 'A statutory 3-member judicial tribunal (Youth Lokpal) to resolve candidate petitions and result disputes within 30 days.'
    },
    {
      num: 10,
      title_hi: 'एकमुश्त आवेदन शुल्क एवं आजीवन निःशुल्क आवेदन प्रणाली',
      title_en: 'One-Time Registration Fee with Single-Window Free Applications',
      desc_hi: 'बार-बार परीक्षा फॉर्म के नाम पर बेरोजगार युवाओं से करोड़ों रुपये वसूलने की लूट बंद हो। एकमुश्त पंजीकरण के बाद सभी राज्य परीक्षाओं के फॉर्म पूर्णतः निःशुल्क भरे जाएं।',
      desc_en: 'Eliminating recurring examination fees through a single unified one-time registration portal for all state government tests.'
    }
  ];

  const handleDownload = () => {
    trackEvent('charter_download', { format: 'summary' });
    showToast(isHindi ? 'युवा सुधार चार्टर तैयार किया जा रहा है...' : 'Downloading Youth Reform Charter...', 'info');
    
    // Create text file download
    const content = `SATYENDRA RAO YOUTH REFORM CHARTER
युवा परीक्षा और भर्ती सुधार के लिए हमारा संकल्प

${charterPoints.map(p => `${p.num}. ${p.title_hi}\n   (${p.title_en})\n   ${p.desc_hi}\n`).join('\n')}

Issued by: Satyendra Rao Youth Reform Movement
Jaipur, Rajasthan | contact@satyendrarao.in | https://satyendrarao.in
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Satyendra_Rao_Youth_Reform_Charter.txt';
    link.click();
    URL.revokeObjectURL(url);
    showToast(isHindi ? 'चार्टर सफलतापूर्वक डाउनलोड हुआ' : 'Charter downloaded successfully', 'success');
  };

  const handleShare = () => {
    trackEvent('share', { content: 'charter' });
    if (navigator.share) {
      navigator.share({
        title: isHindi ? 'युवा सुधार चार्टर - सत्येंद्र राव' : 'Youth Reform Charter - Satyendra Rao',
        text: isHindi ? 'युवा परीक्षा और भर्ती सुधार के लिए हमारा 10-सूत्रीय संकल्प पत्र।' : '10-Point statutory resolution for recruitment reforms in India.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(isHindi ? 'चार्टर लिंक कॉपी किया गया' : 'Charter link copied', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-purple-950 via-purple-900 to-[#220B38] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent-yellow text-xs font-bold uppercase tracking-wider mb-3">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>{isHindi ? 'हमारा ऐतिहासिक संकल्प पत्र' : 'Our Historic Resolution'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-hindi">
                {isHindi ? 'युवा सुधार चार्टर (Youth Reform Charter)' : 'Youth Reform Charter'}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-purple-200 leading-relaxed font-hindi">
                {isHindi 
                  ? 'युवा परीक्षा, रोजगार और भर्ती संस्थाओं में जवाबदेही स्थापित करने के लिए सत्येंद्र राव द्वारा प्रस्तुत 10-सूत्रीय संवैधानिक सुधार पत्र।'
                  : 'A 10-point constitutional reform charter presented by Satyendra Rao to guarantee transparency, fairness, and accountability in public recruitment.'}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-yellow text-navy-900 font-black text-sm shadow-lg hover:bg-amber-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHindi ? 'चार्टर डाउनलोड करें (Download Charter)' : 'Download Charter'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isHindi ? 'चार्टर साझा करें' : 'Share Charter'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 10 Points Details Grid */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {charterPoints.map((item) => (
                <div
                  key={item.num}
                  className="flex items-start gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-purple-100 shadow-card hover:shadow-hover hover:border-purple-300 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-900 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                    {item.num}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-navy-900 font-hindi leading-snug">
                      {isHindi ? item.title_hi : item.title_en}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-hindi">
                      {isHindi ? item.desc_hi : item.desc_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Pledge Banner */}
            <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950 via-purple-900 to-navy-900 text-white text-center space-y-4">
              <h3 className="text-2xl sm:text-3xl font-black font-hindi">
                {isHindi ? 'क्या आप इस युवा चार्टर का समर्थन करते हैं?' : 'Do You Support the Youth Reform Charter?'}
              </h3>
              <p className="text-sm sm:text-base text-purple-200 max-w-2xl mx-auto font-hindi">
                {isHindi 
                  ? 'राजस्थान के 33 जिलों में 30 लाख से अधिक युवा इस मांग पत्र से जुड़ चुके हैं। आज ही अपना समर्थन दर्ज करें।'
                  : 'Over 3 million youth have endorsed this charter across India. Join the movement today.'}
              </p>
              <div className="pt-2">
                <a
                  href="/volunteer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent-yellow text-navy-900 font-black text-sm shadow-xl hover:bg-amber-300 transition-all"
                >
                  <span>{isHindi ? 'चार्टर समर्थन दर्ज करें' : 'Pledge Your Support Now'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </section>

        <ImpactRibbon />
      </main>

      <Footer />
    </div>
  );
}

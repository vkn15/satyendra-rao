import fs from 'fs';
import path from 'path';
import { 
  PageView, 
  AnalyticsEvent, 
  NewsBrief, 
  Campaign, 
  Blog, 
  Volunteer, 
  YouTubeVideo, 
  AppSettings 
} from '@/types';

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'db.json');

export interface DatabaseState {
  page_views: PageView[];
  analytics_events: AnalyticsEvent[];
  news_briefs: NewsBrief[];
  campaigns: Campaign[];
  blogs: Blog[];
  volunteers: Volunteer[];
  youtube_videos: YouTubeVideo[];
  settings: AppSettings;
}

// Generate realistic past timestamp helper
function getPastDate(daysAgo: number, hourOffset: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hourOffset);
  return d.toISOString();
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    slug: 'si-recruitment-re-exam',
    title_en: 'Sub-Inspector (SI) Recruitment Re-Exam Movement',
    title_hi: 'SI भर्ती पुनः परीक्षा अभियान',
    tagline_en: 'Justice for 1.5 Lakh Eligible Candidates',
    tagline_hi: '1.5 लाख अभ्यर्थियों के लिए न्याय',
    description_en: 'Demanding swift cancellation of tainted examination centers and immediate conduction of a fair, transparent re-examination for 1.5 lakh deserving candidates who prepared tirelessly.',
    description_hi: 'धांधली युक्त परीक्षा केंद्रों की जाँच, दोषियों पर त्वरित सख्त कार्रवाई और 1.5 लाख समर्पित अभ्यर्थियों के भविष्य की सुरक्षा हेतु पूर्णतः पारदर्शी पुनः परीक्षा की मांग।',
    demands_en: [
      'Comprehensive CBI/Special Task Force investigation into all tainted paper leak syndicates',
      'Immediate release of a revised, foolproof re-examination schedule',
      'Full refund and travel stipend for all registered applicants',
      'Fast-track special court proceedings against paper leak mafias'
    ],
    demands_hi: [
      'पेपर लीक सिंडिकेट्स की विशेष कार्यदल द्वारा निष्पक्ष एवं गहन जांच',
      'संशोधित एवं पारदर्शी पुनः परीक्षा तिथि की तत्काल घोषणा',
      'सभी पंजीकृत अभ्यर्थियों को निःशुल्क यात्रा और परीक्षा भत्ता',
      'दोषियों के विरुद्ध फास्ट-ट्रैक विशेष अदालत में त्वरित मुकदमा'
    ],
    status: 'active',
    participants_count: 142850,
    target_participants: 150000,
    impact_metric_en: '1.42 Lakh Candidates Mobilized',
    impact_metric_hi: '1.42 लाख युवा एकजुट',
    icon: 'scale',
    is_featured: true,
    created_at: getPastDate(45)
  },
  {
    id: 'camp-2',
    slug: 'rpsc-rssb-structural-reforms',
    title_en: 'RPSC & RSSB Comprehensive Institutional Reform',
    title_hi: 'RPSC / RSSB संस्थागत सुधार अभियान',
    tagline_en: 'Transparency, Accountability and Strict Timelines',
    tagline_hi: 'पारदर्शिता, जवाबदेही और समय सीमा',
    description_en: 'A systemic campaign targeting appointment standards, digital answer sheet verification, double-blind evaluation, and time-bound grievance redressal inside state recruitment commissions.',
    description_hi: 'भर्ती आयोगों में नियुक्तियों की उच्च योग्यता, डिजिटल ओएमआर सत्यापन, समयबद्ध परिणाम घोषणा और 30 दिवसीय जनसुनवाई तंत्र लागू करवाने का निर्णायक आंदोलन।',
    demands_en: [
      'Appoint independent public administrators and legal luminaries as commission members',
      'Publish certified answer keys within 48 hours with transparent dispute window',
      'Carbon-copy OMR sheets with tamper-proof digital barcode scanning',
      'Mandatory maximum 90-day ceiling from preliminary notification to final appointment'
    ],
    demands_hi: [
      'आयोग के अध्यक्ष एवं सदस्यों की नियुक्ति में गैर-राजनीतिक योग्यता मानक लागू करना',
      'परीक्षा के 48 घंटे के भीतर आधिकारिक उत्तर कुंजी जारी करना और निष्पक्ष आपत्ति निवारण',
      'डिजिटल बारकोड युक्त ओएमआर कार्बन प्रति की तत्काल स्कैनिंग और सार्वजनिक अभिलेख',
      'विज्ञप्ति से अंतिम नियुक्ति तक अधिकतम 90 दिनों की वैधानिक सीमा'
    ],
    status: 'active',
    participants_count: 88400,
    target_participants: 100000,
    impact_metric_en: '5 Institutional Memorandums Submitted',
    impact_metric_hi: '5 नीतिगत मांग पत्र प्रस्तुत',
    icon: 'book',
    is_featured: true,
    created_at: getPastDate(90)
  },
  {
    id: 'camp-3',
    slug: 'teacher-recruitment-calendar',
    title_en: 'Teacher & Grade Recruitment Timely Fulfillment',
    title_hi: 'शिक्षक एवं अन्य भर्ती: त्वरित पूर्ति व स्थायी कैलेंडर',
    tagline_en: 'Swift Filling of Vacancies & Annual Recruitment Calendar',
    tagline_hi: 'रिक्त पदों की शीघ्र पूर्ति और नए कैलेंडर की मांग',
    description_en: 'Fulfilling over 50,000 vacant teaching and clerical positions across rural and semi-urban Rajasthan through a permanent annual statutory recruitment calendar.',
    description_hi: 'प्रदेश के राजकीय विद्यालयों और प्रशासनिक विभागों में 50,000+ रिक्त पदों पर अविलंब भर्ती प्रक्रिया शुरू करने और संघ लोक सेवा आयोग की तर्ज पर वार्षिक कैलेंडर जारी करने का जनअभियान।',
    demands_en: [
      'Issue an unalterable annual recruitment calendar in January every year',
      'Expedite pending Grade I, Grade II, and REET 3rd Grade appointment backlogs',
      'Abolish the NA (Not Available) category loophole preventing reservation justice',
      'Standardize syllabus and reference textbooks published by state academies'
    ],
    demands_hi: [
      'प्रत्येक वर्ष जनवरी माह में स्थायी भर्ती कैलेंडर अनिवार्य रूप से जारी करना',
      'प्रथम श्रेणी, द्वितीय श्रेणी और रीट तृतीय श्रेणी के लंबित परिणामों की त्वरित नियुक्ति',
      'आरक्षित वर्गों में NA (Not Available) दिखाकर सीटें रिक्त रखने की प्रथा पर रोक',
      'राजस्थान हिंदी ग्रंथ अकादमी की प्रामाणिक पुस्तकों पर आधारित मानक पाठ्यक्रम'
    ],
    status: 'in_progress',
    participants_count: 67320,
    target_participants: 75000,
    impact_metric_en: '32 District Rallies Organized',
    impact_metric_hi: '32 जिलों में विशाल जनसंवाद संपन्न',
    icon: 'users',
    is_featured: true,
    created_at: getPastDate(60)
  }
];

const INITIAL_NEWS: NewsBrief[] = [
  {
    id: 'news-1',
    headline_en: 'High Court Issues Crucial Notice on Recruitment Board Transparency & Answer Key Objections',
    headline_hi: 'भर्ती आयोग उत्तर कुंजी और पारदर्शिता पर उच्च न्यायालय ने जारी किया अहम नोटिस',
    source: 'Dainik Bhaskar Rajasthan',
    source_url: 'https://www.bhaskar.com/rajasthan/news',
    published_date: getPastDate(1, 4),
    category: 'Legal & Judiciary',
    importance: 'critical',
    summary_en: 'The Rajasthan High Court issued notices to state recruitment commissions regarding student petitions demanding unbiased expert committee reviews for disputed questions. The court mandated prompt resolution before final merit lists are declared.',
    summary_hi: 'राजस्थान उच्च न्यायालय ने विवादित प्रश्नों की निष्पक्ष विशेषज्ञ समिति से जांच कराने की अभ्यर्थियों की याचिका पर भर्ती संस्थाओं को नोटिस जारी किया। कोर्ट ने अंतिम मेरिट सूची से पूर्व आपत्तियों के पारदर्शी निस्तारण का निर्देश दिया है।',
    key_points_en: [
      'Notices served to commission secretaries returnable within two weeks',
      'Court observed that question ambiguity severely damages deserving rural aspirants',
      'Expert committee reports ordered to be placed transparently on the public portal'
    ],
    key_points_hi: [
      'आयोग सचिवों को दो सप्ताह में जवाब दाखिल करने का सख्त निर्देश',
      'अस्पष्ट एवं विवादित प्रश्नों से ग्रामीण मेधावी युवाओं को होने वाले नुकसान पर चिंता व्यक्त',
      'विशेषज्ञ समिति की विस्तृत रिपोर्ट आधिकारिक पोर्टल पर सार्वजनिक करने का आदेश'
    ],
    status: 'published',
    private_notes: 'Critical legal milestone; aligns directly with Satyendra Rao Youth Charter Point 4.',
    views_count: 1420,
    ai_generated: true,
    ai_provider: 'Gemini 1.5 Flash',
    approved_at: getPastDate(1, 2),
    approved_by: 'Admin Desk',
    created_at: getPastDate(1, 5)
  },
  {
    id: 'news-2',
    headline_en: 'Cabinet Sub-Committee Discusses Strict Anti-Paper Leak Law Implementation and Fast-Track Tribunals',
    headline_hi: 'मंत्रिमंडलीय उप-समिति ने नकल विरोधी कड़े कानून और फास्ट ट्रैक अदालतों के गठन पर की चर्चा',
    source: 'Press Information Bureau (PIB)',
    source_url: 'https://pib.gov.in',
    published_date: getPastDate(2, 6),
    category: 'Policy & Governance',
    importance: 'high',
    summary_en: 'A high-level state meeting deliberated on establishing dedicated fast-track courts to conclude paper leak and competitive examination malpractice cases within six months, alongside confiscation of properties belonging to organized crime cartels.',
    summary_hi: 'उच्च स्तरीय सरकारी बैठक में भर्ती परीक्षाओं में पेपर लीक और धांधली के मामलों को छह महीने में निपटाने के लिए समर्पित विशेष अदालतों के गठन और संगठित माफियाओं की संपत्ति कुर्क करने के प्रावधानों पर गहन विचार-विमर्श हुआ।',
    key_points_en: [
      'Draft guidelines proposing 10-year non-bailable imprisonment for paper leak kingpins',
      'Establishment of special cyber and surveillance units at all examination centers',
      'Strict asset attachment procedures to compensate affected genuine students'
    ],
    key_points_hi: [
      'पेपर लीक माफिया सरगनाओं के लिए 10 वर्ष के गैर-जमानती कारावास का प्रावधान प्रस्तावित',
      'सभी परीक्षा केंद्रों पर विशेष तकनीकी और सीसीटीवी निगरानी प्रकोष्ठ की स्थापना',
      'दोषियों की संपत्ति जब्त कर प्रभावित अभ्यर्थियों को परीक्षा क्षतिपूर्ति देने पर विचार'
    ],
    status: 'published',
    private_notes: 'Direct outcome of the sustained memorandums submitted during the Jaipur Youth Maha-Panchayat.',
    views_count: 2180,
    ai_generated: true,
    ai_provider: 'Gemini 1.5 Flash',
    approved_at: getPastDate(2, 3),
    approved_by: 'Admin Desk',
    created_at: getPastDate(2, 7)
  },
  {
    id: 'news-3',
    headline_en: 'Over 12,000 Vacancies Announced in Health & Technical Departments for Upcoming Session',
    headline_hi: 'आगामी सत्र के लिए चिकित्सा एवं तकनीकी संवर्गों में 12,000 से अधिक रिक्त पदों की घोषणा',
    source: 'Rajasthan Patrika',
    source_url: 'https://www.patrika.com/rajasthan-news',
    published_date: getPastDate(3, 8),
    category: 'Recruitment Notifications',
    importance: 'medium',
    summary_en: 'The state administration announced fresh recruitment guidelines for over 12,000 technical, nursing, and paramedical positions. Candidates have demanded strict adherence to the one-time registration protocol and single-window application.',
    summary_hi: 'प्रशासन ने चिकित्सा, नर्सिंग और तकनीकी संवर्गों में 12,000 से अधिक पदों पर भर्ती की प्रारंभिक रूपरेखा जारी की। युवा संगठनों ने वन-टाइम रजिस्ट्रेशन और एकल खिड़की प्रणाली से आवेदन प्रक्रिया संपन्न करने की मांग दोहराई है।',
    key_points_en: [
      'Notification anticipated within 30 days following department clearance',
      'Aspirant unions demand no surprise syllabus modifications midway',
      'Free travel passes to be extended via state roadways transport'
    ],
    key_points_hi: [
      'विभागीय स्वीकृति के पश्चात आगामी 30 दिनों में विस्तृत विज्ञप्ति संभावित',
      'युवा संघों की मांग: भर्ती प्रक्रिया के मध्य में कोई मनमाना पाठ्यक्रम परिवर्तन न हो',
      'परीक्षा दिवस पर रोडवेज बसों में परीक्षार्थियों के लिए निःशुल्क यात्रा सुविधा'
    ],
    status: 'published',
    private_notes: 'Monitor syllabus announcement closely.',
    views_count: 980,
    ai_generated: true,
    ai_provider: 'Gemini 1.5 Flash',
    approved_at: getPastDate(3, 5),
    approved_by: 'Admin Desk',
    created_at: getPastDate(3, 9)
  },
  {
    id: 'news-4',
    headline_en: 'Youth Delegation Led by Satyendra Rao Submits 10-Point Charter to Chief Secretary',
    headline_hi: 'सत्येंद्र राव के नेतृत्व में युवा प्रतिनिधिमंडल ने मुख्य सचिव को सौंपा 10-सूत्रीय युवा सुधार चार्टर',
    source: 'Navbharat Times',
    source_url: 'https://navbharattimes.indiatimes.com',
    published_date: getPastDate(4, 2),
    category: 'Youth Advocacy',
    importance: 'high',
    summary_en: 'A delegation of youth representatives led by Satyendra Rao held an extensive 2-hour dialogue with top administrative officials, presenting concrete statutory solutions for examination scheduling, candidate safety, and accountability in recruitment.',
    summary_hi: 'सत्येंद्र राव के नेतृत्व में युवा प्रतिनिधियों ने मुख्य शासन सचिवालय में वरिष्ठ अधिकारियों के साथ दो घंटे का सकारात्मक संवाद किया और भर्ती प्रक्रियाओं में पारदर्शिता, तय समय सीमा और युवा सुरक्षा हेतु 10-सूत्रीय चार्टर सौंपा।',
    key_points_en: [
      'Delegation emphasized that delay in results causes extreme psychological stress to youth',
      'Demanded independent third-party audit of computer-based examination (CBT) servers',
      'Administration assured sympathetic review and high-level scrutiny committee'
    ],
    key_points_hi: [
      'भर्ती परिणामों में अत्यधिक देरी से युवाओं पर पड़ने वाले मानसिक दबाव का उल्लेख',
      'ऑनलाइन सीबीटी परीक्षा सर्वरों के स्वतंत्र थर्ड-पार्टी तकनीकी ऑडिट की मांग',
      'सचिवालय द्वारा मांगों के सकारात्मक अध्ययन और समीक्षा का आश्वासन'
    ],
    status: 'published',
    private_notes: 'Public press release accompanied this submission.',
    views_count: 3450,
    ai_generated: true,
    ai_provider: 'Gemini 1.5 Flash',
    approved_at: getPastDate(4, 1),
    approved_by: 'Admin Desk',
    created_at: getPastDate(4, 3)
  },
  {
    id: 'news-5',
    headline_en: 'Union Public Service Commission Best Practices Study Group Formed for State Commissions',
    headline_hi: 'राज्य भर्ती आयोगों के आधुनिकीकरण हेतु यूपीएससी मॉडल अध्ययन दल का गठन',
    source: 'The Hindu National Bureau',
    source_url: 'https://www.thehindu.com',
    published_date: getPastDate(5, 5),
    category: 'Institutional Reforms',
    importance: 'general',
    summary_en: 'State recruitment leadership has formed an exploratory committee to study UPSC calendar scheduling, multi-tier security vetting of paper setters, and AI-enabled anomaly detection during examinations.',
    summary_hi: 'राज्य लोक सेवा आयोगों की कार्यप्रणाली को सुदृढ़ बनाने के लिए संघ लोक सेवा आयोग (UPSC) के वार्षिक कैलेंडर मॉडल, प्रश्नपत्र निर्माताओं के गोपनीय सत्यापन और परीक्षा केंद्रों पर तकनीक के उपयोग का अध्ययन शुरू हुआ।',
    key_points_en: [
      'UPSC strict compliance timeline cited as reference framework',
      'Evaluation of centralized biometric verification and iris scanners',
      'Draft recommendations expected to be finalized before next legislative session'
    ],
    key_points_hi: [
      'यूपीएससी की समयबद्ध कार्यप्रणाली को राज्य स्तर पर अपनाने की सिफारिश',
      'केंद्रीकृत बायोमेट्रिक और आइरिस स्कैनर के उपयोग का परीक्षण',
      'आगामी विधानसभा सत्र से पूर्व प्रारंभिक रिपोर्ट प्रस्तुत किए जाने की संभावना'
    ],
    status: 'pending_review',
    private_notes: 'Draft ready for admin review before making public.',
    views_count: 520,
    ai_generated: true,
    ai_provider: 'Gemini 1.5 Flash',
    created_at: getPastDate(5, 6)
  }
];

const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    slug: 'reforming-recruitment-exams-rajasthan-vision',
    title_en: 'Reforming Recruitment Exams in Rajasthan: Youth Voice and Our Vision',
    title_hi: 'राजस्थान में भर्ती परीक्षाओं में सुधार: युवाओं की आवाज और हमारा विजन',
    excerpt_en: 'Why millions of hardworking students deserve an uncompromised, zero-malpractice recruitment framework and our blueprint for sustainable institutional transformation.',
    excerpt_hi: 'लाखों समर्पित युवाओं का संघर्ष, परीक्षा तंत्र की कमियां और एक निष्पक्ष, पारदर्शी एवं समयबद्ध भर्ती प्रणाली की स्थापना हेतु हमारा ठोस नीतिगत रोडमैप।',
    content_en: `For over five years, our movement has walked through the dust of rural coaching hubs in Sikar, Jaipur, Kota, and Jodhpur. In small 8x8 rented rooms, sons and daughters of farmers and daily wage workers prepare for 14 hours a day with nothing but hope and grit.

When an examination paper leaks or when results are withheld in court battles for three years, it is not merely an administrative failure; it is the destruction of an entire family's generational dream.

Our vision is grounded in three uncompromising pillars:
1. Complete Transparency: From question paper printing to OMR digital archiving, every step must be auditable by independent ombudsmen.
2. Statutory 90-Day Ceiling: No recruitment process should drag on indefinitely. Ninety days from exam notification to appointment letter.
3. Decisive Criminal Accountability: Special fast-track benches to ensure organized racketeers receive swift, deterrent punishment.

This is not a political slogan; it is the constitutional right of every young citizen in this nation.`,
    content_hi: `पिछले पांच वर्षों में हमारे जनआंदोलन ने सीकर, जयपुर, कोटा और जोधपुर के छोटे-छोटे कमरों में रहकर 14-14 घंटे पढ़ाई करने वाले किसान-मजदूर के बेटे-बेटियों के संघर्ष को बहुत करीब से देखा है।

जब कोई भर्ती परीक्षा का पेपर लीक होता है या न्यायालयीन विवादों के कारण परिणाम तीन-तीन साल तक अटकते हैं, तो यह केवल एक प्रशासनिक चूक नहीं होती; यह एक पूरे परिवार के तीन पीढ़ियों के सपनों की हत्या होती है।

हमारा विजन तीन अडिग स्तंभों पर आधारित है:
1. संपूर्ण पारदर्शिता: प्रश्नपत्र निर्माण से लेकर ओएमआर डिजिटल अभिलेखीकरण तक हर प्रक्रिया का निष्पक्ष स्वतंत्र ऑडिट।
2. 90 दिनों की वैधानिक सीमा: विज्ञप्ति जारी होने से लेकर नियुक्ति पत्र देने तक अधिकतम 90 दिनों की समय-सीमा कानूनन तय हो।
3. माफियाओं पर निर्णायक प्रहार: पेपर लीक करने वाले संगठित गिरोहों के विरुद्ध विशेष फास्ट-ट्रैक कोर्ट और संपत्तियों की कुर्की।

यह कोई चुनावी वादा नहीं है, यह इस देश और प्रदेश के हर युवा का संवैधानिक हक है।`,
    author: 'Satyendra Rao',
    published_date: getPastDate(12),
    reading_time_minutes: 5,
    views_count: 4890,
    tags: ['Youth Reform', 'RPSC', 'Recruitment Policy', 'Constitutional Rights'],
    cover_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    meta_description_en: 'Satyendra Rao outlines the comprehensive reform blueprint for transparent, time-bound recruitments in Rajasthan.',
    meta_description_hi: 'सत्येंद्र राव द्वारा राजस्थान में पारदर्शी, समयबद्ध और निष्पक्ष भर्ती परीक्षाओं हेतु संपूर्ण सुधार विजन।',
    status: 'published'
  },
  {
    id: 'blog-2',
    slug: 'why-fundamental-reform-in-rpsc-rssb-is-imperative',
    title_en: 'Why Fundamental Reform in RPSC & RSSB is Imperative',
    title_hi: 'आरपीएससी और आरएसएसबी की कार्यप्रणाली में आमूलचूल बदलाव क्यों जरूरी है?',
    excerpt_en: 'An in-depth analysis of institutional bottlenecks in state recruitment commissions and structural remedies inspired by UPSC standards.',
    excerpt_hi: 'राज्य भर्ती आयोगों की संरचनात्मक कमजोरियों का विश्लेषण और संघ लोक सेवा आयोग (UPSC) के मॉडल पर आधारित अनिवार्य संस्थागत सुधार।',
    content_en: `State recruitment commissions carry the supreme responsibility of selecting the future teachers, police officers, engineers, and administrators of Rajasthan. Yet, systemic opacity has eroded public confidence.

We have presented a comprehensive reform document outlining:
1. Depoliticized Appointment of Commission Members: Instituting a search-cum-selection collegium comprising retired high court judges, university vice-chancellors, and eminent public intellectuals.
2. Digital Carbon Copies: Candidates must receive instant verifiable carbon copies of their answer sheets with unique QR codes.
3. Fixed Time-Bound Grievance Portal: An automated grievance portal where candidate objections are adjudicated within 7 days by recognized academic authorities, with reasons made publicly accessible.`,
    content_hi: `राज्य लोक सेवा आयोगों का दायित्व केवल परीक्षाएं कराना नहीं है, बल्कि प्रदेश के भावी शिक्षकों, पुलिस अधिकारियों, अभियंताओं और नीति-निर्माताओं का निष्पक्ष चयन करना है। लेकिन व्यवस्थागत अपारदर्शिता ने लाखों युवाओं के विश्वास को आहत किया है।

हमने शासन के समक्ष एक विस्तृत सुधार पत्र रखा है जिसमें प्रमुख मांगें हैं:
1. आयोग के सदस्यों की गैर-राजनीतिक नियुक्ति: उच्च न्यायालय के सेवानिवृत्त न्यायाधीशों और विख्यात शिक्षाविदों की चयन समिति द्वारा निष्पक्ष नियुक्तियां।
2. डिजिटल कार्बन प्रतियां: प्रत्येक अभ्यर्थी को उसकी ओएमआर शीट की प्रमाणित डिजिटल प्रति और क्यूआर कोड उपलब्ध कराया जाए।
3. समयबद्ध आपत्ति निवारण: छात्रों द्वारा उठाई गई आपत्तियों का 7 दिनों में विशेषज्ञ पैनल द्वारा सार्वजनिक निस्तारण।`,
    author: 'Satyendra Rao',
    published_date: getPastDate(20),
    reading_time_minutes: 6,
    views_count: 3620,
    tags: ['Institutional Reform', 'Governance', 'Youth Policy'],
    cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    meta_description_en: 'Structural institutional changes required in state recruitment bodies to restore meritocracy.',
    meta_description_hi: 'राज्य भर्ती आयोगों में मेरिट और पारदर्शिता की बहाली हेतु अनिवार्य संरचनात्मक बदलाव।',
    status: 'published'
  },
  {
    id: 'blog-3',
    slug: 'paper-leak-menace-concrete-legal-solutions',
    title_en: 'The Paper Leak Menace: Causes, Impact and Concrete Legal Solutions',
    title_hi: 'पेपर लीक की समस्या: कारण, दुष्परिणाम और स्थायी कानूनी समाधान',
    excerpt_en: 'Examining the deep nexus behind paper leak syndicates and five non-negotiable statutory safeguards to protect aspiring youth.',
    excerpt_hi: 'पेपर लीक सिंडिकेट्स की कार्यप्रणाली का पर्दाफाश और भावी पीढ़ियों के हकों की सुरक्षा हेतु पांच अपरिहार्य कानूनी सुरक्षा चक्र।',
    content_en: `Paper leak is not a petty crime; it is economic sabotage against our nation's youth. Over the past decade, recurring exam cancellations have drained millions of rupees from poor households and pushed talented youth into acute depression.

Our legal research team has drafted the 'Rajasthan Youth Examination Security Bill' which mandates:
- Asset attachment and forfeiture of private coaching institutions colluding with corrupt officials.
- State-sponsored insurance for every candidate: if an exam is cancelled due to administrative failure, candidates must receive immediate financial compensation.
- Mandatory biometric and iris authentication at all examination centers to eradicate dummy candidate impersonation.`,
    content_hi: `पेपर लीक कोई साधारण अपराध नहीं है; यह इस देश के युवाओं के भविष्य के साथ किया गया संगठित आर्थिक और मानसिक खिलवाड़ है। पिछले वर्षों में बार-बार रद्द हुई परीक्षाओं ने गरीब परिवारों की जीवन भर की जमा पूंजी बर्बाद की है।

हमारी विधिक टीम ने 'राजस्थान युवा परीक्षा सुरक्षा अधिनियम' का एक प्रारूप तैयार किया है, जिसके मुख्य बिंदु हैं:
- नकल में लिप्त निजी कोचिंग संस्थानों और कर्मचारियों की तत्काल संपत्ति कुर्की।
- प्रत्येक पंजीकृत परीक्षार्थी को परीक्षा बीमा सुरक्षा: प्रशासनिक विफलता से परीक्षा रद्द होने पर अभ्यर्थी को उचित मुआवजा।
- डमी अभ्यर्थियों की रोकथाम हेतु परीक्षा केंद्रों पर अनिवार्य बायोमेट्रिक और आइरिस सत्यापन।`,
    author: 'Satyendra Rao',
    published_date: getPastDate(28),
    reading_time_minutes: 7,
    views_count: 5120,
    tags: ['Paper Leak Law', 'Legal Safeguards', 'Youth Security'],
    cover_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    meta_description_en: 'Satyendra Rao details the concrete legal safeguards required to permanently eradicate paper leak mafias.',
    meta_description_hi: 'पेपर लीक माफियाओं के स्थायी खात्मे और युवा सुरक्षा हेतु सत्येंद्र राव के कानूनी सुझाव।',
    status: 'published'
  },
  {
    id: 'blog-4',
    slug: 'ten-point-youth-reform-charter-detailed-analysis',
    title_en: '10-Point Youth Reform Charter: A Detailed Clause-by-Clause Analysis',
    title_hi: '10-सूत्रीय युवा सुधार चार्टर: धारावार विस्तृत विश्लेषण और संवैधानिक आधार',
    excerpt_en: 'Breaking down the constitutional basis and administrative mechanisms behind the historic 10-Point Youth Reform Charter.',
    excerpt_hi: 'ऐतिहासिक 10-सूत्रीय युवा सुधार चार्टर के हर बिंदु की संवैधानिक व्याख्या, प्रशासनिक क्रियान्वयन और युवा अधिकारों का विश्लेषण।',
    content_en: `The 10-Point Youth Reform Charter was not born in bureaucratic air-conditioned corridors. It was drafted across hundreds of student meetings in Sikar, Jaipur, and Jodhpur.

Key clauses include:
1. 150 km Maximum Distance: Ensuring students, especially female candidates, do not suffer extreme travel distress.
2. Candidate Exam Insurance: A statutory guarantee of ₹5,000 compensation per student if an exam is abruptly cancelled due to state failure.
3. Independent Youth Lokpal: A 3-member ombudsman bench headed by a retired High Court judge to investigate candidate complaints with full subpoena powers.
4. OMR Digital Transparency: Public publication of raw scanned answer sheets within 48 hours of test conclusion.
5. Strict 90-Day Recruitment Schedule: Strict calendar enforcement with personal pecuniary liability on delinquent administrative officers.`,
    content_hi: `10-सूत्रीय युवा सुधार चार्टर किसी वातानुकूलित दफ्तर में नहीं बना है। यह सीकर, जयपुर और जोधपुर के छात्र संवादों में युवाओं के आंसुओं और संकल्प से उपजा जनदस्तावेज है।

प्रमुख धाराएं:
1. 150 किमी की अधिकतम दूरी: विशेषकर महिला अभ्यर्थियों को लंबी और असुरक्षित यात्राओं से मुक्ति दिलाना।
2. परीक्षार्थी बीमा सुरक्षा: सरकारी विफलता से परीक्षा रद्द होने पर प्रत्येक पंजीकृत छात्र को ₹5,000 की वैधानिक क्षतिपूर्ति।
3. स्वतंत्र युवा लोकपाल: सेवानिवृत्त उच्च न्यायालय न्यायाधीश की अध्यक्षता में 3-सदस्यीय निष्पक्ष शिकायत निवारण पीठ।
4. 48 घंटे में ओएमआर डिजिटल प्रकाशन: परीक्षा समाप्त होने के 48 घंटे में ओएमआर स्कैन प्रति सार्वजनिक करना।
5. 90 दिवसीय भर्ती कैलेंडर: भर्ती प्रक्रिया में विलंब करने वाले अधिकारियों पर व्यक्तिगत जवाबदेही और जुर्माना।`,
    author: 'Satyendra Rao',
    published_date: getPastDate(35),
    reading_time_minutes: 8,
    views_count: 6240,
    tags: ['Youth Charter', 'Candidate Rights', 'Policy Blueprint'],
    cover_image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    meta_description_en: 'Detailed clause-by-clause analysis of Satyendra Rao 10-point Youth Reform Charter.',
    meta_description_hi: 'सत्येंद्र राव के 10-सूत्रीय युवा सुधार चार्टर का संपूर्ण धारावार विश्लेषण।',
    status: 'published'
  },
  {
    id: 'blog-5',
    slug: 'mental-health-coaching-hostels-standing-with-aspirants',
    title_en: 'The Hidden Crisis: Mental Health in Coaching Hubs & Our Support Network',
    title_hi: 'प्रतियोगी छात्रों का मानसिक स्वास्थ्य: हॉस्टलों का अदृश्य संकट और स्थायी समाधान',
    excerpt_en: 'Addressing the psychological toll of exam cancellations, systemic delays, and creating a compassionate peer support infrastructure.',
    excerpt_hi: 'बार-बार परीक्षा रद्द होने से उपजे मानसिक तनाव और अवसाद का समाधान: एक संवेदनशील और सशक्त युवा सुरक्षा तंत्र की आवश्यकता।',
    content_en: `Behind every exam cancellation headline lies an unspoken human tragedy: young minds breaking under unbearable familial pressure, relentless financial strain, and an uncertain future.

Our movement has instituted 24/7 Aspirant Helpline desks in Jaipur and Kota staffed by youth volunteers and certified counselors. We firmly believe that no examination score is worth a precious human life.

We advocate for mandatory counseling cells in every coaching institute, cap on aggressive non-refundable fee exploitation, and an institutionalized culture that values merit without crushing youthful spirit.`,
    content_hi: `परीक्षा रद्द होने की हर खबर के पीछे एक अदृश्य मानवीय त्रासदी छुपी होती है: किसान पिता का कर्ज, मां की उम्मीदें और एक छोटे से कमरे में घुटता युवा का आत्मविश्वास।

हमारे आंदोलन ने जयपुर और कोटा में 24/7 छात्र हेल्पलाइन स्थापित की है, जहां अनुभवी स्वयंसेवक और परामर्शदाता छात्रों को संबल प्रदान कर रहे हैं। हमारा दृढ़ विश्वास है कि कोई भी परीक्षा किसी अनमोल जीवन से बड़ी नहीं हो सकती।

हम हर कोचिंग संस्थान में अनिवार्य काउंसलिंग सेल, शोषणकारी गैर-वापसी योग्य फीस पर नियंत्रण और छात्र-हितैषी शैक्षणिक वातावरण की कानूनी मांग कर रहे हैं।`,
    author: 'Satyendra Rao',
    published_date: getPastDate(45),
    reading_time_minutes: 5,
    views_count: 7890,
    tags: ['Student Wellness', 'Mental Health', 'Youth Mentorship'],
    cover_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    meta_description_en: 'Satyendra Rao on mental health crisis among competitive exam aspirants in coaching hubs.',
    meta_description_hi: 'प्रतियोगी छात्रों के मानसिक स्वास्थ्य और अवसाद से मुक्ति हेतु सत्येंद्र राव के विचार।',
    status: 'published'
  },
  {
    id: 'blog-6',
    slug: 'foot-march-ajmer-jaipur-peoples-movement',
    title_en: 'Grassroots Satyagraha: Milestones from the 135 km Ajmer to Jaipur Padyatra',
    title_hi: '135 किमी अजमेर-जयपुर विशाल पदयात्रा: जनसत्याग्रह के अनुभव और जनसमर्थन',
    excerpt_en: 'Reflecting on 6 days of walking under scorching sun with 10,000 youth from RPSC Ajmer to the Secretariat in Jaipur.',
    excerpt_hi: 'भीषण गर्मी में आरपीएससी अजमेर से शासन सचिवालय जयपुर तक 10,000 युवाओं के साथ 6 दिनों की ऐतिहासिक पदयात्रा का संस्मरण।',
    content_en: `When ten thousand youth walk together for 135 kilometers along National Highway 48, blisters on their feet become medals of honor.

Villagers in Kishangarh, Dudu, and Bagru came out to offer food and water to marching students, proving that our demand for corruption-free examinations is not an isolated student grievance—it is the moral conscience of our entire society.

That padyatra demonstrated to the administrative powers that when the youth of Rajasthan unite peacefully for justice, no bureaucratic wall is tall enough to resist the truth.`,
    content_hi: `जब 10,000 युवा नेशनल हाइवे 48 पर 135 किलोमीटर एक साथ कदम से कदम मिलाकर चलते हैं, तो पैरों के छाले सम्मान का पदक बन जाते हैं।

किशनगढ़, दूदू और बगरू के ग्रामीणों ने सड़कों पर आकर पदयात्रियों को जल और भोजन कराया, जिससे यह सिद्ध हुआ कि भ्रष्टाचार-मुक्त परीक्षाओं की मांग केवल छात्रों की नहीं, बल्कि समूचे समाज की नैतिक अंतरात्मा की आवाज है।

उस पदयात्रा ने प्रशासनिक शक्ति को यह दिखा दिया कि जब युवा शांतिपूर्ण सत्याग्रह पर उतरता है, तो सच्चाई के सामने कोई भी तानाशाही नहीं टिक सकती।`,
    author: 'Satyendra Rao',
    published_date: getPastDate(60),
    reading_time_minutes: 6,
    views_count: 9430,
    tags: ['Padyatra', 'Grassroots Movement', 'Public Unity'],
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    meta_description_en: 'Memoirs from the 135 km peaceful satyagraha march from Ajmer to Jaipur for youth rights.',
    meta_description_hi: 'अजमेर से जयपुर 135 किमी पदयात्रा के प्रेरणादायक अनुभव और युवा शक्ति की विजय।',
    status: 'published'
  }
];

const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    video_id: 'jNQXAC9IVRw',
    title_en: 'Satyendra Rao Addresses 50,000 Youth at Jaipur Maha-Panchayat',
    title_hi: 'जयपुर महापंचायत में 50,000 युवाओं को सत्येंद्र राव का ऐतिहासिक संबोधन',
    description_en: 'A powerful address calling for immediate institutional accountability, time-bound recruitments, and legal guarantees for youth.',
    description_hi: 'भर्ती संस्थाओं में जवाबदेही, तय समय सीमा और युवाओं के अधिकारों की कानूनी गारंटी पर ऐतिहासिक उद्बोधन।',
    thumbnail_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    duration: '18:45',
    views_count: 142000,
    published_date: getPastDate(15),
    category: 'Speeches'
  },
  {
    id: 'yt-2',
    video_id: 'M7lc1UVf-VE',
    title_en: 'SI Exam Irregularities Exposed: Evidence and Demand for Re-Exam',
    title_hi: 'SI भर्ती परीक्षा में धांधली का खुलासा और पारदर्शी पुनः परीक्षा की मांग',
    description_en: 'Detailed press briefing highlighting documented irregularities and calling for fair opportunity for genuine candidates.',
    description_hi: 'तथ्यों और साक्ष्यों के साथ प्रेस वार्ता: योग्य अभ्यर्थियों के न्याय हेतु पुनः परीक्षा की पुरजोर मांग।',
    thumbnail_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    duration: '24:10',
    views_count: 98500,
    published_date: getPastDate(25),
    category: 'Investigations'
  },
  {
    id: 'yt-3',
    video_id: '7ghhRHRP6t4',
    title_en: 'Foot March (Padyatra) from Ajmer to Jaipur: Highlights & Voices of Youth',
    title_hi: 'अजमेर से जयपुर विशाल पदयात्रा: युवाओं के संकल्प और संघर्ष की झलकियां',
    description_en: 'Over 10,000 students walked 135 km with Satyendra Rao to demand youth reform charter implementation.',
    description_hi: '10,000 से अधिक युवाओं के साथ 135 किमी की ऐतिहासिक पदयात्रा का प्रेरणादायक वृत्तचित्र।',
    thumbnail_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    duration: '14:20',
    views_count: 86400,
    published_date: getPastDate(35),
    category: 'Documentary'
  },
  {
    id: 'yt-4',
    video_id: 'dQw4w9WgXcQ',
    title_en: 'Youth Reform Charter Explained: 10 Actionable Policy Demands',
    title_hi: 'युवा सुधार चार्टर: युवाओं के हकों की कानूनी गारंटी के 10 मुख्य बिंदु',
    description_en: 'Explaining how the 10-point Youth Reform Charter guarantees transparent, time-bound examinations for every student.',
    description_hi: 'सत्येंद्र राव द्वारा 10-सूत्रीय युवा सुधार चार्टर के हर बिंदु की सरल एवं प्रभावी व्याख्या।',
    thumbnail_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    duration: '12:35',
    views_count: 65200,
    published_date: getPastDate(42),
    category: 'Policy Explained'
  },
  {
    id: 'yt-5',
    video_id: 'kJQP7kiw5Fk',
    title_en: 'Press Conference on High Court Verdict & OMR Digital Archiving',
    title_hi: 'उच्च न्यायालय के ऐतिहासिक निर्णय पर प्रेस वार्ता: ओएमआर डिजिटल सुरक्षा',
    description_en: 'Media briefing following the High Court order on mandatory carbon copy disclosures and security protocols.',
    description_hi: 'ओएमआर डिजिटल कार्बन कॉपी और परीक्षा केंद्रों पर बायोमेट्रिक सुरक्षा पर उच्च न्यायालय के निर्णय पर प्रेस ब्रीफिंग।',
    thumbnail_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    duration: '21:15',
    views_count: 54100,
    published_date: getPastDate(48),
    category: 'Press Conference'
  },
  {
    id: 'yt-6',
    video_id: 'aqz-KE-bpKQ',
    title_en: 'Ground Reality of Coaching Hubs: Direct Interaction with Aspirants',
    title_hi: 'कोचिंग हब की जमीनी हकीकत: प्रतियोगी छात्रों से सीधा संवाद और समाधान',
    description_en: 'Visiting student rooms in Sikar and Kota to understand day-to-day challenges, hostel rent exploitation and mental wellness.',
    description_hi: 'सीकर और कोटा के कमरों में रहकर छात्रों के दैनिक संघर्ष, मानसिक तनाव और छात्र-कल्याण नीतियों पर खुली बातचीत।',
    thumbnail_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    duration: '16:50',
    views_count: 72300,
    published_date: getPastDate(55),
    category: 'Student Townhalls'
  }
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-1',
    full_name: 'Rahul Sharma',
    phone: '+91 98290 12345',
    email: 'rahul.sharma@example.com',
    state: 'Rajasthan',
    district: 'Jaipur',
    occupation: 'Law Student / Youth Advocate',
    skills_interests: ['Legal Research', 'District Coordination', 'Public Speaking'],
    preferred_role: 'District Youth Coordinator',
    message: 'Deeply inspired by Satyendra Rao ji. Ready to lead youth outreach in Jaipur colleges.',
    status: 'active',
    notes: 'Spearheaded college rally delegation on Nov 10.',
    created_at: getPastDate(14)
  },
  {
    id: 'vol-2',
    full_name: 'Pooja Choudhary',
    phone: '+91 94140 56789',
    email: 'pooja.choudhary@example.com',
    state: 'Rajasthan',
    district: 'Jodhpur',
    occupation: 'Teacher Aspirant',
    skills_interests: ['Social Media & Digital Outreach', 'Content Creation'],
    preferred_role: 'Digital Media Volunteer',
    message: 'Want to ensure recruitment updates reach every girl aspirant in western Rajasthan.',
    status: 'active',
    notes: 'Managing WhatsApp student broadcast group.',
    created_at: getPastDate(12)
  },
  {
    id: 'vol-3',
    full_name: 'Vikram Singh Rathore',
    phone: '+91 97840 98765',
    email: 'vikram.singh@example.com',
    state: 'Rajasthan',
    district: 'Kota',
    occupation: 'Engineering Graduate',
    skills_interests: ['Event Management', 'Ground Mobilization'],
    preferred_role: 'Camp & Rally Logistics Coordinator',
    message: 'Organized volunteer team of 40 students during Kota student meet.',
    status: 'contacted',
    notes: 'Assigned to university coordinator role.',
    created_at: getPastDate(8)
  },
  {
    id: 'vol-4',
    full_name: 'Anita Meena',
    phone: '+91 96100 45678',
    email: 'anita.meena@example.com',
    state: 'Rajasthan',
    district: 'Udaipur',
    occupation: 'Postgraduate Student',
    skills_interests: ['Documentation', 'Grievance Collection'],
    preferred_role: 'Student Grievance Cell Volunteer',
    message: 'Helping aspirants document irregularities and submit petitions.',
    status: 'new',
    created_at: getPastDate(3)
  },
  {
    id: 'vol-5',
    full_name: 'Suresh Gurjar',
    phone: '+91 98870 34567',
    email: 'suresh.gurjar@example.com',
    state: 'Rajasthan',
    district: 'Alwar',
    occupation: 'Competitive Exam Aspirant',
    skills_interests: ['Ground Mobilization', 'Flyer Distribution'],
    preferred_role: 'Tehsil Level Mobilizer',
    message: 'Committed to uniting youth across rural Alwar for the movement.',
    status: 'active',
    created_at: getPastDate(6)
  }
];

const INITIAL_SETTINGS: AppSettings = {
  ai_provider: 'gemini',
  gemini_model: 'gemini-1.5-flash',
  gemini_api_key: process.env.GEMINI_API_KEY || '',
  openai_api_key: process.env.OPENAI_API_KEY || '',
  rss_feeds: [
    {
      id: 'feed-1',
      name: 'Press Information Bureau (PIB) Rajasthan',
      url: 'https://pib.gov.in/RssMain.aspx?ModId=6&LangId=2',
      category: 'Policy & Governance',
      language: 'hi',
      enabled: true
    },
    {
      id: 'feed-2',
      name: 'DD News National & Education',
      url: 'https://ddnews.gov.in/feed/',
      category: 'Education & Youth',
      language: 'mixed',
      enabled: true
    },
    {
      id: 'feed-3',
      name: 'Google News - Rajasthan Recruitment & Exams',
      url: 'https://news.google.com/rss/search?q=Rajasthan+recruitment+exam+RPSC+RSSB&hl=en-IN&gl=IN&ceid=IN:en',
      category: 'Recruitment Exams',
      language: 'en',
      enabled: true
    }
  ],
  auto_fetch_interval_minutes: 360,
  require_admin_approval: true,
  last_fetched_at: getPastDate(1, 4),
  leader_name_hi: 'सत्येंद्र राव',
  leader_name_en: 'Satyendra Rao',
  leader_title_hi: 'संयोजक • युवा सुधार आंदोलन',
  leader_title_en: 'Convener • Youth Reform Movement',
  leader_bio_hi: 'राजस्थान के लाखों प्रतियोगी छात्रों के संवैधानिक अधिकारों, परीक्षा पारदर्शिता और 90 दिवसीय भर्ती समय-सीमा हेतु समर्पित जनआंदोलन।',
  leader_bio_en: 'Grassroots satyagraha fighting for candidate rights, 90-day recruitment ceiling, and exam transparency in Rajasthan.',
  youtube_channel_url: 'https://www.youtube.com/results?search_query=Satyendra+Rao',
  whatsapp_number: '+91 98290 12345',
  whatsapp_group_url: 'https://chat.whatsapp.com/invite/SatyendraRaoYouth',
  telegram_group_url: 'https://t.me/SatyendraRaoOfficial',
  contact_email: 'contact@satyendrarao.in',
  contact_phone: '+91 98290 12345',
  office_address: 'Youth Reform Movement Secretariat, Civil Lines, Jaipur, Rajasthan 302006'
};

// Seed realistic analytics history for the past 90 days
function generateSeedAnalytics(): { views: PageView[]; events: AnalyticsEvent[] } {
  const views: PageView[] = [];
  const events: AnalyticsEvent[] = [];
  const paths = [
    { path: '/', title: 'Home | Satyendra Rao' },
    { path: '/campaigns', title: 'Key Campaigns | Satyendra Rao' },
    { path: '/charter', title: 'Youth Reform Charter | Satyendra Rao' },
    { path: '/news', title: 'Daily News Briefing | Satyendra Rao' },
    { path: '/about', title: 'About Satyendra Rao' },
    { path: '/blog', title: 'Blog & Articles | Satyendra Rao' },
    { path: '/media', title: 'Media & Videos | Satyendra Rao' },
    { path: '/volunteer', title: 'Join the Movement | Satyendra Rao' }
  ];

  const devices: ('mobile' | 'desktop' | 'tablet')[] = ['mobile', 'mobile', 'mobile', 'desktop', 'desktop', 'tablet'];
  const eventTypes: AnalyticsEvent['event_type'][] = [
    'page_view', 'page_view', 'video_watch', 'campaign_click', 'news_read', 'volunteer_submit', 'charter_download'
  ];

  let idCounter = 1;

  // Generate for past 90 days with natural weekly cycles and growing trend
  for (let d = 89; d >= 0; d--) {
    const dayOfWeek = (90 - d) % 7;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    // Growth factor over 90 days: from ~35 views/day to ~180 views/day
    const growth = 1 + (90 - d) / 45;
    const dailyBase = Math.floor((isWeekend ? 45 : 30) * growth);
    
    for (let i = 0; i < dailyBase; i++) {
      const p = paths[Math.floor(Math.random() * paths.length)];
      const dev = devices[Math.floor(Math.random() * devices.length)];
      const hour = Math.floor(Math.random() * 24);
      const min = Math.floor(Math.random() * 60);
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - d);
      dateObj.setHours(hour, min, 0, 0);
      const dateIso = dateObj.toISOString();
      const visitorId = `visitor-${(idCounter % 450) + 1}`;
      const sessionId = `session-${d}-${Math.floor(i / 3)}`;

      views.push({
        id: `pv-${idCounter}`,
        path: p.path,
        title: p.title,
        visitor_id: visitorId,
        session_id: sessionId,
        referrer: i % 3 === 0 ? 'https://google.com' : i % 5 === 0 ? 'https://twitter.com' : 'direct',
        user_agent: 'Mozilla/5.0 Browser',
        device_type: dev,
        language: i % 4 === 0 ? 'en' : 'hi',
        created_at: dateIso
      });

      if (i % 2 === 0) {
        const evType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        events.push({
          id: `ev-${idCounter}`,
          event_type: evType,
          path: p.path,
          visitor_id: visitorId,
          metadata: { device: dev },
          created_at: dateIso
        });
      }

      idCounter++;
    }
  }

  return { views, events };
}

// In-memory + file-backed storage
let dbState: DatabaseState | null = null;

export function getDatabase(): DatabaseState {
  if (dbState) return dbState;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      dbState = JSON.parse(fileData);
      return dbState!;
    }
  } catch (err) {
    console.error('Error reading db.json, generating seed data:', err);
  }

  // Initialize fresh seed data
  const { views, events } = generateSeedAnalytics();
  dbState = {
    page_views: views,
    analytics_events: events,
    news_briefs: INITIAL_NEWS,
    campaigns: INITIAL_CAMPAIGNS,
    blogs: INITIAL_BLOGS,
    volunteers: INITIAL_VOLUNTEERS,
    youtube_videos: INITIAL_VIDEOS,
    settings: INITIAL_SETTINGS
  };

  saveDatabase(dbState);
  return dbState;
}

export function saveDatabase(data: DatabaseState): void {
  dbState = data;
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

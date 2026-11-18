// End-to-end automated API and page verification script
async function runTests() {
  const BASE_URL = 'http://127.0.0.1:3000';
  console.log(`Starting automated verification on ${BASE_URL}...\n`);

  const results = [];

  async function check(name, testFn) {
    try {
      const res = await testFn();
      console.log(`✅ [PASS] ${name}`);
      results.push({ name, passed: true, details: res });
    } catch (e) {
      console.error(`❌ [FAIL] ${name}:`, e.message);
      results.push({ name, passed: false, error: e.message });
    }
  }

  // 1. Homepage Route
  await check('Homepage (GET /)', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('सत्येंद्र राव') && !text.includes('Satyendra Rao')) {
      throw new Error('Missing Satyendra Rao branding');
    }
    if (!text.includes('एक सतत जनआंदोलन')) {
      throw new Error('Missing hero highlight pill');
    }
    return `OK - ${text.length} bytes`;
  });

  // 2. Real Analytics Ingestion (POST /api/analytics/track)
  await check('Real Analytics Ingestion (POST /api/analytics/track)', async () => {
    const res = await fetch(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        path: '/test-verification',
        visitor_id: 'test-visitor-101',
        session_id: 'test-session-101',
        device_type: 'desktop',
        language: 'hi'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.ok) throw new Error('Response did not indicate ok');
    return 'Tracked successfully';
  });

  // 3. Analytics Stats API with 30d range
  await check('Analytics Stats - 30 Days (GET /api/analytics/stats?range=30d)', async () => {
    const res = await fetch(`${BASE_URL}/api/analytics/stats?range=30d`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (typeof data.totalVisitors !== 'number') throw new Error('totalVisitors missing');
    if (!Array.isArray(data.trafficTrends) || data.trafficTrends.length === 0) throw new Error('trafficTrends missing');
    if (!Array.isArray(data.mostVisitedPages)) throw new Error('mostVisitedPages missing');
    return `Visitors: ${data.totalVisitors}, PageViews: ${data.totalPageViews}, Trend Points: ${data.trafficTrends.length}`;
  });

  // 4. Analytics Stats API with Date Filters (Today, 7d, 90d, custom)
  await check('Analytics Date Range Filtering (Today, 7d, 90d)', async () => {
    const res7d = await fetch(`${BASE_URL}/api/analytics/stats?range=7d`);
    const data7d = await res7d.json();

    const res90d = await fetch(`${BASE_URL}/api/analytics/stats?range=90d`);
    const data90d = await res90d.json();

    if (data7d.totalPageViews > data90d.totalPageViews) {
      throw new Error('7d views should be less than or equal to 90d views');
    }
    return `7d Views: ${data7d.totalPageViews} vs 90d Views: ${data90d.totalPageViews}`;
  });

  // 5. News Briefings API (GET /api/news)
  await check('News Briefings List (GET /api/news)', async () => {
    const res = await fetch(`${BASE_URL}/api/news?status=published`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) throw new Error('No news items found');
    const first = items[0];
    if (!first.headline_en || !first.headline_hi) throw new Error('Bilingual headlines missing');
    if (!first.summary_en || !first.summary_hi) throw new Error('Bilingual summaries missing');
    return `Fetched ${items.length} published news briefs with bilingual content`;
  });

  // 6. AI Summarize API (POST /api/ai/summarize)
  await check('AI Summarize API (POST /api/ai/summarize)', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        headline: 'Rajasthan High Court Orders Review of Disputed Exam Questions',
        source: 'Court Reporter Bureau',
        description: 'The high court directed that an independent expert committee must verify disputed questions in competitive examinations before final result declaration to protect candidate rights.',
        sourceUrl: 'https://example.com/high-court-notice'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.summary_en || !data.summary_hi) throw new Error('AI summary generation failed');
    if (!data.category || !data.importance) throw new Error('Classification missing');
    return `AI Engine: ${data.ai_provider}, Category: ${data.category}, Importance: ${data.importance}`;
  });

  // 7. AI Assistant Actions (Social Captions & Blog Topics)
  await check('AI Assistant Actions (POST /api/ai/assistant)', async () => {
    const resCaptions = await fetch(`${BASE_URL}/api/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'social_captions',
        headline: 'भर्ती परीक्षाओं में जवाबदेही हेतु छात्र सत्याग्रह',
        summary: 'सत्येंद्र राव के नेतृत्व में 10-सूत्रीय चार्टर प्रस्तुत किया गया।',
        sourceUrl: 'https://satyendrarao.in'
      })
    });
    const captions = await resCaptions.json();
    if (!captions.twitter_x || !captions.whatsapp_broadcast) throw new Error('Captions failed');

    const resTopics = await fetch(`${BASE_URL}/api/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'blog_topics',
        headline: 'RPSC Reforms Discussion',
        summary: 'Committee deliberating on transparent answer keys and annual calendar.'
      })
    });
    const topics = await resTopics.json();
    if (!Array.isArray(topics) || topics.length === 0) throw new Error('Blog topics failed');

    return `Social Captions OK (${captions.twitter_x.slice(0, 30)}...), Blog Topics Suggested: ${topics.length}`;
  });

  // 8. Campaigns API (GET /api/campaigns)
  await check('Bilingual Campaigns (GET /api/campaigns)', async () => {
    const res = await fetch(`${BASE_URL}/api/campaigns`);
    const campaigns = await res.json();
    if (!Array.isArray(campaigns) || campaigns.length === 0) throw new Error('No campaigns');
    const first = campaigns[0];
    if (!first.title_en || !first.title_hi || !first.demands_hi) throw new Error('Bilingual campaign fields missing');
    return `Found ${campaigns.length} campaigns. Top: "${first.title_hi}" (${first.participants_count.toLocaleString()} participants)`;
  });

  // 9. Volunteer Registration API (POST /api/volunteers)
  await check('Volunteer Registration (POST /api/volunteers)', async () => {
    const res = await fetch(`${BASE_URL}/api/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Devendra Kumar Verma',
        phone: '+91 98280 99999',
        email: 'devendra.verma@example.com',
        state: 'Rajasthan',
        district: 'Sikar',
        occupation: 'Aspirant & Student Leader',
        preferred_role: 'District Youth Coordinator',
        message: 'Ready to mobilize 200 college students in Sikar for the Youth Charter.'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const vol = await res.json();
    if (!vol.id || vol.status !== 'new') throw new Error('Volunteer creation error');
    return `Registered ID: ${vol.id}, Name: ${vol.full_name}, District: ${vol.district}`;
  });

  // 10. Public Pages Accessibility
  const publicPages = ['/about', '/campaigns', '/charter', '/news', '/media', '/blog', '/volunteer'];
  for (const page of publicPages) {
    await check(`Public Page (GET ${page})`, async () => {
      const res = await fetch(`${BASE_URL}${page}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return `Status ${res.status}`;
    });
  }

  // 11. Admin Pages Accessibility
  const adminPages = ['/admin', '/admin/analytics', '/admin/news', '/admin/campaigns', '/admin/blogs', '/admin/volunteers', '/admin/settings'];
  for (const page of adminPages) {
    await check(`Admin Page (GET ${page})`, async () => {
      const res = await fetch(`${BASE_URL}${page}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return `Status ${res.status}`;
    });
  }

  console.log('\n===========================================');
  console.log(`VERIFICATION SUMMARY: ${results.filter(r => r.passed).length}/${results.length} Tests Passed`);
  console.log('===========================================');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

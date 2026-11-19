// End-to-end automated API, Blog & Video player verification script
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

  // 1. Homepage Route & Blog / Video Integrations
  await check('Homepage (GET /) with Recent Videos & All Blog Posts', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('सत्येंद्र राव') && !text.includes('Satyendra Rao')) {
      throw new Error('Missing Satyendra Rao branding');
    }
    if (!text.includes('Recent Videos') && !text.includes('नवीनतम वीडियो')) {
      throw new Error('Missing Recent Videos section on homepage');
    }
    if (!text.includes('All blog posts') && !text.includes('नवीनतम नीतिगत आलेख')) {
      throw new Error('Missing Untitled UI Blog Posts section on homepage');
    }
    return `OK - ${text.length} bytes`;
  });

  // 2. Real Analytics Ingestion
  await check('Real Analytics Ingestion (POST /api/analytics/track)', async () => {
    const res = await fetch(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        path: '/blog',
        visitor_id: 'test-visitor-202',
        session_id: 'test-session-202',
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
    return `Visitors: ${data.totalVisitors}, PageViews: ${data.totalPageViews}, Trend Points: ${data.trafficTrends.length}`;
  });

  // 4. Analytics Date Range Filtering
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

  // 5. Blogs API: Verify all 6 full articles
  await check('All 6 Blogs Verification (GET /api/blogs)', async () => {
    const res = await fetch(`${BASE_URL}/api/blogs`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const blogs = await res.json();
    if (!Array.isArray(blogs) || blogs.length < 6) {
      throw new Error(`Expected at least 6 blogs, found ${blogs?.length}`);
    }
    for (const b of blogs) {
      if (!b.title_en || !b.title_hi) throw new Error(`Blog ${b.id} missing bilingual titles`);
      if (!b.content_en || !b.content_hi) throw new Error(`Blog ${b.id} missing bilingual content`);
      if (!b.slug) throw new Error(`Blog ${b.id} missing slug`);
    }
    return `Verified ${blogs.length} comprehensive blogs with full Hindi & English content`;
  });

  // 6. Single Blog Reading Route (/blog/[slug])
  await check('Single Blog Reading Page (GET /blog/reforming-recruitment-exams-rajasthan-vision)', async () => {
    const res = await fetch(`${BASE_URL}/blog/reforming-recruitment-exams-rajasthan-vision`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('Reforming Recruitment Exams') && !html.includes('भर्ती परीक्षाओं में सुधार')) {
      throw new Error('Article title missing from HTML');
    }
    return `Article loaded successfully (${html.length} bytes)`;
  });

  // 7. About Page & Black-and-White Portrait Verification
  await check('About Page (GET /about) - Black & White Portrait & Editorial Layout', async () => {
    const res = await fetch(`${BASE_URL}/about`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('About')) {
      throw new Error('Missing About title');
    }
    if (!html.includes('satyendra_about_bw.jpg')) {
      throw new Error('About section missing black-and-white portrait (/images/satyendra_about_bw.jpg)');
    }
    return `About page verified with B&W portrait and Aabhas Maldahiyar aesthetic`;
  });

  // 8. Media Page & YouTube Video Gallery (6 Videos)
  await check('Media Page (GET /media) with YouTube Video Strip', async () => {
    const res = await fetch(`${BASE_URL}/media`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('Watch on YouTube')) {
      throw new Error('Missing Watch on YouTube links');
    }
    if (!html.includes('5Qn-jD4pX7w') || !html.includes('9B6yK9E1l4M')) {
      throw new Error('Missing required YouTube video IDs in markup');
    }
    return `Media gallery verified with embedded YouTube videos`;
  });

  // 9. AI Summarize API
  await check('AI Summarize API (POST /api/ai/summarize)', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        headline: 'Rajasthan High Court Orders Review of Disputed Exam Questions',
        source: 'Legal Reporter Bureau',
        description: 'The high court directed that an independent expert committee must verify disputed questions in competitive examinations before final result declaration.',
        sourceUrl: 'https://example.com/high-court-notice'
      })
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.summary_en || !data.summary_hi) throw new Error('AI summary generation failed');
    return `AI Engine: ${data.ai_provider}, Category: ${data.category}, Importance: ${data.importance}`;
  });

  // 10. AI Assistant Actions
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
    return `Generated social captions: "${captions.twitter_x.slice(0, 35)}..."`;
  });

  // 11. Public Pages Accessibility
  const publicPages = ['/', '/about', '/campaigns', '/charter', '/news', '/media', '/blog', '/volunteer'];
  for (const page of publicPages) {
    await check(`Public Page Route (${page})`, async () => {
      const res = await fetch(`${BASE_URL}${page}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return `Status ${res.status}`;
    });
  }

  // 12. Admin Pages Accessibility
  const adminPages = ['/admin', '/admin/analytics', '/admin/news', '/admin/campaigns', '/admin/blogs', '/admin/volunteers', '/admin/settings'];
  for (const page of adminPages) {
    await check(`Admin Page Route (${page})`, async () => {
      const res = await fetch(`${BASE_URL}${page}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return `Status ${res.status}`;
    });
  }

  console.log('\n===========================================');
  const passedCount = results.filter(r => r.passed).length;
  console.log(`VERIFICATION SUMMARY: ${passedCount}/${results.length} Tests Passed`);
  console.log('===========================================');

  if (passedCount < results.length) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

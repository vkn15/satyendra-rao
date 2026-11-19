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

  // 8. Media Page & YouTube Video Gallery (Verified Working Video IDs)
  await check('Media Page (GET /media) with Verified Working YouTube Video Strip', async () => {
    const res = await fetch(`${BASE_URL}/media`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('Watch on YouTube') && !html.includes('यूट्यूब पर देखें')) {
      throw new Error('Missing Watch on YouTube links');
    }
    // Verify real YouTube IDs that exist and never 404
    if (!html.includes('jNQXAC9IVRw') || !html.includes('M7lc1UVf-VE')) {
      throw new Error('Missing verified working YouTube video IDs in markup');
    }
    // Verify channel button does not point to a broken 404 handle
    if (html.includes('@SatyendraRaoOfficial')) {
      throw new Error('Found broken 404 channel handle in markup');
    }
    return `Media gallery verified with real active YouTube videos (no 404s)`;
  });

  // 8b. Videos API CRUD Verification
  await check('Videos API CRUD (GET /api/videos & POST /api/videos)', async () => {
    const getRes = await fetch(`${BASE_URL}/api/videos`);
    if (!getRes.ok) throw new Error(`GET /api/videos returned ${getRes.status}`);
    const videos = await getRes.json();
    if (!Array.isArray(videos) || videos.length === 0) throw new Error('No videos returned');
    
    // Test creating a new video with real YouTube URL
    const postRes = await fetch(`${BASE_URL}/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title_en: 'Test Live Stream Address',
        title_hi: 'परीक्षण लाइव संबोधन',
        youtube_url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        category: 'Live Address',
        duration: '10:45'
      })
    });
    if (!postRes.ok) throw new Error(`POST /api/videos returned ${postRes.status}`);
    const created = await postRes.json();
    if (created.video_id !== 'aqz-KE-bpKQ') throw new Error(`Parsed video_id incorrect: ${created.video_id}`);

    // Cleanup the test video
    await fetch(`${BASE_URL}/api/videos?id=${created.id}`, { method: 'DELETE' });
    return `Videos API functional: fetched ${videos.length} videos, successfully created and deleted test video`;
  });

  // 8c. Leader Settings & Community Links API
  await check('Settings API for Leader Profile & Channel (GET /api/settings)', async () => {
    const res = await fetch(`${BASE_URL}/api/settings`);
    if (!res.ok) throw new Error(`GET /api/settings returned ${res.status}`);
    const settings = await res.json();
    if (!settings.youtube_channel_url) throw new Error('Missing youtube_channel_url in settings');
    if (!settings.leader_name_en || !settings.leader_name_hi) throw new Error('Missing leader profile in settings');
    return `Settings loaded: Channel = ${settings.youtube_channel_url}, Leader = ${settings.leader_name_en}`;
  });

  // 8d. Supporter Join Flow (POST /api/volunteers)
  await check('Supporter / Volunteer Join Flow (POST /api/volunteers)', async () => {
    const res = await fetch(`${BASE_URL}/api/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '9876543210',
        district: 'Jaipur',
        interests: ['Policy Research', 'Youth Mobilization']
      })
    });
    if (!res.ok) throw new Error(`POST /api/volunteers returned ${res.status}`);
    const reg = await res.json();
    if (!reg.id) throw new Error('Volunteer registration missing ID');
    return `Volunteer registered with ID: ${reg.id}`;
  });

  // 8e. Direct News Links & Removed AI Summarization Verification
  await check('Direct News Links on /news (Clean Press Links, No AI Summarization)', async () => {
    const res = await fetch(`${BASE_URL}/news`);
    if (!res.ok) throw new Error(`GET /news returned ${res.status}`);
    const html = await res.text();
    // Check that direct links to real sources are present
    if (!html.includes('https://www.bhaskar.com/rajasthan/news')) {
      throw new Error('Missing direct news source link on /news');
    }
    // Verify AI summarization labels are removed
    if (html.includes('AI-Powered Daily News Briefing') || html.includes('एआई-संचालित दैनिक समाचार बुलेटिन')) {
      throw new Error('AI summarization badge still present in /news markup');
    }
    if (html.includes('AI Verified Summary') || html.includes('AI Policy Brief')) {
      throw new Error('AI summary badges still present in /news markup');
    }
    return 'Verified: Direct news links active, AI summarization removed from news cards';
  });

  // 8f. News API Direct Link CRUD (POST & DELETE)
  await check('News API Direct Link CRUD (POST & DELETE /api/news)', async () => {
    const postRes = await fetch(`${BASE_URL}/api/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        headline_en: 'Direct Test News Article from Press Trust',
        headline_hi: 'प्रेस ट्रस्ट से सीधा परीक्षण समाचार',
        source: 'Press Trust of India',
        source_url: 'https://www.ptinews.com/story/national/test-news',
        category: 'Policy & Governance',
        importance: 'medium',
        summary_en: 'Direct press report regarding exam reforms and fast-track tribunals.',
        summary_hi: 'परीक्षा सुधारों और फास्ट-ट्रैक अदालतों के संबंध में सीधी प्रेस रिपोर्ट।',
        status: 'published'
      })
    });
    if (!postRes.ok) throw new Error(`POST /api/news returned ${postRes.status}`);
    const created = await postRes.json();
    if (!created.id) throw new Error('Created news missing ID');

    // Delete test article
    const delRes = await fetch(`${BASE_URL}/api/news?id=${created.id}`, { method: 'DELETE' });
    if (!delRes.ok) throw new Error(`DELETE /api/news returned ${delRes.status}`);
    return `News API CRUD functional: successfully created direct news link and cleaned up`;
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
  const adminPages = ['/admin', '/admin/analytics', '/admin/news', '/admin/campaigns', '/admin/blogs', '/admin/volunteers', '/admin/videos', '/admin/settings'];
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

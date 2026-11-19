import Parser from 'rss-parser';
import { getAppSettings, createNewsBrief, getNewsBriefs } from './db';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'SatyendraRaoYouthPortal/1.0 (Public Policy Briefing)'
  }
});

export interface FetchFeedResult {
  sourceName: string;
  articlesProcessed: number;
  newArticlesAdded: number;
  errors: string[];
}

export async function fetchAndSummarizeFeeds(): Promise<{
  success: boolean;
  results: FetchFeedResult[];
  totalNew: number;
}> {
  const settings = await getAppSettings();
  const enabledFeeds = settings.rss_feeds.filter(f => f.enabled);
  const existingBriefs = await getNewsBriefs();
  const existingUrls = new Set(existingBriefs.map(b => b.source_url.toLowerCase().trim()));
  const existingTitles = new Set(existingBriefs.map(b => b.headline_en.toLowerCase().trim()));

  const results: FetchFeedResult[] = [];
  let totalNew = 0;

  for (const feed of enabledFeeds) {
    const feedResult: FetchFeedResult = {
      sourceName: feed.name,
      articlesProcessed: 0,
      newArticlesAdded: 0,
      errors: []
    };

    try {
      const feedData = await parser.parseURL(feed.url);
      const items = feedData.items.slice(0, 5); // Process up to 5 latest items per feed

      for (const item of items) {
        if (!item.title || !item.link) continue;
        feedResult.articlesProcessed++;

        const cleanUrl = item.link.toLowerCase().trim();
        const cleanTitle = item.title.toLowerCase().trim();

        if (existingUrls.has(cleanUrl) || existingTitles.has(cleanTitle)) {
          continue; // Already processed
        }

        // Direct news processing (no AI summarization required)
        const rawDescription = item.contentSnippet || item.summary || item.content || item.title || '';
        const cleanDesc = rawDescription.replace(/<[^>]*>?/gm, '').trim().slice(0, 320);

        const status = settings.require_admin_approval ? 'pending_review' : 'published';

        await createNewsBrief({
          headline_en: item.title,
          headline_hi: item.title,
          source: feed.name,
          source_url: item.link,
          published_date: item.isoDate || item.pubDate || new Date().toISOString(),
          category: 'Policy & Governance',
          importance: 'medium',
          summary_en: cleanDesc,
          summary_hi: cleanDesc,
          status,
          private_notes: `Direct feed link from ${feed.name}`,
          ai_generated: false,
          approved_at: status === 'published' ? new Date().toISOString() : undefined,
          approved_by: status === 'published' ? 'Auto Rule' : undefined
        });

        existingUrls.add(cleanUrl);
        feedResult.newArticlesAdded++;
        totalNew++;
      }
    } catch (err: any) {
      feedResult.errors.push(err.message || 'Error parsing RSS feed');
    }

    results.push(feedResult);
  }

  return {
    success: true,
    results,
    totalNew
  };
}

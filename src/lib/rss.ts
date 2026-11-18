import Parser from 'rss-parser';
import { getAppSettings, createNewsBrief, getNewsBriefs } from './db';
import { summarizeNewsArticle } from './ai';

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

        // Summarize using AI
        const summaryResult = await summarizeNewsArticle({
          headline: item.title,
          source: feed.name,
          description: item.contentSnippet || item.content || item.summary || item.title,
          publishedDate: item.isoDate || item.pubDate || new Date().toISOString(),
          sourceUrl: item.link
        });

        const status = settings.require_admin_approval ? 'pending_review' : 'published';

        await createNewsBrief({
          headline_en: summaryResult.headline_en,
          headline_hi: summaryResult.headline_hi,
          source: feed.name,
          source_url: item.link,
          published_date: item.isoDate || item.pubDate || new Date().toISOString(),
          category: summaryResult.category,
          importance: summaryResult.importance,
          summary_en: summaryResult.summary_en,
          summary_hi: summaryResult.summary_hi,
          key_points_en: summaryResult.key_points_en,
          key_points_hi: summaryResult.key_points_hi,
          status,
          private_notes: `Auto-fetched from ${feed.name}. AI provider: ${summaryResult.ai_provider}.`,
          ai_generated: true,
          ai_provider: summaryResult.ai_provider,
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

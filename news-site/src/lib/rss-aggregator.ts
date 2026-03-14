/**
 * RSS Feed Aggregator
 * Fetches and parses RSS/Atom feeds from configured news sources.
 */

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  category?: string;
  imageUrl?: string;
}

export interface RSSFeedConfig {
  name: string;
  url: string;
  category: string;
}

// Default RSS feeds to aggregate
export const defaultFeeds: RSSFeedConfig[] = [
  // Technology
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "technology" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", category: "technology" },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", category: "technology" },
  { name: "Wired", url: "https://www.wired.com/feed/rss", category: "technology" },
  // Business
  { name: "Reuters Business", url: "https://www.reutersagency.com/feed/?best-topics=business-finance", category: "business" },
  { name: "Bloomberg", url: "https://feeds.bloomberg.com/markets/news.rss", category: "business" },
  // Science
  { name: "NASA", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss", category: "science" },
  { name: "Science Daily", url: "https://www.sciencedaily.com/rss/all.xml", category: "science" },
  // Health
  { name: "WHO News", url: "https://www.who.int/rss-feeds/news-english.xml", category: "health" },
  // Sports
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news", category: "sports" },
];

/**
 * Parse an XML RSS/Atom feed string into RSSItem[]
 * Uses a simple regex-based parser to avoid heavy XML dependencies.
 */
function parseRSSXml(xml: string, sourceName: string, category: string): RSSItem[] {
  const items: RSSItem[] = [];

  // Match <item> (RSS) or <entry> (Atom)
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title = extractTag(block, "title");
    const link = extractLink(block);
    const description = extractTag(block, "description") || extractTag(block, "summary") || "";
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "published") || extractTag(block, "updated") || "";
    const imageUrl = extractMediaImage(block);

    if (title && link) {
      items.push({
        title: stripCDATA(title),
        link,
        description: stripHtml(stripCDATA(description)).slice(0, 300),
        pubDate,
        source: sourceName,
        category,
        imageUrl: imageUrl || undefined,
      });
    }
  }

  return items;
}

function extractTag(block: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = regex.exec(block);
  return match ? match[1].trim() : null;
}

function extractLink(block: string): string | null {
  // RSS: <link>url</link>
  const linkTag = extractTag(block, "link");
  if (linkTag && linkTag.startsWith("http")) return linkTag;

  // Atom: <link href="url" />
  const atomLink = /<link[^>]+href="([^"]+)"[^>]*\/?>/i.exec(block);
  if (atomLink) return atomLink[1];

  return linkTag;
}

function extractMediaImage(block: string): string | null {
  // <media:content url="..." />
  const media = /url="(https?:\/\/[^"]+(?:jpg|jpeg|png|webp|gif)[^"]*)"/i.exec(block);
  if (media) return media[1];

  // <enclosure url="..." type="image/..." />
  const enclosure = /<enclosure[^>]+url="([^"]+)"[^>]+type="image[^"]*"/i.exec(block);
  if (enclosure) return enclosure[1];

  // <img src="..." /> inside description
  const img = /<img[^>]+src="([^"]+)"/i.exec(block);
  return img ? img[1] : null;
}

function stripCDATA(text: string): string {
  return text.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

/**
 * Fetch a single RSS feed
 */
export async function fetchFeed(feed: RSSFeedConfig): Promise<RSSItem[]> {
  try {
    const res = await fetch(feed.url, {
      next: { revalidate: 600 }, // 10 minute cache
      headers: {
        "User-Agent": "NewsSite-RSS-Aggregator/1.0",
      },
    });

    if (!res.ok) {
      console.error(`RSS fetch failed for ${feed.name}: ${res.status}`);
      return [];
    }

    const xml = await res.text();
    return parseRSSXml(xml, feed.name, feed.category);
  } catch (error) {
    console.error(`RSS fetch error for ${feed.name}:`, error);
    return [];
  }
}

/**
 * Fetch all configured RSS feeds in parallel
 */
export async function fetchAllFeeds(
  feeds: RSSFeedConfig[] = defaultFeeds
): Promise<RSSItem[]> {
  const results = await Promise.allSettled(feeds.map(fetchFeed));

  const allItems: RSSItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Sort by date (newest first)
  allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime() || 0;
    const dateB = new Date(b.pubDate).getTime() || 0;
    return dateB - dateA;
  });

  // Deduplicate by normalized title
  const seen = new Set<string>();
  return allItems.filter((item) => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Fetch feeds filtered by category
 */
export async function fetchFeedsByCategory(
  category: string,
  feeds: RSSFeedConfig[] = defaultFeeds
): Promise<RSSItem[]> {
  const categoryFeeds = feeds.filter((f) => f.category === category);
  return fetchAllFeeds(categoryFeeds);
}

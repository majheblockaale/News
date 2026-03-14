/**
 * News API Integration
 * Supports NewsAPI.org and GNews.io for fetching external news feeds.
 */

export interface ExternalArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  source: string;
  author: string | null;
  publishedAt: string;
  category?: string;
}

// --- NewsAPI.org ---

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }[];
}

export async function fetchFromNewsAPI(options: {
  query?: string;
  category?: string;
  country?: string;
  pageSize?: number;
}): Promise<ExternalArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    console.warn("NEWSAPI_KEY not set, skipping NewsAPI fetch");
    return [];
  }

  const params = new URLSearchParams();
  params.set("apiKey", apiKey);
  params.set("pageSize", String(options.pageSize || 20));

  let endpoint: string;

  if (options.query) {
    endpoint = "https://newsapi.org/v2/everything";
    params.set("q", options.query);
    params.set("sortBy", "publishedAt");
    params.set("language", "en");
  } else {
    endpoint = "https://newsapi.org/v2/top-headlines";
    params.set("country", options.country || "us");
    if (options.category) params.set("category", options.category);
  }

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    console.error(`NewsAPI error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data: NewsAPIResponse = await res.json();

  return data.articles
    .filter((a) => a.title && a.title !== "[Removed]")
    .map((a) => ({
      title: a.title,
      description: a.description || "",
      content: a.content || a.description || "",
      url: a.url,
      imageUrl: a.urlToImage,
      source: a.source.name,
      author: a.author,
      publishedAt: a.publishedAt,
      category: options.category,
    }));
}

// --- GNews.io ---

interface GNewsResponse {
  totalArticles: number;
  articles: {
    title: string;
    description: string;
    content: string;
    url: string;
    image: string | null;
    publishedAt: string;
    source: { name: string; url: string };
  }[];
}

export async function fetchFromGNews(options: {
  query?: string;
  topic?: string;
  lang?: string;
  max?: number;
}): Promise<ExternalArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    console.warn("GNEWS_API_KEY not set, skipping GNews fetch");
    return [];
  }

  const params = new URLSearchParams();
  params.set("apikey", apiKey);
  params.set("lang", options.lang || "en");
  params.set("max", String(options.max || 10));

  let endpoint: string;

  if (options.query) {
    endpoint = "https://gnews.io/api/v4/search";
    params.set("q", options.query);
  } else {
    endpoint = "https://gnews.io/api/v4/top-headlines";
    if (options.topic) params.set("topic", options.topic);
  }

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error(`GNews error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data: GNewsResponse = await res.json();

  return data.articles.map((a) => ({
    title: a.title,
    description: a.description,
    content: a.content,
    url: a.url,
    imageUrl: a.image,
    source: a.source.name,
    author: null,
    publishedAt: a.publishedAt,
    category: options.topic,
  }));
}

// --- Aggregated fetch ---

export async function fetchAllNews(options: {
  query?: string;
  category?: string;
}): Promise<ExternalArticle[]> {
  const [newsapi, gnews] = await Promise.allSettled([
    fetchFromNewsAPI({ query: options.query, category: options.category }),
    fetchFromGNews({ query: options.query, topic: options.category }),
  ]);

  const results: ExternalArticle[] = [];

  if (newsapi.status === "fulfilled") results.push(...newsapi.value);
  if (gnews.status === "fulfilled") results.push(...gnews.value);

  // Deduplicate by title similarity
  const seen = new Set<string>();
  return results.filter((article) => {
    const normalized = article.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

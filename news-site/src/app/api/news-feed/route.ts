import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/news-api";
import { fetchAllFeeds, fetchFeedsByCategory } from "@/lib/rss-aggregator";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get("source"); // "api", "rss", or null (both)
  const category = searchParams.get("category");
  const query = searchParams.get("q");

  try {
    if (source === "rss") {
      const items = category
        ? await fetchFeedsByCategory(category)
        : await fetchAllFeeds();
      return NextResponse.json({ source: "rss", items, count: items.length });
    }

    if (source === "api") {
      const items = await fetchAllNews({ query: query || undefined, category: category || undefined });
      return NextResponse.json({ source: "api", items, count: items.length });
    }

    // Fetch from both sources
    const [apiItems, rssItems] = await Promise.allSettled([
      fetchAllNews({ query: query || undefined, category: category || undefined }),
      category ? fetchFeedsByCategory(category) : fetchAllFeeds(),
    ]);

    return NextResponse.json({
      api: apiItems.status === "fulfilled" ? apiItems.value : [],
      rss: rssItems.status === "fulfilled" ? rssItems.value : [],
      totalApi: apiItems.status === "fulfilled" ? apiItems.value.length : 0,
      totalRss: rssItems.status === "fulfilled" ? rssItems.value.length : 0,
    });
  } catch (error) {
    console.error("News feed error:", error);
    return NextResponse.json({ error: "Failed to fetch news feeds" }, { status: 500 });
  }
}

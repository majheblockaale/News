import { NextRequest, NextResponse } from "next/server";
import { articles, getArticlesByCategory, getLatestArticles, getTrendingArticles } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const query = searchParams.get("q");

  let results = [...articles].filter((a) => a.status === "published");

  // Filter by category
  if (category) {
    results = results.filter((a) => a.category.slug === category);
  }

  // Search by query
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.name.toLowerCase().includes(q))
    );
  }

  // Sort
  switch (sort) {
    case "trending":
      results.sort((a, b) => b.viewCount - a.viewCount);
      break;
    case "oldest":
      results.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      break;
    default: // newest
      results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  results = results.slice(0, limit);

  return NextResponse.json({
    articles: results,
    total: results.length,
  });
}

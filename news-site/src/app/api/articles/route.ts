import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const query = searchParams.get("q");

  const articles = await getArticles({
    status: "published",
    categorySlug: category || undefined,
    search: query || undefined,
    limit,
    orderBy: sort === "trending" ? "trending" : sort === "oldest" ? "oldest" : "newest",
  });

  return NextResponse.json({ articles, total: articles.length });
}

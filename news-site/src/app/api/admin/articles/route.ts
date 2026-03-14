import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createArticle, getArticles } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const articles = await getArticles({
    status: searchParams.get("status") || undefined,
    categorySlug: searchParams.get("category") || undefined,
    search: searchParams.get("q") || undefined,
    limit: parseInt(searchParams.get("limit") || "50", 10),
    orderBy: (searchParams.get("sort") as "newest" | "trending" | "oldest") || "newest",
  });

  return NextResponse.json({ articles, total: articles.length });
}

export async function POST(request: NextRequest) {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.title || !body.content || !body.categoryId) {
    return NextResponse.json({ error: "Title, content, and categoryId are required" }, { status: 400 });
  }

  const article = await createArticle({
    ...body,
    authorId: user.id,
    slug: body.slug || body.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, ""),
  });

  return NextResponse.json({ article }, { status: 201 });
}

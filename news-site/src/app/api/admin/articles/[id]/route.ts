import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getArticleById, updateArticle, deleteArticle } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json({ article });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const article = await updateArticle(id, body);
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}

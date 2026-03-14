/**
 * Data Access Layer — database queries replacing mock-data.
 * All functions return plain objects matching the existing types.
 */
import { prisma } from "./prisma";
import type { Article, Category, Author, Tag } from "@/types";

// ---------- Helpers ----------

function parseAuthor(user: {
  id: string; name: string; email: string; role: string;
  avatarUrl: string | null; bio: string | null; socialLinks: string | null;
}): Author {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Author["role"],
    avatarUrl: user.avatarUrl || undefined,
    bio: user.bio || "",
    socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : {},
  };
}

function parseCategory(cat: {
  id: string; name: string; slug: string; description: string | null;
  metaTitle: string | null; metaDescription: string | null;
  parentId: string | null; icon: string | null; color: string;
  sortOrder: number; isActive: boolean;
}): Category {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    metaTitle: cat.metaTitle || "",
    metaDescription: cat.metaDescription || "",
    parentId: cat.parentId || undefined,
    icon: cat.icon || undefined,
    color: cat.color,
    sortOrder: cat.sortOrder,
    isActive: cat.isActive,
  };
}

type ArticleRow = Awaited<ReturnType<typeof prisma.article.findFirst>> & {
  author: Parameters<typeof parseAuthor>[0];
  category: Parameters<typeof parseCategory>[0];
  tags: { tag: { id: string; name: string; slug: string; articleCount: number } }[];
};

function parseArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    content: row.content,
    featuredImageUrl: row.featuredImageUrl || "",
    featuredImageAlt: row.featuredImageAlt || "",
    author: parseAuthor(row.author),
    category: parseCategory(row.category),
    tags: row.tags.map((at) => at.tag),
    status: row.status as Article["status"],
    isFeatured: row.isFeatured,
    isBreaking: row.isBreaking,
    isEvergreen: row.isEvergreen,
    sourceUrl: row.sourceUrl || undefined,
    sourceName: row.sourceName || undefined,
    readingTimeMinutes: row.readingTime,
    wordCount: row.wordCount,
    viewCount: row.viewCount,
    shareCount: row.shareCount,
    seoTitle: row.seoTitle || "",
    seoDescription: row.seoDescription || "",
    seoKeywords: row.seoKeywords ? row.seoKeywords.split(",").map((k) => k.trim()) : [],
    faq: row.faq ? JSON.parse(row.faq) : undefined,
    publishedAt: row.publishedAt?.toISOString() || "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const articleInclude = {
  author: true,
  category: true,
  tags: { include: { tag: true } },
} as const;

// ---------- Articles ----------

export async function getArticles(opts?: {
  status?: string;
  limit?: number;
  orderBy?: "newest" | "trending" | "oldest";
  categorySlug?: string;
  authorId?: string;
  featured?: boolean;
  breaking?: boolean;
  search?: string;
}): Promise<Article[]> {
  const where: Record<string, unknown> = {};

  if (opts?.status) where.status = opts.status;
  if (opts?.featured !== undefined) where.isFeatured = opts.featured;
  if (opts?.breaking !== undefined) where.isBreaking = opts.breaking;
  if (opts?.authorId) where.authorId = opts.authorId;
  if (opts?.categorySlug) where.category = { slug: opts.categorySlug };
  if (opts?.search) {
    where.OR = [
      { title: { contains: opts.search } },
      { excerpt: { contains: opts.search } },
    ];
  }

  let orderBy: Record<string, string> = { publishedAt: "desc" };
  if (opts?.orderBy === "trending") orderBy = { viewCount: "desc" };
  if (opts?.orderBy === "oldest") orderBy = { publishedAt: "asc" };

  const rows = await prisma.article.findMany({
    where,
    include: articleInclude,
    orderBy,
    take: opts?.limit || 50,
  });

  return rows.map((r) => parseArticle(r as unknown as ArticleRow));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const row = await prisma.article.findUnique({
    where: { slug },
    include: articleInclude,
  });
  if (!row) return null;
  return parseArticle(row as unknown as ArticleRow);
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      categoryId: article.category.id,
      status: "published",
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return rows.map((r) => parseArticle(r as unknown as ArticleRow));
}

export async function incrementViewCount(articleId: string): Promise<void> {
  await prisma.article.update({
    where: { id: articleId },
    data: { viewCount: { increment: 1 } },
  });
}

// ---------- Categories ----------

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    where: { parentId: null, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(parseCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await prisma.category.findUnique({ where: { slug } });
  if (!row) return null;
  return parseCategory(row);
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    where: { parentId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(parseCategory);
}

export async function getSubcategoryBySlug(parentSlug: string, subSlug: string): Promise<Category | null> {
  const parent = await prisma.category.findUnique({ where: { slug: parentSlug } });
  if (!parent) return null;
  const sub = await prisma.category.findFirst({ where: { parentId: parent.id, slug: subSlug } });
  if (!sub) return null;
  return parseCategory(sub);
}

// ---------- Tags ----------

export async function getTags(): Promise<Tag[]> {
  return prisma.tag.findMany({ orderBy: { articleCount: "desc" } });
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return prisma.tag.findUnique({ where: { slug } });
}

export async function getArticlesByTag(tagSlug: string): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: {
      status: "published",
      tags: { some: { tag: { slug: tagSlug } } },
    },
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((r) => parseArticle(r as unknown as ArticleRow));
}

// ---------- Authors ----------

export async function getAuthors(): Promise<Author[]> {
  const rows = await prisma.user.findMany({
    where: { role: { in: ["admin", "editor", "author"] } },
  });
  return rows.map(parseAuthor);
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  // Slug is derived from name: "Sarah Chen" => "sarah-chen"
  const rows = await prisma.user.findMany({
    where: { role: { in: ["admin", "editor", "author"] } },
  });
  const match = rows.find(
    (u) => u.name.toLowerCase().replace(/\s+/g, "-") === slug
  );
  if (!match) return null;
  return parseAuthor(match);
}

// ---------- CRUD: Articles ----------

export async function createArticle(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  authorId: string;
  categoryId: string;
  status?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  faq?: string;
  tagIds?: string[];
}): Promise<Article> {
  const { tagIds, ...articleData } = data;
  const row = await prisma.article.create({
    data: {
      ...articleData,
      publishedAt: data.status === "published" ? new Date() : null,
      wordCount: data.content.split(/\s+/).filter(Boolean).length,
      readingTime: Math.max(1, Math.ceil(data.content.split(/\s+/).filter(Boolean).length / 200)),
      tags: tagIds?.length
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: articleInclude,
  });
  return parseArticle(row as unknown as ArticleRow);
}

export async function updateArticle(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    featuredImageUrl?: string;
    featuredImageAlt?: string;
    categoryId?: string;
    status?: string;
    isFeatured?: boolean;
    isBreaking?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    faq?: string;
  }
): Promise<Article> {
  const updateData: Record<string, unknown> = { ...data };
  if (data.content) {
    updateData.wordCount = data.content.split(/\s+/).filter(Boolean).length;
    updateData.readingTime = Math.max(1, Math.ceil(data.content.split(/\s+/).filter(Boolean).length / 200));
  }
  if (data.status === "published") {
    // Set publishedAt if not already set
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing?.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  const row = await prisma.article.update({
    where: { id },
    data: updateData,
    include: articleInclude,
  });
  return parseArticle(row as unknown as ArticleRow);
}

export async function deleteArticle(id: string): Promise<void> {
  await prisma.article.delete({ where: { id } });
}

// ---------- CRUD: Categories ----------

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  parentId?: string;
  color?: string;
  sortOrder?: number;
}): Promise<Category> {
  const row = await prisma.category.create({ data });
  return parseCategory(row);
}

export async function updateCategory(id: string, data: Partial<{
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
}>): Promise<Category> {
  const row = await prisma.category.update({ where: { id }, data });
  return parseCategory(row);
}

export async function deleteCategory(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } });
}

// ---------- CRUD: Tags ----------

export async function createTag(data: { name: string; slug: string }): Promise<Tag> {
  return prisma.tag.create({ data });
}

export async function deleteTag(id: string): Promise<void> {
  await prisma.tag.delete({ where: { id } });
}

// ---------- Newsletter ----------

export async function subscribeNewsletter(email: string, categories?: string[]): Promise<void> {
  await prisma.newsletter.upsert({
    where: { email },
    create: {
      email,
      categories: categories?.join(",") || null,
    },
    update: {
      categories: categories?.join(",") || null,
    },
  });
}

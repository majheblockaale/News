import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTags, getTagBySlug, getArticlesByTag } from "@/lib/db";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Hash } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return { title: "Tag Not Found" };

  return {
    title: `#${tag.name} News`,
    description: `Browse all news articles tagged with ${tag.name}.`,
    alternates: { canonical: `https://newssite.com/tag/${tag.slug}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) notFound();

  const [tagArticles, allTags] = await Promise.all([
    getArticlesByTag(slug),
    getTags(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted mb-4">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li>&gt;</li>
          <li>Tags</li>
          <li>&gt;</li>
          <li className="text-[var(--foreground)]">#{tag.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Hash size={24} className="text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">#{tag.name}</h1>
            <p className="text-muted mt-0.5">
              {tagArticles.length} article{tagArticles.length !== 1 ? "s" : ""} tagged
            </p>
          </div>
        </div>
      </div>

      {/* All Tags */}
      <div className="mb-8 flex flex-wrap gap-2">
        {allTags.map((t) => (
          <Link
            key={t.id}
            href={`/tag/${t.slug}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              t.slug === slug
                ? "bg-accent text-white"
                : "border border-[var(--border)] hover:bg-accent hover:text-white hover:border-accent"
            }`}
          >
            #{t.name}
          </Link>
        ))}
      </div>

      {/* Articles */}
      {tagArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tagArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-12">
          No articles with this tag yet.
        </p>
      )}
    </div>
  );
}

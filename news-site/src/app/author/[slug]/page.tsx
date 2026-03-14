import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthors, getAuthorBySlug, getArticles } from "@/lib/db";
import { ArticleCard } from "@/components/ui/ArticleCard";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.map((a) => ({
    slug: a.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Author Not Found" };

  return {
    title: `${author.name} — Author`,
    description: author.bio || `Articles by ${author.name}`,
    alternates: { canonical: `https://newssite.com/author/${slug}` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) notFound();

  const authorArticles = await getArticles({ status: "published", authorId: author.id });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted mb-6">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li>&gt;</li>
          <li className="text-[var(--foreground)]">{author.name}</li>
        </ol>
      </nav>

      {/* Author Info */}
      <div className="flex items-start gap-6 mb-10 pb-8 border-b border-[var(--border)]">
        <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-3xl shrink-0">
          {author.name[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{author.name}</h1>
          <p className="text-sm text-muted capitalize mt-1">{author.role}</p>
          {author.bio && <p className="mt-3 text-muted max-w-2xl">{author.bio}</p>}
          {author.socialLinks && (
            <div className="mt-3 flex items-center gap-3 text-sm">
              {author.socialLinks.twitter && (
                <span className="text-accent">@{author.socialLinks.twitter}</span>
              )}
              {author.socialLinks.linkedin && (
                <span className="text-secondary">LinkedIn: {author.socialLinks.linkedin}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Author Articles */}
      <h2 className="text-xl font-bold mb-6">
        Articles by {author.name} ({authorArticles.length})
      </h2>
      {authorArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No articles published yet.</p>
      )}
    </div>
  );
}

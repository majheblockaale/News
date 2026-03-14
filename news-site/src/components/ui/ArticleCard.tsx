import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { timeAgo } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact" | "horizontal";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const href = `/article/${article.slug}`;

  if (variant === "compact") {
    return (
      <article className="flex items-start gap-3 group">
        <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 bg-[var(--surface)]">
          <Image
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={href}>
            <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-muted mt-1">{timeAgo(article.publishedAt)}</p>
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="flex gap-4 group">
        <div className="relative w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-[var(--surface)]">
          <Image
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="192px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: article.category.color }}
          >
            {article.category.name}
          </span>
          <Link href={href}>
            <h3 className="mt-1 font-bold leading-tight line-clamp-2 group-hover:text-accent transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-muted line-clamp-2">{article.excerpt}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <span>{article.author.name}</span>
            <span>&middot;</span>
            <span>{timeAgo(article.publishedAt)}</span>
            <span>&middot;</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className="relative group rounded-xl overflow-hidden bg-[var(--surface)]">
        <div className="relative aspect-[16/10] bg-[var(--surface)]">
          <Image
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {article.isBreaking && (
              <span className="inline-block text-xs font-bold uppercase tracking-wider bg-accent text-white px-2 py-1 rounded mb-2">
                Breaking
              </span>
            )}
            <span
              className="inline-block text-xs font-semibold uppercase tracking-wider text-white/80 mb-2 ml-2"
            >
              {article.category.name}
            </span>
            <Link href={href}>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-accent transition-colors">
                {article.title}
              </h2>
            </Link>
            <p className="mt-2 text-sm text-white/80 line-clamp-2 hidden md:block">
              {article.excerpt}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
              <span>{article.author.name}</span>
              <span>&middot;</span>
              <span>{timeAgo(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default card
  return (
    <article className="group rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--background)] hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/10] bg-[var(--surface)]">
        <Image
          src={article.featuredImageUrl}
          alt={article.featuredImageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: article.category.color }}
        >
          {article.category.name}
        </span>
        <Link href={href}>
          <h3 className="mt-1 font-bold leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-muted line-clamp-2">{article.excerpt}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span>{article.author.name}</span>
          <span>&middot;</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}

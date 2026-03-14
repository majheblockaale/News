import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles, articles } from "@/lib/mock-data";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { ShareButton } from "@/components/ui/ShareButton";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    keywords: article.seoKeywords,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      section: article.category.name,
      tags: article.tags.map((t) => t.name),
      images: [{ url: article.featuredImageUrl, alt: article.featuredImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImageUrl],
    },
    alternates: {
      canonical: `https://newssite.com/article/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = getRelatedArticles(article, 3);
  const authorSlug = article.author.name.toLowerCase().replace(/\s+/g, "-");

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [article.featuredImageUrl],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `https://newssite.com/author/${authorSlug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "NewsSite",
      logo: { "@type": "ImageObject", url: "https://newssite.com/logo.png" },
    },
    description: article.excerpt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://newssite.com/article/${article.slug}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://newssite.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category.name,
        item: `https://newssite.com/category/${article.category.slug}`,
      },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  const faqLd = article.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <ReadingProgressBar />
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted mb-4">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-accent">Home</Link>
            </li>
            <li>&gt;</li>
            <li>
              <Link href={`/category/${article.category.slug}`} className="hover:text-accent">
                {article.category.name}
              </Link>
            </li>
            <li>&gt;</li>
            <li className="text-[var(--foreground)] truncate max-w-[200px]">{article.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-2">
            {/* Category Badge */}
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: article.category.color }}
            >
              {article.category.name}
            </span>

            {/* Title */}
            <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-3 text-lg text-muted">{article.excerpt}</p>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted pb-4 border-b border-[var(--border)]">
              <Link href={`/author/${authorSlug}`} className="font-medium text-[var(--foreground)] hover:text-accent">
                {article.author.name}
              </Link>
              <span>{formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {article.readingTimeMinutes} min read
              </span>
              <div className="flex items-center gap-1 ml-auto">
                <BookmarkButton articleId={article.id} showLabel />
                <ShareButton
                  url={`/article/${article.slug}`}
                  title={article.title}
                  description={article.excerpt}
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative mt-6 aspect-[16/9] rounded-xl overflow-hidden bg-[var(--surface)]">
              <Image
                src={article.featuredImageUrl}
                alt={article.featuredImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 800px"
                priority
              />
            </div>

            {/* Article Body */}
            <div className="mt-8 prose prose-lg dark:prose-invert max-w-none">
              {article.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace("## ", "")}</h2>;
                }
                return <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>;
              })}
            </div>

            {/* FAQ Section */}
            {article.faq && article.faq.length > 0 && (
              <div className="mt-10 p-6 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {article.faq.map((item, i) => (
                    <details key={i} className="group">
                      <summary className="cursor-pointer font-semibold text-[var(--foreground)] hover:text-accent transition-colors list-none flex items-center justify-between">
                        {item.question}
                        <span className="text-muted group-open:rotate-180 transition-transform">&#9660;</span>
                      </summary>
                      <p className="mt-2 text-muted leading-relaxed pl-0">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t border-[var(--border)]">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.slug}`}
                      className="text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--border)] hover:bg-accent hover:text-white hover:border-accent transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Box */}
            <div className="mt-8 p-6 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl shrink-0">
                  {article.author.name[0]}
                </div>
                <div>
                  <Link
                    href={`/author/${authorSlug}`}
                    className="font-bold text-lg hover:text-accent transition-colors"
                  >
                    {article.author.name}
                  </Link>
                  <p className="text-sm text-muted mt-1">{article.author.bio}</p>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">
                In This Article
              </h3>
              <div className="space-y-2 text-sm">
                {article.content
                  .split("\n\n")
                  .filter((p) => p.startsWith("## "))
                  .map((heading, i) => (
                    <p key={i} className="text-muted hover:text-accent cursor-pointer transition-colors">
                      {heading.replace("## ", "")}
                    </p>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

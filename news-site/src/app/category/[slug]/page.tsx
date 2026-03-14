import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getArticlesByCategory } from "@/lib/mock-data";
import { ArticleCard } from "@/components/ui/ArticleCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: category.metaTitle || `${category.name} News`,
    description: category.metaDescription || category.description,
    alternates: { canonical: `https://newssite.com/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const categoryArticles = getArticlesByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted mb-4">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li>&gt;</li>
          <li className="text-[var(--foreground)]">{category.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8 pb-4 border-b-2" style={{ borderColor: category.color }}>
        <h1 className="text-3xl font-bold" style={{ color: category.color }}>
          {category.name}
        </h1>
        <p className="mt-2 text-muted">{category.description}</p>
      </div>

      {/* Articles Grid */}
      {categoryArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-12">
          No articles in this category yet. Check back soon!
        </p>
      )}
    </div>
  );
}

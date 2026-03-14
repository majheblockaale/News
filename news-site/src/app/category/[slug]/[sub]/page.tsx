import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getCategoryBySlug, getSubcategories, getSubcategoryBySlug, getArticles } from "@/lib/db";
import { ArticleCard } from "@/components/ui/ArticleCard";

interface Props {
  params: Promise<{ slug: string; sub: string }>;
}

export async function generateStaticParams() {
  const cats = await getCategories();
  const params: { slug: string; sub: string }[] = [];
  for (const cat of cats) {
    const subs = await getSubcategories(cat.id);
    for (const sub of subs) {
      params.push({ slug: cat.slug, sub: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params;
  const subcategory = await getSubcategoryBySlug(slug, sub);
  if (!subcategory) return { title: "Not Found" };

  return {
    title: subcategory.metaTitle || `${subcategory.name} News`,
    description: subcategory.metaDescription || subcategory.description,
    alternates: { canonical: `https://newssite.com/category/${slug}/${sub}` },
  };
}

export default async function SubcategoryPage({ params }: Props) {
  const { slug, sub } = await params;
  const parent = await getCategoryBySlug(slug);
  const subcategory = await getSubcategoryBySlug(slug, sub);

  if (!parent || !subcategory) notFound();

  const [subs, articles] = await Promise.all([
    getSubcategories(parent.id),
    getArticles({ status: "published", categorySlug: slug }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted mb-4">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li>&gt;</li>
          <li><Link href={`/category/${slug}`} className="hover:text-accent">{parent.name}</Link></li>
          <li>&gt;</li>
          <li className="text-[var(--foreground)]">{subcategory.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-6 pb-4 border-b-2" style={{ borderColor: parent.color }}>
        <h1 className="text-3xl font-bold" style={{ color: parent.color }}>
          {subcategory.name}
        </h1>
        <p className="mt-2 text-muted">{subcategory.description}</p>
      </div>

      {/* Subcategory Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href={`/category/${slug}`}
          className="px-4 py-2 text-sm font-medium rounded-full border border-[var(--border)] hover:bg-accent hover:text-white hover:border-accent transition-colors"
        >
          All
        </Link>
        {subs.map((s) => (
          <Link
            key={s.id}
            href={`/category/${slug}/${s.slug}`}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              s.slug === sub
                ? "bg-accent text-white"
                : "border border-[var(--border)] hover:bg-accent hover:text-white hover:border-accent"
            }`}
          >
            {s.name}
          </Link>
        ))}
      </div>

      {/* Articles */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-12">
          No articles in this subcategory yet.
        </p>
      )}
    </div>
  );
}

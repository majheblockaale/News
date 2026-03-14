import { ArticleCard } from "@/components/ui/ArticleCard";
import { getCategories, getArticles } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function CategoryHighlights() {
  const categories = await getCategories();
  const highlightCategories = categories.slice(0, 4);

  const categoryData = await Promise.all(
    highlightCategories.map(async (cat) => ({
      category: cat,
      articles: (await getArticles({ status: "published", categorySlug: cat.slug, limit: 2 })),
    }))
  );

  return (
    <section aria-label="Category highlights">
      <h2 className="text-lg font-bold mb-6">Explore by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categoryData.map(({ category: cat, articles: catArticles }) => {
          if (catArticles.length === 0) return null;
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2" style={{ borderColor: cat.color }}>
                <h3 className="font-bold" style={{ color: cat.color }}>
                  {cat.name}
                </h3>
                <Link
                  href={`/category/${cat.slug}`}
                  className="text-xs text-muted font-medium flex items-center gap-1 hover:text-accent transition-colors"
                >
                  More <ArrowRight size={12} />
                </Link>
              </div>
              <div className="space-y-3">
                {catArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

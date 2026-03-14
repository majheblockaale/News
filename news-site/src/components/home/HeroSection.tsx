import { ArticleCard } from "@/components/ui/ArticleCard";
import { getArticles } from "@/lib/db";

export async function HeroSection() {
  const featured = await getArticles({ status: "published", featured: true, limit: 3 });
  const hero = featured[0];
  const sideStories = featured.slice(1, 3);

  if (!hero) return null;

  return (
    <section aria-label="Featured stories">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Hero */}
        <div className="lg:col-span-2">
          <ArticleCard article={hero} variant="featured" />
        </div>

        {/* Side Stories */}
        <div className="flex flex-col gap-4">
          {sideStories.map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { getTrendingArticles } from "@/lib/mock-data";
import { ArticleCard } from "@/components/ui/ArticleCard";

export const metadata: Metadata = {
  title: "Trending News",
  description: "The most popular and trending stories right now. See what everyone is reading.",
  alternates: { canonical: "https://newssite.com/trending" },
};

export default function TrendingPage() {
  const trending = getTrendingArticles(20);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Trending Now</h1>
      <p className="text-muted mb-8">The most-read stories right now.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

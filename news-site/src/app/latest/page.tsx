import type { Metadata } from "next";
import { getArticles } from "@/lib/db";
import { ArticleCard } from "@/components/ui/ArticleCard";

export const metadata: Metadata = {
  title: "Latest News",
  description: "The latest breaking news and stories from around the world. Stay up to date with the most recent developments.",
  alternates: { canonical: "https://newssite.com/latest" },
};

export default async function LatestPage() {
  const latest = await getArticles({ status: "published", orderBy: "newest", limit: 20 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Latest News</h1>
      <p className="text-muted mb-8">The most recent stories as they happen.</p>

      <div className="space-y-6">
        {latest.map((article) => (
          <ArticleCard key={article.id} article={article} variant="horizontal" />
        ))}
      </div>
    </div>
  );
}

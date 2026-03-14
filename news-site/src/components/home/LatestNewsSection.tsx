import { ArticleCard } from "@/components/ui/ArticleCard";
import { getLatestArticles } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LatestNewsSection() {
  const latest = getLatestArticles(6);

  return (
    <section aria-label="Latest news">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Latest News</h2>
        <Link
          href="/latest"
          className="text-sm text-accent font-medium flex items-center gap-1 hover:underline"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="space-y-4">
        {latest.map((article) => (
          <ArticleCard key={article.id} article={article} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useBookmarkStore } from "@/lib/store";
import { articles } from "@/lib/mock-data";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Bookmark } from "lucide-react";

export default function SavedPage() {
  const { bookmarks } = useBookmarkStore();
  const savedArticles = articles.filter((a) => bookmarks.has(a.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Saved Articles</h1>
      <p className="text-muted mb-8">Your bookmarked articles, stored locally on this device.</p>

      {savedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Bookmark size={48} className="mx-auto mb-4 text-muted opacity-30" />
          <p className="text-lg font-medium">No saved articles yet</p>
          <p className="text-muted mt-1">
            Click the bookmark icon on any article to save it for later.
          </p>
        </div>
      )}
    </div>
  );
}

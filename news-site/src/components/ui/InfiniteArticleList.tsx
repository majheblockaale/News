"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";

interface InfiniteArticleListProps {
  articles: Article[];
  pageSize?: number;
  variant?: "default" | "horizontal";
}

export function InfiniteArticleList({
  articles,
  pageSize = 9,
  variant = "default",
}: InfiniteArticleListProps) {
  const [displayCount, setDisplayCount] = useState(pageSize);
  const loaderRef = useRef<HTMLDivElement>(null);
  const hasMore = displayCount < articles.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount((prev) => Math.min(prev + pageSize, articles.length));
    }
  }, [hasMore, pageSize, articles.length]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [loadMore]);

  const visible = articles.slice(0, displayCount);

  if (variant === "horizontal") {
    return (
      <div>
        <div className="space-y-6">
          {visible.map((article) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-sm text-muted">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              Loading more articles...
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-muted">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Loading more articles...
          </div>
        </div>
      )}
    </div>
  );
}

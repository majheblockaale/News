"use client";

import { ArticleCard } from "@/components/ui/ArticleCard";
import type { Article, Tag } from "@/types";
import Link from "next/link";

interface Props {
  mostRead: Article[];
  tags: Tag[];
}

export function SidebarClient({ mostRead, tags }: Props) {
  return (
    <aside className="space-y-8" aria-label="Sidebar">
      {/* Most Read */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 pb-2 border-b border-[var(--border)]">
          Most Read
        </h3>
        <div className="space-y-4">
          {mostRead.map((article, i) => (
            <div key={article.id} className="flex items-start gap-3">
              <span className="text-2xl font-black text-accent/30 leading-none shrink-0">
                {i + 1}
              </span>
              <ArticleCard article={article} variant="compact" />
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="rounded-lg bg-primary p-5 text-white">
        <h3 className="font-bold">Stay Informed</h3>
        <p className="text-sm text-gray-300 mt-1">
          Get breaking news and top stories delivered to your inbox.
        </p>
        <form className="mt-3 space-y-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 text-sm rounded-md bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="w-full px-3 py-2 text-sm font-medium bg-accent rounded-md hover:bg-accent/90 transition-colors"
          >
            Subscribe Free
          </button>
        </form>
      </div>

      {/* Trending Tags */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 pb-2 border-b border-[var(--border)]">
          Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
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
    </aside>
  );
}

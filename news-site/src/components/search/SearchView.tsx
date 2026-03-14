"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { Article, Category } from "@/types";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function SearchView() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "oldest" | "popular">("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  const doSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({ q: query.trim(), limit: "50" });
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (sortBy === "newest") params.set("sort", "newest");
    if (sortBy === "oldest") params.set("sort", "oldest");
    if (sortBy === "popular") params.set("sort", "trending");

    try {
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      setResults(data.articles || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory, sortBy]);

  useEffect(() => {
    const timer = setTimeout(doSearch, 300);
    return () => clearTimeout(timer);
  }, [doSearch]);

  return (
    <div>
      {/* Search Input */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, topics, authors..."
          className="w-full pl-12 pr-12 py-4 text-lg border border-[var(--border)] rounded-xl bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--surface)]"
            aria-label="Clear search"
          >
            <X size={18} className="text-muted" />
          </button>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-[var(--surface)]"
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={18} className="text-muted" />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mt-8">
        {query.trim() ? (
          <>
            <p className="text-sm text-muted mb-6">
              {loading ? "Searching..." : `${results.length} result${results.length !== 1 ? "s" : ""} for \u201c${query}\u201d`}
            </p>
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            ) : !loading ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium">No results found</p>
                <p className="text-muted mt-1">
                  Try different keywords or check your spelling.
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-16 text-muted">
            <Search size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Start typing to search articles</p>
          </div>
        )}
      </div>
    </div>
  );
}

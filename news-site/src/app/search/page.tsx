import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/search/SearchView";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across all news articles, categories, and topics.",
  alternates: { canonical: "https://newssite.com/search" },
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <Suspense fallback={<div className="text-muted">Loading search...</div>}>
        <SearchView />
      </Suspense>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { articles } from "@/lib/mock-data";
import { X, Zap } from "lucide-react";

export function BreakingNewsTicker() {
  const [visible, setVisible] = useState(true);
  const breaking = articles.filter((a) => a.isBreaking && a.status === "published");

  if (!visible || breaking.length === 0) return null;

  return (
    <div className="bg-accent text-white text-sm overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-4 flex items-center h-9">
        <span className="flex items-center gap-1.5 font-bold uppercase text-xs tracking-wider shrink-0 mr-4">
          <Zap size={14} fill="currentColor" />
          Breaking
        </span>
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap">
            {breaking.map((article, i) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="hover:underline"
              >
                {article.title}
                {i < breaking.length - 1 && (
                  <span className="mx-6 text-white/50">&bull;</span>
                )}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 p-1 rounded hover:bg-white/20 shrink-0"
          aria-label="Dismiss breaking news"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

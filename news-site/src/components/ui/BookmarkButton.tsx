"use client";

import { Bookmark } from "lucide-react";
import { useBookmarkStore } from "@/lib/store";

interface BookmarkButtonProps {
  articleId: string;
  size?: number;
  showLabel?: boolean;
}

export function BookmarkButton({ articleId, size = 16, showLabel = false }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarkStore();
  const saved = isBookmarked(articleId);

  return (
    <button
      onClick={() => toggle(articleId)}
      className={`inline-flex items-center gap-1.5 p-1.5 rounded transition-colors ${
        saved
          ? "text-accent"
          : "text-muted hover:text-[var(--foreground)]"
      }`}
      aria-label={saved ? "Remove bookmark" : "Save article"}
      title={saved ? "Remove bookmark" : "Save article"}
    >
      <Bookmark size={size} fill={saved ? "currentColor" : "none"} />
      {showLabel && (
        <span className="text-xs font-medium">{saved ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}

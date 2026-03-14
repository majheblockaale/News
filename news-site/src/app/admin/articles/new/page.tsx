"use client";

import { useState } from "react";
import { categories } from "@/lib/mock-data";
import { slugify } from "@/lib/utils";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "review" | "published">("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [tags, setTags] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
    if (!seoTitle) setSeoTitle(value);
  };

  const handleSave = () => {
    // In a real app, this would POST to the API
    const article = {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      status,
      seoTitle,
      seoDescription,
      featuredImageUrl,
      isFeatured,
      isBreaking,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    console.log("Saving article:", article);
    alert("Article saved! (Demo — no backend connected)");
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/articles" className="p-2 rounded hover:bg-[var(--surface)]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">New Article</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
          >
            <Save size={14} />
            Save {status === "published" ? "& Publish" : "Draft"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter article title..."
            className="w-full px-4 py-3 text-lg font-medium border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            URL Slug
          </label>
          <div className="flex items-center gap-1 text-sm text-muted">
            <span>/article/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Excerpt
            <span className="text-muted font-normal normal-case ml-2">
              ({excerpt.length}/160 characters)
            </span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value.slice(0, 160))}
            placeholder="Brief summary for search results and social media..."
            rows={2}
            className="w-full px-4 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Content *
            <span className="text-muted font-normal normal-case ml-2">
              {wordCount} words &middot; {readingTime} min read
            </span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content here... (Supports markdown: ## for headings)"
            rows={16}
            className="w-full px-4 py-3 text-sm font-mono border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="draft">Draft</option>
              <option value="review">Submit for Review</option>
              <option value="published">Publish Now</option>
            </select>
          </div>

          {/* Featured Image */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Featured Image URL
            </label>
            <input
              type="url"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="AI, technology, breaking news"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Flags */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-[var(--border)]"
            />
            Featured Article
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="rounded border-[var(--border)]"
            />
            Breaking News
          </label>
        </div>

        {/* SEO Section */}
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <h2 className="font-semibold text-sm mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                SEO Title
                <span className="text-muted font-normal normal-case ml-2">
                  ({seoTitle.length}/60 characters)
                </span>
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value.slice(0, 60))}
                placeholder="SEO-optimized title..."
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Meta Description
                <span className="text-muted font-normal normal-case ml-2">
                  ({seoDescription.length}/155 characters)
                </span>
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value.slice(0, 155))}
                placeholder="Meta description for search engines..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
            {/* SEO Preview */}
            <div className="p-3 rounded-md bg-[var(--background)] border border-[var(--border)]">
              <p className="text-xs text-muted mb-1">Search Preview</p>
              <p className="text-blue-600 dark:text-blue-400 text-base font-medium truncate">
                {seoTitle || title || "Article Title"} | NewsSite
              </p>
              <p className="text-green-700 dark:text-green-500 text-xs">
                newssite.com/article/{slug || "article-slug"}
              </p>
              <p className="text-sm text-muted mt-0.5 line-clamp-2">
                {seoDescription || excerpt || "Article description will appear here..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

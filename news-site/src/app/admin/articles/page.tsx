"use client";

import { useState } from "react";
import Link from "next/link";
import { articles, categories } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Eye, Pencil, Trash2, Filter } from "lucide-react";

export default function AdminArticlesPage() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) => {
    if (filterCategory !== "all" && a.category.slug !== filterCategory) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <Filter size={16} className="text-muted" />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-md bg-[var(--background)]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-md bg-[var(--background)]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="review">In Review</option>
          <option value="archived">Archived</option>
        </select>
        <span className="text-sm text-muted ml-auto">{filtered.length} articles</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                <th className="text-left px-4 py-3 font-medium text-muted">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Category</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Author</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted">Views</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Published</th>
                <th className="text-right px-4 py-3 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((article) => (
                <tr key={article.id} className="hover:bg-[var(--surface)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <p className="font-medium truncate">{article.title}</p>
                      {article.isFeatured && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">Featured</span>
                      )}
                      {article.isBreaking && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500 ml-1">Breaking</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ backgroundColor: article.category.color + "20", color: article.category.color }}
                    >
                      {article.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{article.author.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        article.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : article.status === "draft"
                          ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          : article.status === "review"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted">
                    {article.viewCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {formatDate(article.publishedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/article/${article.slug}`}
                        className="p-1.5 rounded hover:bg-[var(--surface)]"
                        title="View"
                      >
                        <Eye size={14} className="text-muted" />
                      </Link>
                      <button className="p-1.5 rounded hover:bg-[var(--surface)]" title="Edit">
                        <Pencil size={14} className="text-muted" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-[var(--surface)]" title="Delete">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

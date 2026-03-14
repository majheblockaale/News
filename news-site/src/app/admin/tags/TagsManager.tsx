"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tag } from "@/types";
import { Hash, Plus, Trash2 } from "lucide-react";

export function TagsManager({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name || !slug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      if (res.ok) {
        setShowForm(false);
        setName("");
        setSlug("");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, tagName: string) => {
    if (!confirm(`Delete tag "${tagName}"?`)) return;
    const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          <Plus size={14} />
          New Tag
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-"));
                }}
                placeholder="Tag name"
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-md border border-[var(--border)]">
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={saving || !name || !slug}
              className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Tag"}
            </button>
          </div>
        </div>
      )}

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:shadow-sm transition-shadow"
          >
            <Hash size={16} className="text-accent shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{tag.name}</p>
              <p className="text-xs text-muted">/{tag.slug} &middot; {tag.articleCount} articles</p>
            </div>
            <button
              onClick={() => handleDelete(tag.id, tag.name)}
              className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-center text-muted py-12">No tags yet. Create one to get started.</p>
      )}
    </div>
  );
}

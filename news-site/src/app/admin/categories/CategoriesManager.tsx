"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";
import { FolderOpen, Plus, Trash2, ChevronRight } from "lucide-react";

interface CategoryWithSubs extends Category {
  subcategories: Category[];
}

export function CategoriesManager({ categories }: { categories: CategoryWithSubs[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name || !slug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description: description || undefined,
          parentId: parentId || undefined,
          color,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setName("");
        setSlug("");
        setDescription("");
        setParentId("");
        setColor("#3b82f6");
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"? Articles in this category will become orphaned.`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          <Plus size={14} />
          New Category
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-"));
                }}
                placeholder="Category name"
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
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Parent (optional)</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)]"
              >
                <option value="">None (top-level)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded border border-[var(--border)] cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)]"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-md border border-[var(--border)] hover:bg-[var(--background)]">
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={saving || !name || !slug}
              className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Category"}
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] divide-y divide-[var(--border)]">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface)] transition-colors">
              <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <FolderOpen size={16} className="text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-muted">/{cat.slug} &middot; {cat.description}</p>
              </div>
              {cat.subcategories.length > 0 && (
                <span className="text-xs text-muted">{cat.subcategories.length} sub</span>
              )}
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Delete"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
            {/* Subcategories */}
            {cat.subcategories.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-[var(--surface)] transition-colors">
                <ChevronRight size={12} className="text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{sub.name}</p>
                  <p className="text-xs text-muted">/{sub.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(sub.id, sub.name)}
                  className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

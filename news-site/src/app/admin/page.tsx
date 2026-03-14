import { getArticles, getCategories, getAuthors } from "@/lib/db";
import { FileText, Eye, Share2, Users, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [allArticles, categoryList, authorList] = await Promise.all([
    getArticles({ limit: 100 }),
    getCategories(),
    getAuthors(),
  ]);

  const published = allArticles.filter((a) => a.status === "published");
  const totalViews = published.reduce((sum, a) => sum + a.viewCount, 0);
  const totalShares = published.reduce((sum, a) => sum + a.shareCount, 0);
  const avgReadTime =
    published.length > 0
      ? Math.round(published.reduce((sum, a) => sum + a.readingTimeMinutes, 0) / published.length)
      : 0;

  const stats = [
    { label: "Published Articles", value: published.length, icon: FileText, color: "text-blue-500" },
    { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-green-500" },
    { label: "Total Shares", value: totalShares.toLocaleString(), icon: Share2, color: "text-purple-500" },
    { label: "Authors", value: authorList.length, icon: Users, color: "text-orange-500" },
    { label: "Categories", value: categoryList.length, icon: TrendingUp, color: "text-pink-500" },
    { label: "Avg Read Time", value: `${avgReadTime} min`, icon: Clock, color: "text-cyan-500" },
  ];

  const topArticles = [...published].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-muted uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Top Performing Articles */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h2 className="font-semibold">Top Performing Articles</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {topArticles.map((article, i) => (
            <div key={article.id} className="px-4 py-3 flex items-center gap-4">
              <span className="text-lg font-bold text-muted w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{article.title}</p>
                <p className="text-xs text-muted mt-0.5">
                  {article.category.name} &middot; {article.author.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">{article.viewCount.toLocaleString()} views</p>
                <p className="text-xs text-muted">{article.shareCount.toLocaleString()} shares</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--background)]">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h2 className="font-semibold">Articles by Category</h2>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {categoryList.map((cat) => {
            const count = allArticles.filter((a) => a.category.id === cat.id).length;
            return (
              <div key={cat.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm">{cat.name}</span>
                <span className="text-sm text-muted ml-auto">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

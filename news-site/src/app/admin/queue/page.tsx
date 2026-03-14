"use client";

import { useState } from "react";
import { defaultFeeds } from "@/lib/rss-aggregator";
import { ExternalLink, Rss, RefreshCw, Check, X, Loader2 } from "lucide-react";

interface QueueItem {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  url: string;
  pubDate: string;
  status: "pending" | "approved" | "rejected";
}

export default function ContentQueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [fetching, setFetching] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchStories = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/news-feed?source=rss");
      const data = await res.json();
      const items = (data.items || []).map((item: { title: string; description: string; source: string; category: string; link: string; pubDate: string }, i: number) => ({
        id: `rss-${i}-${Date.now()}`,
        title: item.title,
        description: item.description,
        source: item.source,
        category: item.category || "uncategorized",
        url: item.link,
        pubDate: item.pubDate,
        status: "pending" as const,
      }));
      setQueue(items);
      setLastFetched(new Date());
    } catch (err) {
      console.error("Failed to fetch RSS feeds:", err);
    } finally {
      setFetching(false);
    }
  };

  const updateStatus = (id: string, status: QueueItem["status"]) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const filtered = queue.filter((item) =>
    filterStatus === "all" ? true : item.status === filterStatus
  );

  const statusCounts = {
    all: queue.length,
    pending: queue.filter((q) => q.status === "pending").length,
    approved: queue.filter((q) => q.status === "approved").length,
    rejected: queue.filter((q) => q.status === "rejected").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Queue</h1>
          <p className="text-sm text-muted mt-1">
            {lastFetched
              ? `Last fetched: ${lastFetched.toLocaleTimeString()} \u2014 ${queue.length} stories`
              : "Fetch RSS feeds to populate the queue."}
          </p>
        </div>
        <button
          onClick={fetchStories}
          disabled={fetching}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {fetching ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {fetching ? "Fetching..." : "Fetch Stories"}
        </button>
      </div>

      {queue.length > 0 && (
        <>
          {/* Status Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-lg bg-[var(--surface)] w-fit">
            {(["all", "pending", "approved", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${
                  filterStatus === status
                    ? "bg-[var(--background)] font-medium shadow-sm"
                    : "text-muted hover:text-[var(--foreground)]"
                }`}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>

          {/* Queue Items */}
          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:shadow-sm transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted mt-1 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted">
                    <Rss size={12} />
                    <span>{item.source}</span>
                    <span>&middot;</span>
                    <span className="capitalize">{item.category}</span>
                    {item.pubDate && (
                      <>
                        <span>&middot;</span>
                        <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : item.status === "approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {item.status}
                  </span>

                  {item.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, "approved")}
                        className="p-1.5 rounded text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, "rejected")}
                        className="p-1.5 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-[var(--surface)]"
                    title="View source"
                  >
                    <ExternalLink size={14} className="text-muted" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {queue.length === 0 && !fetching && (
        <div className="text-center py-16 text-muted">
          <Rss size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No stories in queue</p>
          <p className="mt-1">Click &ldquo;Fetch Stories&rdquo; to pull from {defaultFeeds.length} RSS sources.</p>
        </div>
      )}

      {/* RSS Feed Sources */}
      <div className="mt-10">
        <h2 className="font-semibold mb-4">Configured RSS Sources ({defaultFeeds.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {defaultFeeds.map((feed, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-md border border-[var(--border)] text-sm"
            >
              <Rss size={14} className="text-accent shrink-0" />
              <span className="font-medium">{feed.name}</span>
              <span className="text-xs text-muted capitalize">{feed.category}</span>
              <span className="text-xs text-muted truncate ml-auto max-w-[200px]">{feed.url}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

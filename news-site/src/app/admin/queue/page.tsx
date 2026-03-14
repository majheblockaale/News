"use client";

import { useState } from "react";
import { defaultFeeds, type RSSFeedConfig } from "@/lib/rss-aggregator";
import { ExternalLink, Rss, RefreshCw, Check, Plus } from "lucide-react";

interface QueueItem {
  id: string;
  title: string;
  source: string;
  category: string;
  url: string;
  status: "pending" | "processing" | "approved" | "rejected";
  fetchedAt: string;
}

// Simulated queue items from RSS feeds
const mockQueue: QueueItem[] = [
  { id: "q1", title: "Apple Announces New MacBook Pro with M4 Ultra Chip", source: "TechCrunch", category: "technology", url: "#", status: "pending", fetchedAt: new Date().toISOString() },
  { id: "q2", title: "S&P 500 Reaches New All-Time High on AI Optimism", source: "Reuters Business", category: "business", url: "#", status: "pending", fetchedAt: new Date().toISOString() },
  { id: "q3", title: "CRISPR Gene Therapy Shows Promise in Rare Disease Trial", source: "Science Daily", category: "science", url: "#", status: "processing", fetchedAt: new Date().toISOString() },
  { id: "q4", title: "Premier League Transfer Window: Top 10 Rumored Moves", source: "ESPN", category: "sports", url: "#", status: "pending", fetchedAt: new Date().toISOString() },
  { id: "q5", title: "NASA Artemis III Mission Timeline Accelerated", source: "NASA", category: "science", url: "#", status: "approved", fetchedAt: new Date().toISOString() },
  { id: "q6", title: "EU Passes Landmark AI Regulation Framework", source: "The Verge", category: "technology", url: "#", status: "pending", fetchedAt: new Date().toISOString() },
];

export default function ContentQueuePage() {
  const [queue, setQueue] = useState(mockQueue);
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = queue.filter((item) =>
    filterStatus === "all" ? true : item.status === filterStatus
  );

  const updateStatus = (id: string, status: QueueItem["status"]) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const statusCounts = {
    all: queue.length,
    pending: queue.filter((q) => q.status === "pending").length,
    processing: queue.filter((q) => q.status === "processing").length,
    approved: queue.filter((q) => q.status === "approved").length,
    rejected: queue.filter((q) => q.status === "rejected").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Queue</h1>
          <p className="text-sm text-muted mt-1">
            Ingested stories from RSS feeds and news APIs awaiting editorial review.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-md hover:bg-[var(--surface)] transition-colors">
          <RefreshCw size={14} />
          Fetch New Stories
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg bg-[var(--surface)] w-fit">
        {(["all", "pending", "processing", "approved", "rejected"] as const).map((status) => (
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
              <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                <Rss size={12} />
                <span>{item.source}</span>
                <span>&middot;</span>
                <span className="capitalize">{item.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.status === "pending"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : item.status === "processing"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
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
                    onClick={() => updateStatus(item.id, "processing")}
                    className="p-1.5 rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Send to AI processing"
                  >
                    <RefreshCw size={16} />
                  </button>
                </>
              )}
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-[var(--surface)]" title="View source">
                <ExternalLink size={14} className="text-muted" />
              </a>
            </div>
          </div>
        ))}
      </div>

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

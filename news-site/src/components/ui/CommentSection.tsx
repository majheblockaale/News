"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, Reply } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

const mockComments: Comment[] = [
  {
    id: "c1",
    author: "Alex Thompson",
    content: "Great article! Really well researched and informative. I appreciate the balanced perspective on this topic.",
    timestamp: "2025-12-15T10:30:00Z",
    likes: 12,
    replies: [
      {
        id: "c1r1",
        author: "Maria Santos",
        content: "Agreed! The data points mentioned were particularly interesting.",
        timestamp: "2025-12-15T11:15:00Z",
        likes: 3,
      },
    ],
  },
  {
    id: "c2",
    author: "Jordan Lee",
    content: "I'd love to see a follow-up on the implications for small businesses. There's a lot of nuance there that deserves coverage.",
    timestamp: "2025-12-15T09:45:00Z",
    likes: 8,
  },
  {
    id: "c3",
    author: "Sam Rivera",
    content: "This is why I keep coming back to NewsSite. Consistently high-quality journalism.",
    timestamp: "2025-12-14T18:20:00Z",
    likes: 15,
  },
];

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [liked, setLiked] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const initials = comment.author.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const timeStr = new Date(comment.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className={depth > 0 ? "ml-10 mt-3" : ""}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold">{comment.author}</span>
            <span className="text-xs text-muted">{timeStr}</span>
          </div>
          <p className="text-sm mt-1 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                liked ? "text-accent font-medium" : "text-muted hover:text-[var(--foreground)]"
              }`}
            >
              <ThumbsUp size={12} fill={liked ? "currentColor" : "none"} />
              {comment.likes + (liked ? 1 : 0)}
            </button>
            {depth === 0 && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1 text-xs text-muted hover:text-[var(--foreground)] transition-colors"
              >
                <Reply size={12} />
                Reply
              </button>
            )}
          </div>

          {showReply && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 text-sm border border-[var(--border)] rounded-md bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                onClick={() => {
                  setReplyText("");
                  setShowReply(false);
                }}
                className="px-3 py-1.5 text-xs font-medium bg-accent text-white rounded-md hover:bg-accent/90"
              >
                Reply
              </button>
            </div>
          )}

          {comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ articleId }: { articleId: string }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(mockComments);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("popular");

  const sorted = [...comments].sort((a, b) =>
    sortBy === "popular"
      ? b.likes - a.likes
      : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: "You",
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="mt-10 pt-8 border-t border-[var(--border)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare size={20} />
          Comments ({comments.length})
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm px-2 py-1 border border-[var(--border)] rounded-md bg-[var(--background)]"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full px-4 py-3 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {sorted.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

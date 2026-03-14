"use client";

import { useState } from "react";
import { Share2, Link2, Check, Twitter, Facebook } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButton({ url, title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url: fullUrl });
      } catch {
        // User cancelled
      }
    } else {
      setOpen(!open);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="p-1.5 rounded hover:bg-[var(--surface)] text-muted hover:text-[var(--foreground)] transition-colors"
        aria-label="Share article"
      >
        <Share2 size={16} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-40 w-48 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg p-2 space-y-1">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-[var(--surface)] transition-colors"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Link2 size={14} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-[var(--surface)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <Twitter size={14} />
              Share on X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-[var(--surface)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <Facebook size={14} />
              Share on Facebook
            </a>
          </div>
        </>
      )}
    </div>
  );
}

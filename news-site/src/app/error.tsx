"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <AlertTriangle size={64} className="mx-auto mb-6 text-accent opacity-60" />
      <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
      <p className="text-muted mb-8">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-6 py-3 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

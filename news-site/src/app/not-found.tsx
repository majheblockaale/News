import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <FileQuestion size={64} className="mx-auto mb-6 text-muted opacity-30" />
      <h1 className="text-4xl font-bold mb-3">404 — Page Not Found</h1>
      <p className="text-lg text-muted mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/search"
          className="px-6 py-3 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
        >
          Search Articles
        </Link>
      </div>
    </div>
  );
}

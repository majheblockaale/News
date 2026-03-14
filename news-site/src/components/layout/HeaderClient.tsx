"use client";

import Link from "next/link";
import { useThemeStore, useMobileMenuStore } from "@/lib/store";
import type { Category } from "@/types";
import { Search, Menu, X, Sun, Moon, Bookmark } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  categories: Category[];
}

export function HeaderClient({ categories }: Props) {
  const { isDark, toggle } = useThemeStore();
  const { isOpen, toggle: toggleMenu, close } = useMobileMenuStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
      {/* Breaking News Ticker */}
      <div className="bg-accent text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center gap-2">
          <span className="font-bold text-xs uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded shrink-0">
            Breaking
          </span>
          <div className="overflow-hidden whitespace-nowrap">
            <p className="animate-marquee inline-block">
              OpenAI Unveils GPT-5 with Unprecedented Reasoning Capabilities — Federal Reserve Holds Interest Rates Steady Amid Economic Uncertainty
            </p>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary dark:text-white">
            <span className="text-accent">News</span>Site
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            <Link href="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--surface)] transition-colors">
              Home
            </Link>
            <Link href="/latest" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--surface)] transition-colors">
              Latest
            </Link>
            <Link href="/trending" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--surface)] transition-colors">
              Trending
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--surface)] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-[var(--border)] rounded-md px-3 py-1.5 text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                />
                <button onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-md hover:bg-[var(--surface)] transition-colors"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>
            )}

            {/* Saved Articles */}
            <Link
              href="/saved"
              className="p-2 rounded-md hover:bg-[var(--surface)] transition-colors"
              aria-label="Saved articles"
            >
              <Bookmark size={20} />
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-md hover:bg-[var(--surface)] transition-colors"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md hover:bg-[var(--surface)] transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav
          className="lg:hidden border-t border-[var(--border)] bg-[var(--background)]"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            <Link href="/" onClick={close} className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--surface)]">
              Home
            </Link>
            <Link href="/latest" onClick={close} className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--surface)]">
              Latest
            </Link>
            <Link href="/trending" onClick={close} className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--surface)]">
              Trending
            </Link>
            <hr className="border-[var(--border)] my-1" />
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={close}
                className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-[var(--surface)]"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

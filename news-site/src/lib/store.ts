import { create } from "zustand";

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", next ? "dark" : "light");
        document.documentElement.classList.toggle("dark", next);
      }
      return { isDark: next };
    }),
  setDark: (dark) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", dark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", dark);
    }
    set({ isDark: dark });
  },
}));

interface MobileMenuStore {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useMobileMenuStore = create<MobileMenuStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));

// Bookmark store with localStorage persistence
interface BookmarkStore {
  bookmarks: Set<string>;
  isBookmarked: (id: string) => boolean;
  toggle: (id: string) => void;
  getAll: () => string[];
}

function loadBookmarks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem("bookmarked_articles");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

function saveBookmarks(bookmarks: Set<string>) {
  if (typeof window !== "undefined") {
    localStorage.setItem("bookmarked_articles", JSON.stringify([...bookmarks]));
  }
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarks: loadBookmarks(),
  isBookmarked: (id: string) => get().bookmarks.has(id),
  toggle: (id: string) => {
    set((state) => {
      const next = new Set(state.bookmarks);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveBookmarks(next);
      return { bookmarks: next };
    });
  },
  getAll: () => [...get().bookmarks],
}));

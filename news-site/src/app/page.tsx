import { HeroSection } from "@/components/home/HeroSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { LatestNewsSection } from "@/components/home/LatestNewsSection";
import { Sidebar } from "@/components/home/Sidebar";
import { CategoryHighlights } from "@/components/home/CategoryHighlights";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-10">
      {/* Hero */}
      <HeroSection />

      {/* Trending */}
      <TrendingSection />

      {/* Latest + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LatestNewsSection />
        </div>
        <div>
          <Sidebar />
        </div>
      </div>

      {/* Category Highlights */}
      <CategoryHighlights />
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { getTrendingArticles } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

export function TrendingSection() {
  const trending = getTrendingArticles(5);

  return (
    <section aria-label="Trending stories">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-accent" />
        <h2 className="text-lg font-bold">Trending Now</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {trending.map((article, i) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group relative rounded-lg overflow-hidden aspect-[4/5] bg-[var(--surface)]"
          >
            <Image
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="text-2xl font-black text-white/30">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                {article.category.name}
              </span>
              <h3 className="text-sm font-semibold text-white leading-tight line-clamp-3 mt-1 group-hover:text-accent transition-colors">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

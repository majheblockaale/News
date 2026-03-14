import { getArticles, getCategories } from "@/lib/db";
import { AdminArticlesList } from "./AdminArticlesList";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    getArticles({ limit: 100 }),
    getCategories(),
  ]);

  return <AdminArticlesList articles={articles} categories={categories} />;
}

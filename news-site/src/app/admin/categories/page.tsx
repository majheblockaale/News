import { getCategories, getSubcategories } from "@/lib/db";
import { CategoriesManager } from "./CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const topLevel = await getCategories();

  const categoriesWithSubs = await Promise.all(
    topLevel.map(async (cat) => ({
      ...cat,
      subcategories: await getSubcategories(cat.id),
    }))
  );

  return <CategoriesManager categories={categoriesWithSubs} />;
}

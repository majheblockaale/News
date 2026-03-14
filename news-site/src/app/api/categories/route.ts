import { NextResponse } from "next/server";
import { getCategories, getSubcategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCategories();

  const result = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      subcategories: await getSubcategories(cat.id),
    }))
  );

  return NextResponse.json({ categories: result });
}

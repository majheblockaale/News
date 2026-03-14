import { NextResponse } from "next/server";
import { categories, subcategories } from "@/lib/mock-data";

export async function GET() {
  const result = categories.map((cat) => ({
    ...cat,
    subcategories: subcategories.filter((sc) => sc.parentId === cat.id),
  }));

  return NextResponse.json({ categories: result });
}

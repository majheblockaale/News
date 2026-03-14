import { getCategories } from "@/lib/db";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const categories = await getCategories();
  return <HeaderClient categories={categories} />;
}

import { getCategories } from "@/lib/db";
import { FooterClient } from "./FooterClient";

export async function Footer() {
  const categories = await getCategories();
  return <FooterClient categories={categories} />;
}

import { getArticles } from "@/lib/db";
import { BreakingNewsTickerClient } from "./BreakingNewsTickerClient";

export async function BreakingNewsTicker() {
  const breaking = await getArticles({ status: "published", breaking: true });
  if (breaking.length === 0) return null;

  return <BreakingNewsTickerClient articles={breaking} />;
}

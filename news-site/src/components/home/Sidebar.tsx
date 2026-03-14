import { getArticles, getTags } from "@/lib/db";
import { SidebarClient } from "./SidebarClient";

export async function Sidebar() {
  const [mostRead, tags] = await Promise.all([
    getArticles({ status: "published", orderBy: "trending", limit: 5 }),
    getTags(),
  ]);

  return <SidebarClient mostRead={mostRead} tags={tags} />;
}

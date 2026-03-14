import { getTags } from "@/lib/db";
import { TagsManager } from "./TagsManager";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await getTags();
  return <TagsManager tags={tags} />;
}

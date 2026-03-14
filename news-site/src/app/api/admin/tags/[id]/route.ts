import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteTag } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteTag(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 });
  }
}

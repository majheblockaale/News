import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, categories } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  await subscribeNewsletter(email, categories);
  return NextResponse.json({ success: true }, { status: 201 });
}

/**
 * Session-based admin authentication.
 * Uses SHA-256 hashed passwords and UUID session tokens.
 */
import { prisma } from "./prisma";
import { createHash, randomUUID } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "news_session";
const SESSION_EXPIRY_HOURS = 24;

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const hashed = hashPassword(password);
  if (user.password !== hashed) return null;

  // Only allow admin/editor/author to log in
  if (!["admin", "editor", "author"].includes(user.role)) return null;

  // Create session
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.session.create({
    data: { userId: user.id, token, expiresAt },
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin" && user.role !== "editor") {
    throw new Error("Forbidden");
  }
  return user;
}

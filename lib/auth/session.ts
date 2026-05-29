import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { users, sessions } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { verifyAccessToken } from "./jwt";

export type ServerSession = {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified: boolean;
    avatarUrl: string | null;
    avatarInitials: string | null;
  };
};

export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) return null;

  let payload = accessToken ? await verifyAccessToken(accessToken) : null;

  if (!payload && refreshToken) {
    const sessionRow = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.tokenHash, refreshToken),
          isNull(sessions.revokedAt)
        )
      )
      .limit(1);

    if (sessionRow.length > 0) {
      const s = sessionRow[0];
      if (s.lastSeenAt && Date.now() - s.lastSeenAt.getTime() > 30 * 24 * 60 * 60 * 1000) {
        return null;
      }
      const userRow = await db
        .select()
        .from(users)
        .where(eq(users.id, s.userId))
        .limit(1);

      if (userRow.length > 0) {
        const u = userRow[0];
        payload = { userId: u.id, role: u.role, email: u.email };
      }
    }
  }

  if (!payload) return null;

  const userRow = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (userRow.length === 0) return null;

  const u = userRow[0];
  if (u.status !== "active") return null;

  return {
    user: {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      emailVerified: u.emailVerified,
      avatarUrl: u.avatarUrl,
      avatarInitials: u.avatarInitials,
    },
  };
}

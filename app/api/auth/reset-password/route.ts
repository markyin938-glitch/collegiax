export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, emailVerifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const rows = await db.select().from(emailVerifications).where(eq(emailVerifications.token, token)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const ev = rows[0];
    if (ev.usedAt || ev.expiresAt < new Date() || ev.kind !== "reset") {
      return NextResponse.json({ error: "Token has expired or already used" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await db.update(users).set({ passwordHash }).where(eq(users.id, ev.userId));
    await db.update(emailVerifications).set({ usedAt: new Date() }).where(eq(emailVerifications.id, ev.id));

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

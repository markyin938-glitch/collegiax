export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, emailVerifications, sessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyEmailSchema } from "@/lib/validation/auth";
import { signAccessToken, generateOpaqueToken } from "@/lib/auth/jwt";
import { isEmailVerificationEnabled } from "@/lib/config/feature-flags";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    if (!isEmailVerificationEnabled()) {
      return NextResponse.json({ error: "Email verification is disabled" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { token, otpCode, email } = body as { token?: string; otpCode?: string; email?: string };

    if (!token && !otpCode) {
      return NextResponse.json({ error: "Token or OTP is required" }, { status: 400 });
    }

    let condition;
    if (token) {
      condition = eq(emailVerifications.token, token);
    } else if (email && otpCode) {
      const userRows = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (userRows.length === 0) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      condition = and(
        eq(emailVerifications.userId, userRows[0].id),
        eq(emailVerifications.otpCode, otpCode),
        eq(emailVerifications.kind, "verify")
      );
    } else {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const rows = await db.select().from(emailVerifications).where(condition!).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    const ev = rows[0];
    if (ev.usedAt || ev.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code has expired or already used" }, { status: 400 });
    }

    await db.update(emailVerifications).set({ usedAt: new Date() }).where(eq(emailVerifications.id, ev.id));
    await db.update(users).set({ emailVerified: true }).where(eq(users.id, ev.userId));

    const userRows = await db.select().from(users).where(eq(users.id, ev.userId)).limit(1);
    const user = userRows[0];

    const accessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const refreshToken = generateOpaqueToken();
    await db.insert(sessions).values({
      id: uuidv4(),
      userId: user.id,
      tokenHash: refreshToken,
    });

    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
      path: "/",
    });
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

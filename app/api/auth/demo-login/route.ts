export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import { generateOpaqueToken, signAccessToken } from "@/lib/auth/jwt";
import { isDemoLoginEnabled } from "@/lib/config/feature-flags";

const demoAccounts = {
  student: "student@collegiax.app",
  clublead: "lead@collegiax.app",
  admin: "admin@collegiax.app",
} as const;

type DemoRole = keyof typeof demoAccounts;

function isDemoRole(role: unknown): role is DemoRole {
  return typeof role === "string" && role in demoAccounts;
}

export async function POST(req: Request) {
  try {
    if (!isDemoLoginEnabled()) {
      return NextResponse.json({ error: "Demo login is disabled" }, { status: 404 });
    }

    const { role } = await req.json();
    if (!isDemoRole(role)) {
      return NextResponse.json({ error: "Invalid demo role" }, { status: 400 });
    }

    const userRows = await db.select().from(users).where(eq(users.email, demoAccounts[role])).limit(1);
    if (userRows.length === 0) {
      return NextResponse.json({ error: "Demo account not found. Seed the database first." }, { status: 404 });
    }

    const user = userRows[0];
    if (user.status !== "active") {
      return NextResponse.json({ error: "Demo account is inactive" }, { status: 403 });
    }

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

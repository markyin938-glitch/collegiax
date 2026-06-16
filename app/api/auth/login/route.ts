export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { users, sessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken, generateOpaqueToken } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validation/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password, role } = parsed.data;

    const userRows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userRows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = userRows[0];
    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.role !== role) {
      return NextResponse.json({ error: `This account is registered as ${user.role}, not ${role}.` }, { status: 403 });
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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

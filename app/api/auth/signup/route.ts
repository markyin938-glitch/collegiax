export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, emailVerifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/validation/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password, name, role } = parsed.data;

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const userId = uuidv4();
    const passwordHash = await hashPassword(password);

    await db.insert(users).values({
      id: userId,
      email,
      passwordHash,
      name,
      role,
      avatarInitials: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    });

    const token = uuidv4();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await db.insert(emailVerifications).values({
      id: uuidv4(),
      userId,
      token,
      otpCode,
      kind: "verify",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    // TODO: Send email via Resend in production
    console.log(`OTP for ${email}: ${otpCode}`);

    return NextResponse.json({ success: true, message: "Account created. Please verify your email." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

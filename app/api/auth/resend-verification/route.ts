export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, emailVerifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { isEmailVerificationEnabled } from "@/lib/config/feature-flags";

export async function POST(req: Request) {
  try {
    if (!isEmailVerificationEnabled()) {
      return NextResponse.json({ error: "Email verification is disabled" }, { status: 404 });
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userRows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userRows[0];
    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    const token = uuidv4();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await db.insert(emailVerifications).values({
      id: uuidv4(),
      userId: user.id,
      token,
      otpCode,
      kind: "verify",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    console.log(`Resent OTP for ${email}: ${otpCode}`);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

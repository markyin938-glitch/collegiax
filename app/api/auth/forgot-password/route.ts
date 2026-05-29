export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, emailVerifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email } = parsed.data;
    const userRows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userRows.length === 0) {
      return NextResponse.json({ success: true }); // Don't leak whether email exists
    }

    const user = userRows[0];
    const token = uuidv4();

    await db.insert(emailVerifications).values({
      id: uuidv4(),
      userId: user.id,
      token,
      kind: "reset",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    console.log(`Reset token for ${email}: ${token}`);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

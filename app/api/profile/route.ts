export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { updateProfileSchema } from "@/lib/validation/profile";
import { initials } from "@/lib/utils";

export async function PATCH(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const data = parsed.data;
  await db
    .update(users)
    .set({
      name: data.name,
      college: data.college,
      department: data.department ?? null,
      year: data.year ?? null,
      rollNumber: data.rollNumber ?? null,
      bio: data.bio ?? null,
      avatarInitials: initials(data.name),
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  const updated = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const user = updated[0];

  return NextResponse.json({
    profile: {
      name: user.name,
      email: user.email,
      college: user.college,
      department: user.department,
      year: user.year,
      rollNumber: user.rollNumber,
      bio: user.bio,
    },
  });
}

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { clubs, events } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/session";
import { createEventSchema } from "@/lib/validation/events";
import { requireRole } from "@/lib/auth/permissions";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db.select().from(events).orderBy(events.createdAt);
  return NextResponse.json({ events: rows });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const forbidden = requireRole(session.user.role, "clublead", "admin");
  if (forbidden) return forbidden;

  const body = await req.json();
  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const id = uuidv4();
  const slug = `${slugify(parsed.data.title)}-${Date.now()}`;
  let clubId = body.clubId;

  if (!clubId) {
    if (session.user.role === "clublead") {
      const ownedClub = await db.select().from(clubs).where(eq(clubs.leadUserId, session.user.id)).limit(1);
      clubId = ownedClub[0]?.id;
    } else if (session.user.role === "admin") {
      const anyClub = await db.select().from(clubs).limit(1);
      clubId = anyClub[0]?.id;
    }
  }

  if (!clubId) {
    return NextResponse.json({ error: "A valid club is required to create an event" }, { status: 400 });
  }

  await db.insert(events).values({
    id,
    clubId,
    createdBy: session.user.id,
    title: parsed.data.title,
    slug,
    description: parsed.data.description,
    category: parsed.data.category,
    venue: parsed.data.venue,
    startAt: parsed.data.startAt,
    endAt: parsed.data.endAt,
    registrationDeadline: parsed.data.registrationDeadline,
    capacity: parsed.data.capacity,
    tags: parsed.data.tags ? JSON.stringify(parsed.data.tags) : null,
  });

  return NextResponse.json({ success: true, event: { id, slug } });
}

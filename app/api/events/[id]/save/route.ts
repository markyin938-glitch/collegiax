export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db/client";
import { eventSaves } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/session";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await db.select().from(eventSaves).where(and(eq(eventSaves.eventId, id), eq(eventSaves.userId, session.user.id))).limit(1);
  if (existing.length === 0) {
    await db.insert(eventSaves).values({
      id: uuidv4(),
      eventId: id,
      userId: session.user.id,
    });
  }

  return NextResponse.json({ saved: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await db.select().from(eventSaves).where(and(eq(eventSaves.eventId, id), eq(eventSaves.userId, session.user.id))).limit(1);
  if (existing.length > 0) {
    await db.delete(eventSaves).where(eq(eventSaves.id, existing[0].id));
  }

  return NextResponse.json({ saved: false });
}

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db/client";
import { eventRegistrations, events } from "@/lib/db/schema";
import { getServerSession } from "@/lib/auth/session";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const eventRows = await db.select().from(events).where(eq(events.id, id)).limit(1);
  const event = eventRows[0];
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  if (event.status !== "approved") return NextResponse.json({ error: "Only approved events can be registered" }, { status: 400 });

  const existing = await db.select().from(eventRegistrations).where(and(eq(eventRegistrations.eventId, id), eq(eventRegistrations.userId, session.user.id))).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ registered: true });
  }
  if (event.capacity > 0 && event.registeredCount >= event.capacity) {
    return NextResponse.json({ error: "This event is full" }, { status: 400 });
  }

  await db.insert(eventRegistrations).values({
    id: uuidv4(),
    eventId: id,
    userId: session.user.id,
  });
  await db.update(events).set({ registeredCount: event.registeredCount + 1 }).where(eq(events.id, id));

  return NextResponse.json({ registered: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await db.select().from(eventRegistrations).where(and(eq(eventRegistrations.eventId, id), eq(eventRegistrations.userId, session.user.id))).limit(1);
  if (existing.length === 0) {
    return NextResponse.json({ registered: false });
  }

  await db.delete(eventRegistrations).where(eq(eventRegistrations.id, existing[0].id));
  const eventRows = await db.select().from(events).where(eq(events.id, id)).limit(1);
  const event = eventRows[0];
  if (event) {
    await db.update(events).set({ registeredCount: Math.max(0, event.registeredCount - 1) }).where(eq(events.id, id));
  }

  return NextResponse.json({ registered: false });
}

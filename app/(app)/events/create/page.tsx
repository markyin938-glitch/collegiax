// @ts-nocheck
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { clubs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { EventWizardForm } from "@/components/app/event-wizard-form";
import { PageIntro } from "@/components/app/ui";

export default async function CreateEventPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session.user.role === "student") redirect("/events");

  const availableClubs = session.user.role === "admin"
    ? await db.select({ id: clubs.id, name: clubs.name, leadUserId: clubs.leadUserId }).from(clubs)
    : await db.select({ id: clubs.id, name: clubs.name, leadUserId: clubs.leadUserId }).from(clubs).where(eq(clubs.leadUserId, session.user.id));

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Create event"
        title="Launch a new campus experience"
        description="This screen mirrors the new create-event wizard while continuing to submit through the existing events API."
      />
      <EventWizardForm
        clubs={availableClubs.map((club) => ({ id: club.id, name: club.name }))}
        initialClubId={availableClubs[0]?.id}
      />
    </div>
  );
}

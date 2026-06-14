// @ts-nocheck
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Users2 } from "lucide-react";
import { getServerSession } from "@/lib/auth/session";
import { getEventDetail } from "@/lib/server/app-data";
import { formatDateTime } from "@/lib/utils";
import { Badge, PageIntro, SectionTitle, SurfaceCard } from "@/components/app/ui";
import { EventActions } from "@/components/app/event-actions";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return null;
  const { id } = await params;
  const event = await getEventDetail(id, session.user.id);
  if (!event) notFound();

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Event details"
        title={event.title}
        description={event.description || "This event has been created in the new CollegiaX UI and remains connected to the existing event backend."}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="p-6">
          <SectionTitle title="Overview" description="Core information, tags, and participation details." />
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone={event.status === "approved" ? "success" : event.status === "pending" ? "warning" : "neutral"}>{event.status}</Badge>
            {event.category ? <Badge>{event.category}</Badge> : null}
            {event.tagsList.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="ui-panel p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Club</p>
              <p className="mt-2 font-heading text-xl font-semibold text-[var(--on-background)]">{event.club?.name || "Independent event"}</p>
            </div>
            <div className="ui-panel p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Venue</p>
              <p className="mt-2 font-heading text-xl font-semibold text-[var(--on-background)]">{event.venue || "To be announced"}</p>
            </div>
            <div className="ui-panel p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Starts</p>
              <p className="mt-2 text-sm text-[var(--on-surface)]">{event.startAt ? formatDateTime(event.startAt) : "Schedule in progress"}</p>
            </div>
            <div className="ui-panel p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Deadline</p>
              <p className="mt-2 text-sm text-[var(--on-surface)]">{event.registrationDeadline ? formatDateTime(event.registrationDeadline) : "No deadline set"}</p>
            </div>
          </div>
        </SurfaceCard>

        <div className="space-y-6">
          <SurfaceCard className="p-6">
            <SectionTitle title="Participation" description="Use the live actions backed by the event registration and save APIs." />
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm text-[var(--on-surface-variant)]">
                {event.capacity > 0
                  ? `${event.participantCount} of ${event.capacity} seats currently taken.`
                  : `${event.participantCount} students currently registered.`}
              </div>
              <EventActions eventId={event.id} initialRegistered={event.isRegistered} initialSaved={event.isSaved} />
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <SectionTitle title="Participants" description="A live snapshot from the event registrations table." />
            <div className="mt-5 space-y-3">
              {event.participants.slice(0, 6).map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-white">
                    {participant.avatarInitials || participant.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--on-background)]">{participant.name}</p>
                    <p className="truncate text-sm text-[var(--on-surface-variant)]">{participant.email}</p>
                  </div>
                </div>
              ))}
              {event.participants.length === 0 ? (
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm text-[var(--on-surface-variant)]">
                  No participants yet. Registration is live and this panel will update as students join.
                </div>
              ) : null}
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}

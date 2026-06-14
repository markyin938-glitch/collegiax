// @ts-nocheck
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getManageEventsData } from "@/lib/server/app-data";
import { formatDateTime } from "@/lib/utils";
import { Badge, EmptyState, PageIntro, SectionTitle, SurfaceCard } from "@/components/app/ui";

export default async function ManageEventsPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session.user.role === "student") redirect("/events");

  const events = await getManageEventsData(session.user.id);

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Participant management" title="Manage club events" description="A Stitch-inspired management view showing owned events, approval state, and live participant records from the registration table." />
      {events.length === 0 ? (
        <EmptyState title="No managed events yet" description="Create an event first, then return here to track registrations and event status." />
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <SurfaceCard key={event.id} className="p-6">
              <SectionTitle title={event.title} description={`${event.club?.name || "Independent event"} · ${event.venue || "Venue pending"}`} actions={<Badge tone={event.status === "approved" ? "success" : event.status === "pending" ? "warning" : "neutral"}>{event.status}</Badge>} />
              <div className="mt-5 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-3">
                  <div className="ui-panel p-4 text-sm text-[var(--on-surface-variant)]">
                    Starts {event.startAt ? formatDateTime(event.startAt) : "TBD"} · {event.capacity > 0 ? `${event.participants.length}/${event.capacity} seats` : `${event.participants.length} registrations`}
                  </div>
                  <p className="text-sm leading-7 text-[var(--on-surface-variant)]">
                    {event.description || "No detailed event description has been published yet."}
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-[var(--on-background)]">Participants</h3>
                  <div className="space-y-3">
                    {event.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-3">
                        <div>
                          <p className="font-medium text-[var(--on-background)]">{participant.user?.name || "Unknown attendee"}</p>
                          <p className="text-sm text-[var(--on-surface-variant)]">{participant.user?.email || participant.userId}</p>
                        </div>
                        <Badge tone="primary">{participant.status}</Badge>
                      </div>
                    ))}
                    {event.participants.length === 0 ? <p className="text-sm text-[var(--on-surface-variant)]">No registrations yet.</p> : null}
                  </div>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      )}
    </div>
  );
}

// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";
import { getEventsFeed } from "@/lib/server/app-data";
import { formatDateTime } from "@/lib/utils";
import { Badge, EmptyState, PageIntro, SurfaceCard } from "@/components/app/ui";

export default async function SavedPage() {
  const session = await getServerSession();
  if (!session) return null;
  const saved = (await getEventsFeed(session.user.id)).filter((event) => event.isSaved);

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Saved events" title="Your shortlist" description="Saved events are backed by the new save/unsave API and reflected here in a cleaner discovery layout." />
      {saved.length === 0 ? (
        <EmptyState title="Nothing saved yet" description="Save an event from the discovery or detail views and it will appear here." action={<Link href="/events" className="ui-button ui-button-primary">Browse events</Link>} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {saved.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="ui-card p-6 transition hover:-translate-y-1 hover:border-[var(--primary)]">
              <div className="flex items-center gap-2">
                <Badge tone="primary">Saved</Badge>
                {event.category ? <Badge>{event.category}</Badge> : null}
              </div>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-[var(--on-background)]">{event.title}</h2>
              <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{event.club?.name || "Independent event"} · {event.venue || "Venue pending"}</p>
              <p className="mt-4 text-sm text-[var(--on-surface)]">{event.startAt ? formatDateTime(event.startAt) : "To be announced"}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

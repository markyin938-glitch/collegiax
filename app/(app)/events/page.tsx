// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { getServerSession } from "@/lib/auth/session";
import { getEventsFeed } from "@/lib/server/app-data";
import { formatDateTime } from "@/lib/utils";
import { Badge, EmptyState, FilterInput, PageIntro, PrimaryButton, SectionTitle, SelectField, SurfaceCard } from "@/components/app/ui";

type Search = Promise<{ q?: string; category?: string; status?: string }>;

export default async function EventsPage({ searchParams }: { searchParams: Search }) {
  const session = await getServerSession();
  if (!session) return null;
  const params = await searchParams;
  const query = params.q?.toLowerCase() ?? "";
  const category = params.category ?? "all";
  const status = params.status ?? "all";

  const events = (await getEventsFeed(session.user.id)).filter((event) => {
    const matchesQuery =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.club?.name?.toLowerCase().includes(query) ||
      event.venue?.toLowerCase().includes(query);
    const matchesCategory = category === "all" || event.category === category;
    const matchesStatus = status === "all" || event.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Events discovery"
        title="Find your next campus moment"
        description="Browse the redesigned event catalog, filter by category or status, and keep the underlying event data connected to the existing backend."
        actions={session.user.role === "clublead" ? <Link href="/events/create" className="ui-button ui-button-primary">Create event</Link> : undefined}
      />

      <SurfaceCard className="p-6">
        <SectionTitle title="Filters" description="Search across titles, clubs, venues, categories, and approval status." />
        <form className="mt-5 flex flex-col gap-3 lg:flex-row">
          <FilterInput defaultValue={params.q} placeholder="Search events, clubs, or venues" />
          <SelectField name="category" defaultValue={category}>
            <option value="all">All categories</option>
            <option value="tech">Tech</option>
            <option value="culture">Culture</option>
            <option value="sports">Sports</option>
            <option value="workshop">Workshop</option>
            <option value="social">Social</option>
          </SelectField>
          <SelectField name="status" defaultValue={status}>
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </SelectField>
          <PrimaryButton type="submit" className="justify-center">Apply filters</PrimaryButton>
        </form>
      </SurfaceCard>

      {events.length === 0 ? (
        <EmptyState
          title="No events match this view"
          description="Try adjusting your search terms or category filters. The underlying data feed is active; this view is simply filtered down to zero results."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="ui-card flex flex-col p-6 transition hover:-translate-y-1 hover:border-[var(--primary)]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={event.status === "approved" ? "success" : event.status === "pending" ? "warning" : "neutral"}>{event.status}</Badge>
                {event.category ? <Badge>{event.category}</Badge> : null}
                {event.isRegistered ? <Badge tone="primary">Registered</Badge> : null}
                {event.isSaved ? <Badge tone="neutral">Saved</Badge> : null}
              </div>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-[var(--on-background)]">{event.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">
                {event.description || "Event details will appear here once the organizer publishes more information."}
              </p>
              <div className="mt-5 grid gap-3 text-sm text-[var(--on-surface-variant)] sm:grid-cols-2">
                <div>
                  <p className="font-medium text-[var(--on-background)]">Club</p>
                  <p>{event.club?.name || "Independent event"}</p>
                </div>
                <div>
                  <p className="font-medium text-[var(--on-background)]">Schedule</p>
                  <p>{event.startAt ? formatDateTime(event.startAt) : "To be announced"}</p>
                </div>
                <div>
                  <p className="font-medium text-[var(--on-background)]">Venue</p>
                  <p>{event.venue || "Campus venue pending"}</p>
                </div>
                <div>
                  <p className="font-medium text-[var(--on-background)]">Capacity</p>
                  <p>{event.capacity > 0 ? `${event.registeredCount}/${event.capacity}` : `${event.registeredCount} registered`}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

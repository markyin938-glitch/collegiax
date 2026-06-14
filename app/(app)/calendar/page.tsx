// @ts-nocheck
export const dynamic = "force-dynamic";

import { getEventsFeed } from "@/lib/server/app-data";
import { formatDateTime } from "@/lib/utils";
import { Badge, PageIntro, SectionTitle, SurfaceCard } from "@/components/app/ui";

export default async function CalendarPage() {
  const events = (await getEventsFeed()).filter((event) => event.startAt);
  const groups = events.reduce<Record<string, typeof events>>((acc, event) => {
    const key = new Date(event.startAt as Date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    acc[key] = acc[key] ?? [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Calendar schedule"
        title="Track the rhythm of campus"
        description="A refreshed schedule view backed by real event dates, grouped by month for easier planning."
      />
      <div className="space-y-6">
        {Object.entries(groups).map(([month, items]) => (
          <SurfaceCard key={month} className="p-6">
            <SectionTitle title={month} description={`${items.length} scheduled events`} />
            <div className="mt-5 space-y-4">
              {items.map((event) => (
                <div key={event.id} className="grid gap-4 rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-5 py-4 md:grid-cols-[180px_1fr_auto] md:items-center">
                  <div className="text-sm font-medium text-[var(--primary)]">{formatDateTime(event.startAt!)}</div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">{event.title}</h3>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{event.club?.name || "Independent event"} · {event.venue || "Venue pending"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {event.category ? <Badge>{event.category}</Badge> : null}
                    <Badge tone={event.status === "approved" ? "success" : "warning"}>{event.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}

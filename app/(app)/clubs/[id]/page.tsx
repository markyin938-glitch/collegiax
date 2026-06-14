// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getClubDetail } from "@/lib/server/app-data";
import { formatDateTime } from "@/lib/utils";
import { Badge, PageIntro, SectionTitle, SurfaceCard } from "@/components/app/ui";

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const club = await getClubDetail(id);
  if (!club) notFound();

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Club profile" title={club.emoji ? `${club.emoji} ${club.name}` : club.name} description={club.description || "Detailed club context, event activity, and member information now live in the new UI."} />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="p-6">
          <SectionTitle title="Club overview" description="Live metadata from the clubs table." />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="ui-panel p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Category</p><p className="mt-2 text-[var(--on-background)]">{club.category || "General"}</p></div>
            <div className="ui-panel p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Members</p><p className="mt-2 text-[var(--on-background)]">{club.members.length}</p></div>
            <div className="ui-panel p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Events</p><p className="mt-2 text-[var(--on-background)]">{club.events.length}</p></div>
          </div>
          <div className="mt-5 rounded-[1.25rem] bg-[var(--surface-container-low)] px-5 py-5 text-sm leading-7 text-[var(--on-surface-variant)]">
            Lead: {club.lead?.name || "No lead assigned yet"} · Status: {club.status}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <SectionTitle title="Recent events" description="The latest event activity linked to this club." actions={<Link href={`/clubs/${club.id}/members`} className="ui-button ui-button-secondary">View members</Link>} />
          <div className="mt-5 space-y-4">
            {club.events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-4 block transition hover:border-[var(--primary)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">{event.title}</h3>
                  <Badge>{event.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{event.startAt ? formatDateTime(event.startAt) : "Date pending"}</p>
              </Link>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

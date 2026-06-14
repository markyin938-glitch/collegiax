// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { getClubsDirectory } from "@/lib/server/app-data";
import { Badge, EmptyState, FilterInput, PageIntro, PrimaryButton, SectionTitle, SurfaceCard } from "@/components/app/ui";

type Search = Promise<{ q?: string }>;

export default async function ClubsPage({ searchParams }: { searchParams: Search }) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() ?? "";
  const clubs = (await getClubsDirectory()).filter((club) => {
    if (!query) return true;
    return (
      club.name.toLowerCase().includes(query) ||
      club.category?.toLowerCase().includes(query) ||
      club.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Clubs explorer"
        title="Discover campus communities"
        description="Browse active clubs with live member counts, event totals, categories, and lead information pulled from the current database."
      />
      <SurfaceCard className="p-6">
        <SectionTitle title="Search clubs" description="Filter by club name, category, or description." />
        <form className="mt-5 flex flex-col gap-3 sm:flex-row">
          <FilterInput defaultValue={params.q} placeholder="Search clubs" />
          <PrimaryButton type="submit" className="justify-center">Search</PrimaryButton>
        </form>
      </SurfaceCard>
      {clubs.length === 0 ? (
        <EmptyState title="No clubs found" description="Try a broader search term or seed more clubs into the database." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {clubs.map((club) => (
            <Link key={club.id} href={`/clubs/${club.id}`} className="ui-card p-6 transition hover:-translate-y-1 hover:border-[var(--primary)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">{club.emoji ? `${club.emoji} ${club.name}` : club.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">{club.description || "Club profile and activity details will appear here."}</p>
                </div>
                {club.category ? <Badge>{club.category}</Badge> : null}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="ui-panel p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Members</p>
                  <p className="mt-2 font-heading text-xl font-semibold text-[var(--on-background)]">{club.memberCount}</p>
                </div>
                <div className="ui-panel p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Events</p>
                  <p className="mt-2 font-heading text-xl font-semibold text-[var(--on-background)]">{club.eventCount}</p>
                </div>
                <div className="ui-panel p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Lead</p>
                  <p className="mt-2 text-sm text-[var(--on-surface)]">{club.lead?.name || "Unassigned"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

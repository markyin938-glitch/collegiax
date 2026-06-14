// @ts-nocheck
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getClubDetail } from "@/lib/server/app-data";
import { Badge, PageIntro, SurfaceCard } from "@/components/app/ui";

export default async function ClubMembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const club = await getClubDetail(id);
  if (!club) notFound();

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Members" title={`${club.name} member roster`} description="A redesigned member management view backed by the club membership table." />
      <SurfaceCard className="overflow-hidden">
        <div className="grid grid-cols-[1.3fr_0.8fr_0.6fr] gap-4 border-b border-[var(--outline-variant)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          <span>Member</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-[var(--outline-variant)]">
          {club.members.map((member) => (
            <div key={member.id} className="grid grid-cols-[1.3fr_0.8fr_0.6fr] gap-4 px-6 py-4 text-sm">
              <div>
                <p className="font-medium text-[var(--on-background)]">{member.user?.name || member.userId}</p>
                <p className="text-[var(--on-surface-variant)]">{member.user?.email || "No email available"}</p>
              </div>
              <div className="text-[var(--on-background)]">{member.clubRole}</div>
              <div><Badge tone={member.status === "active" ? "success" : "neutral"}>{member.status}</Badge></div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}

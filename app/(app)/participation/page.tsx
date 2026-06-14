// @ts-nocheck
export const dynamic = "force-dynamic";

import { getServerSession } from "@/lib/auth/session";
import { getParticipationData } from "@/lib/server/app-data";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Badge, PageIntro, SectionTitle, StatCard, SurfaceCard } from "@/components/app/ui";

export default async function ParticipationPage() {
  const session = await getServerSession();
  if (!session) return null;
  const data = await getParticipationData(session.user.id);

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Participation showcase" title="Your campus journey" description="Achievements, certificates, and registrations now surface through the new UI while staying connected to the existing participation tables." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total score" value={data.score?.totalScore ?? 0} />
        <StatCard label="Events attended" value={data.score?.eventsAttended ?? data.registrations.length} />
        <StatCard label="Certificates earned" value={data.score?.certsEarned ?? data.certificates.length} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SurfaceCard className="p-6">
          <SectionTitle title="Achievements" description="Badges and milestones earned across campus activity." />
          <div className="mt-5 space-y-4">
            {data.achievements.map((achievement) => (
              <div key={achievement.id} className="rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">{achievement.badgeName}</h3>
                  <Badge tone="primary">Badge</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">Earned on {formatDate(achievement.earnedAt)}</p>
              </div>
            ))}
            {data.achievements.length === 0 ? <p className="text-sm text-[var(--on-surface-variant)]">No achievements yet.</p> : null}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <SectionTitle title="Certificates" description="Credentials tied to completed events and issued recognitions." />
          <div className="mt-5 space-y-4">
            {data.certificates.map((certificate) => (
              <div key={certificate.id} className="rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-4">
                <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">{certificate.title}</h3>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                  {certificate.event?.title || "General recognition"} · Issued {formatDate(certificate.issuedAt)}
                </p>
              </div>
            ))}
            {data.certificates.length === 0 ? <p className="text-sm text-[var(--on-surface-variant)]">No certificates yet.</p> : null}
          </div>
        </SurfaceCard>
      </div>
      <SurfaceCard className="p-6">
        <SectionTitle title="Registration history" description="A timeline of your event participation activity." />
        <div className="mt-5 space-y-4">
          {data.registrations.map((registration) => (
            <div key={registration.id} className="grid gap-4 rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">{registration.event?.title || "Event removed"}</h3>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{registration.event?.venue || "Venue pending"} · {registration.event?.startAt ? formatDateTime(registration.event.startAt) : "Date pending"}</p>
              </div>
              <Badge tone={registration.status === "registered" ? "primary" : "neutral"}>{registration.status}</Badge>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}

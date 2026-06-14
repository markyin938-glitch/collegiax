// @ts-nocheck
export const dynamic = "force-dynamic";

import { getAnnouncementsWithAuthors } from "@/lib/server/app-data";
import { Badge, EmptyState, PageIntro, SurfaceCard } from "@/components/app/ui";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncementsWithAuthors();

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Announcements" title="Manage communication" description="A refreshed admin announcements view reading from the existing announcements table." />
      {announcements.length === 0 ? (
        <EmptyState title="No announcements yet" description="Once announcements are created, they will appear here with audience and priority details." />
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <SurfaceCard key={announcement.id} className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={announcement.priority === "urgent" ? "danger" : announcement.priority === "info" ? "primary" : "neutral"}>{announcement.priority}</Badge>
                <Badge>{announcement.audience}</Badge>
              </div>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-[var(--on-background)]">{announcement.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">{announcement.body}</p>
              <p className="mt-4 text-sm text-[var(--on-surface-variant)]">By {announcement.author?.name || "Unknown author"}</p>
            </SurfaceCard>
          ))}
        </div>
      )}
    </div>
  );
}

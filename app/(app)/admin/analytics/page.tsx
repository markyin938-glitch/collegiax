// @ts-nocheck
export const dynamic = "force-dynamic";

import { getAdminOverviewData } from "@/lib/server/app-data";
import { PageIntro, StatCard, SurfaceCard } from "@/components/app/ui";

export default async function AdminAnalyticsPage() {
  const data = await getAdminOverviewData();
  const students = data.users.filter((user) => user.role === "student").length;
  const leads = data.users.filter((user) => user.role === "clublead").length;
  const admins = data.users.filter((user) => user.role === "admin").length;
  const approvedEvents = data.events.filter((event) => event.status === "approved").length;

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Analytics" title="Platform metrics" description="A simple analytics surface using real counts from users, clubs, events, and registrations." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={students} />
        <StatCard label="Club leads" value={leads} />
        <StatCard label="Admins" value={admins} />
        <StatCard label="Approved events" value={approvedEvents} />
      </div>
      <SurfaceCard className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="ui-panel p-5"><p className="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Clubs</p><p className="mt-2 font-heading text-3xl font-semibold">{data.clubs.length}</p></div>
          <div className="ui-panel p-5"><p className="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Registrations</p><p className="mt-2 font-heading text-3xl font-semibold">{data.registrations.length}</p></div>
          <div className="ui-panel p-5"><p className="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Announcements</p><p className="mt-2 font-heading text-3xl font-semibold">{data.announcements.length}</p></div>
        </div>
      </SurfaceCard>
    </div>
  );
}

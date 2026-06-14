// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getAdminOverviewData } from "@/lib/server/app-data";
import { Badge, PageIntro, StatCard, SurfaceCard } from "@/components/app/ui";

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");
  const data = await getAdminOverviewData();
  const pendingEvents = data.events.filter((event) => event.status === "pending");

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Admin dashboard" title="Campus operations overview" description="A redesigned admin command view surfacing event approvals, user counts, registration volume, and announcement activity from the current backend." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending approvals" value={pendingEvents.length} />
        <StatCard label="Campus users" value={data.users.length} />
        <StatCard label="Active clubs" value={data.clubs.length} />
        <StatCard label="Registrations" value={data.registrations.length} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="p-6">
          <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">Pending approvals</h2>
          <div className="mt-5 space-y-4">
            {pendingEvents.map((event) => (
              <div key={event.id} className="rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">{event.title}</h3>
                    <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{event.venue || "Venue pending"} · {event.category || "Uncategorized"}</p>
                  </div>
                  <Badge tone="warning">pending</Badge>
                </div>
              </div>
            ))}
            {pendingEvents.length === 0 ? <p className="text-sm text-[var(--on-surface-variant)]">No pending approvals right now.</p> : null}
          </div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">Admin shortcuts</h2>
          <div className="mt-5 space-y-3">
            {[
              { href: "/admin/users", label: "Review users" },
              { href: "/admin/analytics", label: "View analytics" },
              { href: "/admin/announcements", label: "Manage announcements" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-4 text-sm font-medium text-[var(--on-background)] transition hover:border-[var(--primary)]">
                {item.label}
                <span className="text-[var(--primary)]">Open</span>
              </Link>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

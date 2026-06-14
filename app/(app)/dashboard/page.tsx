// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, CalendarDays, Sparkles, Users2 } from "lucide-react";
import { getServerSession } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/utils";
import { getRoleDashboardData } from "@/lib/server/app-data";
import { Badge, PageIntro, SectionTitle, StatCard, SurfaceCard } from "@/components/app/ui";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session.user.role === "admin") redirect("/admin");

  const dashboard = await getRoleDashboardData(session);

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Dashboard"
        title={`Welcome back, ${session.user.name}`}
        description="Your campus workspace now reflects the new CollegiaX design system while keeping the same backend, routing, and role-aware flow underneath."
        actions={
          <Link href={session.user.role === "clublead" ? "/events/create" : "/events"} className="ui-button ui-button-primary">
            {session.user.role === "clublead" ? "Create event" : "Explore events"}
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={stat.label.includes("event") ? <CalendarDays className="h-5 w-5" /> : stat.label.includes("club") ? <Users2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <SurfaceCard className="p-6">
          <SectionTitle
            title={session.user.role === "clublead" ? "Operational focus" : "Upcoming opportunities"}
            description={session.user.role === "clublead" ? "Events and participation linked to your club activity." : "Recommended events and campus moments worth your attention."}
          />
          <div className="mt-5 space-y-4">
            {dashboard.spotlightEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex flex-col gap-4 rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-5 py-4 transition hover:border-[var(--primary)] hover:bg-[color:rgba(42,96,137,0.06)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge tone={event.status === "approved" ? "success" : event.status === "pending" ? "warning" : "neutral"}>{event.status}</Badge>
                    {event.category ? <Badge>{event.category}</Badge> : null}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">{event.title}</h3>
                  <p className="text-sm text-[var(--on-surface-variant)]">{event.venue || "Campus venue to be announced"}</p>
                </div>
                <div className="text-sm text-[var(--on-surface-variant)]">
                  {event.startAt ? formatDateTime(event.startAt) : "Scheduling in progress"}
                </div>
              </Link>
            ))}
            {dashboard.spotlightEvents.length === 0 ? (
              <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-5 py-6 text-sm text-[var(--on-surface-variant)]">
                No spotlight items yet. Once more events and activity are added, this space will populate automatically.
              </div>
            ) : null}
          </div>
        </SurfaceCard>

        <div className="space-y-6">
          <SurfaceCard className="p-6">
            <SectionTitle title="Announcements" description="Campus-wide updates and important notices." />
            <div className="mt-5 space-y-4">
              {dashboard.announcements.map((announcement) => (
                <div key={announcement.id} className="rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">{announcement.priority}</p>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-[var(--on-background)]">{announcement.title}</h3>
                  <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{announcement.body}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          {"notifications" in dashboard ? (
            <SurfaceCard className="p-6">
              <SectionTitle title="Recent notifications" description="Fresh activity from your campus network." />
              <div className="mt-5 space-y-3">
                {dashboard.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:rgba(42,96,137,0.12)] text-[var(--primary)]">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--on-background)]">{notification.title}</p>
                      <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{notification.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Bot,
  CalendarCheck2,
  CalendarDays,
  ChartColumn,
  CircleDollarSign,
  FileBarChart2,
  Handshake,
  Megaphone,
  Sparkles,
  Target,
  Trophy,
  UserPlus,
  Users2,
} from "lucide-react";
import { getServerSession } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/utils";
import { getRoleDashboardData } from "@/lib/server/app-data";
import { Badge, PageIntro, SectionTitle, SurfaceCard } from "@/components/app/ui";

function getStatIcon(label: string) {
  if (label.toLowerCase().includes("event")) return <CalendarDays className="h-5 w-5" />;
  if (label.toLowerCase().includes("club")) return <Users2 className="h-5 w-5" />;
  if (label.toLowerCase().includes("participation")) return <Trophy className="h-5 w-5" />;
  if (label.toLowerCase().includes("registration")) return <UserPlus className="h-5 w-5" />;
  if (label.toLowerCase().includes("collaboration")) return <Handshake className="h-5 w-5" />;
  return <Sparkles className="h-5 w-5" />;
}

function StudentHero({ session, featuredEvent }: { session: any; featuredEvent: any }) {
  return (
    <section className="relative overflow-hidden border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(170,218,255,0.35),transparent_38%),linear-gradient(135deg,#0c314e_0%,#1c4f76_42%,#eef3f8_100%)]" />
      <div className="relative grid min-h-[320px] gap-8 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-10">
        <div className="flex flex-col justify-end">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tone="primary">Featured</Badge>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/82">
              {featuredEvent?.startAt ? formatDateTime(featuredEvent.startAt) : "Campus spotlight"}
            </span>
          </div>
          <h1 className="font-heading text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            {featuredEvent?.title || "Discover the next campus experience"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/84 sm:text-base">
            Welcome back, {session.user.name}. Your dashboard is tuned for event discovery, participation progress, and the clubs shaping your campus week.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/events" className="ui-button ui-button-primary border-white bg-white text-[#0c314e]">
              Register now
            </Link>
            <Link href="/calendar" className="ui-button ui-button-secondary border-white bg-transparent text-white">
              View schedule
            </Link>
          </div>
        </div>

        <div className="grid gap-4 self-end sm:grid-cols-2">
          {[
            {
              href: "/clubs",
              label: "Browse clubs",
              icon: <Users2 className="h-5 w-5" />,
            },
            {
              href: "/events",
              label: "Join event",
              icon: <CalendarCheck2 className="h-5 w-5" />,
            },
            {
              href: "/calendar",
              label: "View schedule",
              icon: <CalendarDays className="h-5 w-5" />,
            },
            {
              href: "/assistant",
              label: "AI assistant",
              icon: <Bot className="h-5 w-5" />,
            },
          ].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[112px] flex-col justify-between border px-4 py-4 transition hover:border-white/80 hover:bg-white/12 ${
                index === 3
                  ? "border-[var(--secondary-container)] bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
                  : "border-white/20 bg-white/10 text-white backdrop-blur"
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentOverview({ stats }: { stats: any[] }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
      <div>
        <h2 className="mb-4 font-heading text-xl font-semibold text-[var(--on-background)]">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/clubs", label: "Browse clubs", icon: <Users2 className="h-5 w-5" /> },
            { href: "/events", label: "Join event", icon: <CalendarCheck2 className="h-5 w-5" /> },
            { href: "/calendar", label: "View schedule", icon: <CalendarDays className="h-5 w-5" /> },
            { href: "/assistant", label: "AI assistant", icon: <Bot className="h-5 w-5" /> },
          ].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[122px] flex-col items-center justify-center gap-3 border px-4 py-5 text-center transition hover:border-[var(--primary)] ${
                index === 3
                  ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
                  : "bg-[var(--surface-container-lowest)] text-[var(--on-background)]"
              }`}
            >
              <span className={index === 3 ? "text-current" : "text-[var(--primary)]"}>{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-heading text-xl font-semibold text-[var(--on-background)]">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {stats.slice(0, 2).map((stat) => (
            <div key={stat.label} className="border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]">
                {getStatIcon(stat.label)}
              </div>
              <p className="mt-4 font-heading text-3xl font-semibold text-[var(--on-background)]">{stat.value}</p>
              <p className="mt-1 text-xs text-[var(--on-surface-variant)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentUpcoming({ events }: { events: any[] }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-heading text-xl font-semibold text-[var(--on-background)]">Upcoming for you</h2>
        <Link href="/events" className="text-sm font-medium text-[var(--primary)]">
          View all
        </Link>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="grid gap-4 border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-4 transition hover:border-[var(--primary)] sm:grid-cols-[112px_1fr]"
          >
            <div className="flex min-h-[112px] items-end bg-[linear-gradient(135deg,#2a6089_0%,#9accfa_100%)] p-3 text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                {event.startAt ? formatDateTime(event.startAt) : "Upcoming"}
              </span>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={event.status === "approved" ? "success" : "warning"}>{event.status}</Badge>
                  {event.category ? <Badge>{event.category}</Badge> : null}
                </div>
                <h3 className="mt-3 font-heading text-xl font-semibold text-[var(--on-background)]">{event.title}</h3>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                  {event.venue || "Venue pending"} · {event.club?.name || "Campus event"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--on-surface-variant)]">Open details</span>
                <ArrowRight className="h-4 w-4 text-[var(--primary)]" />
              </div>
            </div>
          </Link>
        ))}
        {events.length === 0 ? (
          <div className="border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6 text-sm text-[var(--on-surface-variant)]">
            No upcoming events have been highlighted yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function StudentDashboard({ session, dashboard }: { session: any; dashboard: any }) {
  return (
    <div className="space-y-8">
      <StudentHero session={session} featuredEvent={dashboard.spotlightEvents[0]} />
      <StudentOverview stats={dashboard.stats} />
      <StudentUpcoming events={dashboard.spotlightEvents} />
    </div>
  );
}

function ClubLeadHeader({ session }: { session: any }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="ui-eyebrow">Club lead dashboard</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--on-background)] sm:text-4xl">
          Lead dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--on-surface-variant)] sm:text-base">
          Analytics and management for your club. This view follows the operations-first reference from the role screens folder.
        </p>
      </div>
      <div className="flex border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-1">
        <button className="bg-[var(--secondary-container)] px-4 py-2 text-sm font-medium text-[var(--on-secondary-container)]">
          Weekly
        </button>
        <button className="px-4 py-2 text-sm font-medium text-[var(--on-surface-variant)]">Monthly</button>
        <button className="px-4 py-2 text-sm font-medium text-[var(--on-surface-variant)]">Semester</button>
      </div>
    </div>
  );
}

function ClubLeadStats({ stats }: { stats: any[] }) {
  const statMeta = [
    { tone: "bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]", icon: <UserPlus className="h-5 w-5" /> },
    { tone: "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]", icon: <ChartColumn className="h-5 w-5" /> },
    { tone: "bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed)]", icon: <CircleDollarSign className="h-5 w-5" /> },
    { tone: "bg-[var(--error-container)] text-[var(--error)]", icon: <Target className="h-5 w-5" /> },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={stat.label} className="border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-5">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-[var(--on-surface-variant)]">{stat.label}</span>
            <div className={`flex h-10 w-10 items-center justify-center ${statMeta[index]?.tone || statMeta[0].tone}`}>
              {statMeta[index]?.icon || getStatIcon(stat.label)}
            </div>
          </div>
          <div className="mt-6">
            <p className="font-heading text-3xl font-semibold text-[var(--on-background)]">{stat.value}</p>
            <p className="mt-2 text-xs text-[var(--on-surface-variant)]">{stat.hint}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function ClubLeadActivity({ dashboard }: { dashboard: any }) {
  const maxValue = Math.max(...dashboard.stats.map((stat) => Number(stat.value) || 0), 1);
  const bars = dashboard.stats.map((stat) => ({
    label: stat.label,
    value: Number(stat.value) || 0,
    height: Math.max(26, Math.round(((Number(stat.value) || 0) / maxValue) * 180)),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--outline-variant)] pb-4">
          <h2 className="flex items-center gap-2 font-semibold text-[var(--on-background)]">
            <ChartColumn className="h-5 w-5 text-[var(--primary)]" />
            Activity overview
          </h2>
          <div className="flex gap-2 bg-[var(--surface-container)] p-1">
            <button className="bg-[var(--surface-container-lowest)] px-3 py-1.5 text-xs font-medium text-[var(--primary)]">Live</button>
            <button className="px-3 py-1.5 text-xs font-medium text-[var(--on-surface-variant)]">Trend</button>
            <button className="px-3 py-1.5 text-xs font-medium text-[var(--on-surface-variant)]">Export</button>
          </div>
        </div>
        <div className="mt-6 grid min-h-[300px] grid-cols-4 items-end gap-4 px-2">
          {bars.map((bar, index) => (
            <div key={bar.label} className="flex flex-col items-center gap-3">
              <div className="flex h-[220px] w-full items-end">
                <div
                  className={`w-full ${
                    index === 0
                      ? "bg-[var(--primary-fixed-dim)]"
                      : index === 1
                        ? "bg-[var(--secondary-container)]"
                        : index === 2
                          ? "bg-[var(--primary-container)]"
                          : "bg-[var(--primary)]"
                  }`}
                  style={{ height: `${bar.height}px` }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--on-background)]">{bar.value}</p>
                <p className="mt-1 text-[11px] text-[var(--on-surface-variant)]">{bar.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6">
          <SectionTitle title="Recent registrations" description="Latest signups across your managed events." />
          <div className="mt-5 space-y-3">
            {dashboard.recentRegistrations.map((registration) => (
              <div key={registration.id} className="border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-[var(--on-background)]">{registration.userId}</p>
                  <Badge tone="primary">{registration.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                  Registered {registration.registeredAt ? formatDateTime(registration.registeredAt) : "recently"}
                </p>
              </div>
            ))}
            {dashboard.recentRegistrations.length === 0 ? (
              <p className="text-sm text-[var(--on-surface-variant)]">No registrations yet across managed events.</p>
            ) : null}
          </div>
        </div>

        <div className="border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6">
          <SectionTitle title="Action lane" description="Next operational moves for your club." />
          <div className="mt-5 grid gap-3">
            {[
              {
                href: "/events/create",
                title: "Create new event",
                copy: "Launch the next workshop, summit, or club activity.",
                icon: <CalendarCheck2 className="h-5 w-5" />,
              },
              {
                href: "/collaboration",
                title: "Open discussions",
                copy: "Coordinate cross-club work and shared initiatives.",
                icon: <Handshake className="h-5 w-5" />,
              },
              {
                href: "/event-analysis",
                title: "Review performance",
                copy: "Inspect trends and improve programming decisions.",
                icon: <FileBarChart2 className="h-5 w-5" />,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="grid gap-2 border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 transition hover:border-[var(--primary)]"
              >
                <div className="flex items-center gap-3 text-[var(--primary)]">
                  {item.icon}
                  <span className="font-medium text-[var(--on-background)]">{item.title}</span>
                </div>
                <p className="text-sm text-[var(--on-surface-variant)]">{item.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ClubLeadUpcoming({ events, announcements }: { events: any[]; announcements: any[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6">
        <SectionTitle
          title="Managed events"
          description="The operational queue for your current programming."
          actions={
            <Link href="/events/manage" className="text-sm font-medium text-[var(--primary)]">
              Open manage view
            </Link>
          }
        />
        <div className="mt-5 space-y-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="grid gap-4 border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4 transition hover:border-[var(--primary)] sm:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={event.status === "approved" ? "success" : event.status === "pending" ? "warning" : "neutral"}>
                    {event.status}
                  </Badge>
                  {event.category ? <Badge>{event.category}</Badge> : null}
                </div>
                <h3 className="mt-3 font-heading text-xl font-semibold text-[var(--on-background)]">{event.title}</h3>
                <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{event.venue || "Venue pending"}</p>
              </div>
              <div className="text-sm text-[var(--on-surface-variant)]">
                {event.startAt ? formatDateTime(event.startAt) : "Scheduling in progress"}
              </div>
            </Link>
          ))}
          {events.length === 0 ? (
            <p className="text-sm text-[var(--on-surface-variant)]">No managed events yet. Create one to start your queue.</p>
          ) : null}
        </div>
      </section>

      <section className="border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-6">
        <SectionTitle title="Announcements" description="Recent campus and operations notices." />
        <div className="mt-5 space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-4">
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <Megaphone className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">{announcement.priority}</span>
              </div>
              <h3 className="mt-3 font-heading text-lg font-semibold text-[var(--on-background)]">{announcement.title}</h3>
              <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{announcement.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ClubLeadDashboard({ session, dashboard }: { session: any; dashboard: any }) {
  return (
    <div className="space-y-8">
      <ClubLeadHeader session={session} />
      <ClubLeadStats stats={dashboard.stats} />
      <ClubLeadActivity dashboard={dashboard} />
      <ClubLeadUpcoming events={dashboard.spotlightEvents} announcements={dashboard.announcements} />
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session.user.role === "admin") redirect("/admin");

  const dashboard = await getRoleDashboardData(session);

  if (dashboard.kind === "clublead") {
    return <ClubLeadDashboard session={session} dashboard={dashboard} />;
  }

  return <StudentDashboard session={session} dashboard={dashboard} />;
}

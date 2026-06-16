// @ts-nocheck
export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  ChartColumn,
  Download,
  Megaphone,
  Plus,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";
import { getServerSession } from "@/lib/auth/session";
import { getAdminOverviewData } from "@/lib/server/app-data";
import { Badge, SectionTitle } from "@/components/app/ui";

function MetricCard({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="border border-[#d1d9e0] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm text-[#41474e]">{label}</span>
        <div className={`flex h-10 w-10 items-center justify-center ${tone}`}>{icon}</div>
      </div>
      <div className="mt-6">
        <p className="font-heading text-3xl font-semibold text-[#001d32]">{value}</p>
        <p className="mt-2 text-xs text-[#41474e]">{hint}</p>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  const data = await getAdminOverviewData();
  const pendingEvents = data.events.filter((event) => event.status === "pending");
  const approvedEvents = data.events.filter((event) => event.status === "approved");
  const students = data.users.filter((user) => user.role === "student").length;
  const leads = data.users.filter((user) => user.role === "clublead").length;
  const admins = data.users.filter((user) => user.role === "admin").length;

  const trendBars = [
    { label: "Students", value: students, color: "bg-[#9accfa]" },
    { label: "Leads", value: leads, color: "bg-[#aadaff]" },
    { label: "Admins", value: admins, color: "bg-[#4679a3]" },
    { label: "Pending", value: pendingEvents.length, color: "bg-[#2a6089]" },
  ];
  const maxTrend = Math.max(...trendBars.map((bar) => bar.value), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="ui-eyebrow">Admin dashboard</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-[#001d32] sm:text-4xl">
            System oversight
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#41474e] sm:text-base">
            Real-time performance metrics and institutional health, aligned to the admin dashboard reference in the `screens` folder.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 border border-[#d1d9e0] bg-white px-4 py-2 text-sm font-medium text-[#475569]">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-2 bg-[#2a6089] px-4 py-2 text-sm font-medium text-white">
            <Plus className="h-4 w-4" />
            New alert
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Campus users"
          value={data.users.length}
          hint={`${students} students, ${leads} club leads, ${admins} admins`}
          icon={<Users2 className="h-5 w-5" />}
          tone="bg-[#cde5ff] text-[#001d32]"
        />
        <MetricCard
          label="Active clubs"
          value={data.clubs.length}
          hint="Campus communities currently listed in the system"
          icon={<TrendingUp className="h-5 w-5" />}
          tone="bg-[#aadaff] text-[#2e6080]"
        />
        <MetricCard
          label="Approved events"
          value={approvedEvents.length}
          hint="Programs already visible to the campus feed"
          icon={<Sparkles className="h-5 w-5" />}
          tone="bg-[#d1e4fb] text-[#091d2e]"
        />
        <MetricCard
          label="Pending approvals"
          value={pendingEvents.length}
          hint="Submissions requiring immediate review"
          icon={<ShieldAlert className="h-5 w-5" />}
          tone="bg-[#ffdad6] text-[#ba1a1a]"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="border border-[#d1d9e0] bg-white p-6">
          <div className="flex items-center justify-between gap-4 border-b border-[#d1d9e0] pb-4">
            <h2 className="flex items-center gap-2 font-semibold text-[#001d32]">
              <ChartColumn className="h-5 w-5 text-[#2a6089]" />
              Engagement trends
            </h2>
            <div className="flex gap-2 bg-[#ebeef1] p-1">
              <button className="bg-white px-3 py-1.5 text-xs font-medium text-[#2a6089]">Daily</button>
              <button className="px-3 py-1.5 text-xs font-medium text-[#72787f]">Weekly</button>
              <button className="px-3 py-1.5 text-xs font-medium text-[#72787f]">Monthly</button>
            </div>
          </div>

          <div className="mt-6 grid min-h-[300px] grid-cols-4 items-end gap-4 px-2">
            {trendBars.map((bar) => (
              <div key={bar.label} className="flex flex-col items-center gap-3">
                <div className="flex h-[220px] w-full items-end">
                  <div
                    className={`w-full ${bar.color}`}
                    style={{ height: `${Math.max(32, Math.round((bar.value / maxTrend) * 200))}px` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#001d32]">{bar.value}</p>
                  <p className="mt-1 text-[11px] text-[#41474e]">{bar.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-[#d1d9e0] bg-white p-6">
            <SectionTitle title="Moderation queue" description="Items that need administrative attention now." />
            <div className="mt-5 space-y-3">
              {pendingEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="border border-[#d1d9e0] bg-[#f1f4f7] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[#001d32]">{event.title}</p>
                    <Badge tone="warning">pending</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[#41474e]">{event.venue || "Venue pending"}</p>
                </div>
              ))}
              {pendingEvents.length === 0 ? (
                <p className="text-sm text-[#41474e]">No pending approvals right now.</p>
              ) : null}
            </div>
          </div>

          <div className="border border-[#d1d9e0] bg-white p-6">
            <SectionTitle title="Admin actions" description="Jump straight into the system workflows from the screen reference." />
            <div className="mt-5 grid gap-3">
              {[
                {
                  href: "/admin/users",
                  title: "Review users",
                  copy: "Audit accounts, roles, and access across the platform.",
                  icon: <Users2 className="h-5 w-5" />,
                },
                {
                  href: "/admin/analytics",
                  title: "View analytics",
                  copy: "Inspect participation, growth, and system-wide health.",
                  icon: <ChartColumn className="h-5 w-5" />,
                },
                {
                  href: "/admin/announcements",
                  title: "Manage announcements",
                  copy: "Publish or moderate campus-wide communication.",
                  icon: <Megaphone className="h-5 w-5" />,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="grid gap-2 border border-[#d1d9e0] bg-[#f1f4f7] p-4 transition hover:border-[#2a6089]"
                >
                  <div className="flex items-center gap-3 text-[#2a6089]">
                    {item.icon}
                    <span className="font-medium text-[#001d32]">{item.title}</span>
                  </div>
                  <p className="text-sm text-[#41474e]">{item.copy}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="border border-[#d1d9e0] bg-white p-6">
          <SectionTitle
            title="Pending approvals"
            description="Newest event submissions waiting for review."
            actions={
              <Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium text-[#2a6089]">
                Open events
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-5 space-y-4">
            {pendingEvents.map((event) => (
              <div key={event.id} className="border border-[#d1d9e0] bg-[#f1f4f7] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="warning">pending</Badge>
                      {event.category ? <Badge>{event.category}</Badge> : null}
                    </div>
                    <h3 className="mt-3 font-heading text-xl font-semibold text-[#001d32]">{event.title}</h3>
                    <p className="mt-2 text-sm text-[#41474e]">{event.venue || "Venue pending"}</p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-[#ba1a1a]" />
                </div>
              </div>
            ))}
            {pendingEvents.length === 0 ? (
              <p className="text-sm text-[#41474e]">No pending approvals right now.</p>
            ) : null}
          </div>
        </div>

        <div className="border border-[#d1d9e0] bg-white p-6">
          <SectionTitle title="Recent announcements" description="Latest published updates across the institution." />
          <div className="mt-5 space-y-4">
            {data.announcements.slice(0, 5).map((announcement) => (
              <div key={announcement.id} className="border border-[#d1d9e0] bg-[#f1f4f7] p-4">
                <div className="flex items-center gap-2 text-[#2a6089]">
                  <Megaphone className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">{announcement.priority}</span>
                </div>
                <h3 className="mt-3 font-heading text-lg font-semibold text-[#001d32]">{announcement.title}</h3>
                <p className="mt-2 text-sm text-[#41474e]">{announcement.body}</p>
              </div>
            ))}
            {data.announcements.length === 0 ? (
              <p className="text-sm text-[#41474e]">No announcements have been published yet.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

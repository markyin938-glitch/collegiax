import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>
        Welcome back, {session.user.name}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Upcoming Events", value: "12", icon: "🗓️" },
          { label: "Registered", value: "5", icon: "✅" },
          { label: "Clubs Joined", value: "3", icon: "👥" },
          { label: "Score", value: "1,240", icon: "🏆" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card relative overflow-hidden p-5"
            style={{ animation: "slideUp .4s ease both" }}
          >
            <div
              className="absolute top-0 right-0 h-[70px] w-[70px] rounded-full"
              style={{ background: "radial-gradient(circle,rgba(99,102,241,.1) 0%,transparent 70%)" }}
            />
            <div className="relative z-10">
              <div className="mb-1.5 text-xs text-[var(--text2)]">{stat.label}</div>
              <div className="text-[26px] font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                {stat.value}
              </div>
            </div>
            <div className="absolute top-4 right-4 text-[26px] opacity-40">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Recent Activity</h3>
          <div className="space-y-3">
            {[
              "You registered for Hackathon 2026",
              "CodeClub posted a new update",
              "Your event proposal was approved",
              "You earned the Early Bird badge",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/50 px-3 py-2.5 text-sm"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-5">
          <h3 className="mb-3 text-sm font-semibold">Announcements</h3>
          <div className="space-y-3">
            {[
              { title: "Semester Kickoff", time: "2h ago" },
              { title: "Club Fair This Friday", time: "5h ago" },
              { title: "New AI Assistant Live", time: "1d ago" },
            ].map((a, i) => (
              <div key={i} className="border-b border-[var(--border)] pb-2 last:border-0">
                <div className="text-[13px] font-medium">{a.title}</div>
                <div className="text-[11px] text-[var(--text3)]">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

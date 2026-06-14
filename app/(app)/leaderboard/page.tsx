// @ts-nocheck
export const dynamic = "force-dynamic";

import { getLeaderboardData } from "@/lib/server/app-data";
import { Badge, PageIntro, SurfaceCard } from "@/components/app/ui";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboardData();

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Leaderboard" title="Participation rankings" description="A redesigned leaderboard surface using live user scores and achievement counts from the existing schema." />
      <SurfaceCard className="overflow-hidden">
        <div className="grid grid-cols-[70px_1fr_120px_120px] gap-4 border-b border-[var(--outline-variant)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          <span>Rank</span>
          <span>User</span>
          <span>Score</span>
          <span>Badges</span>
        </div>
        <div className="divide-y divide-[var(--outline-variant)]">
          {leaderboard.map((entry, index) => (
            <div key={entry.user.id} className="grid grid-cols-[70px_1fr_120px_120px] gap-4 px-6 py-4 text-sm">
              <div className="font-heading text-xl font-semibold text-[var(--on-background)]">#{index + 1}</div>
              <div className="min-w-0">
                <p className="truncate font-medium text-[var(--on-background)]">{entry.user.name}</p>
                <p className="truncate text-[var(--on-surface-variant)]">{entry.user.role}</p>
              </div>
              <div className="text-[var(--on-background)]">{entry.score?.totalScore ?? entry.user.score}</div>
              <div><Badge>{entry.achievements} badges</Badge></div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}

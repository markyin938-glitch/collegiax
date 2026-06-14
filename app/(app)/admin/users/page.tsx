// @ts-nocheck
export const dynamic = "force-dynamic";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { Badge, PageIntro, SurfaceCard } from "@/components/app/ui";

export default async function AdminUsersPage() {
  const userRows = await db.select().from(users);

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Admin users" title="Campus user directory" description="User management now sits inside the new design system while continuing to read from the current auth and user tables." />
      <SurfaceCard className="overflow-hidden">
        <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr] gap-4 border-b border-[var(--outline-variant)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Email verified</span>
        </div>
        <div className="divide-y divide-[var(--outline-variant)]">
          {userRows.map((user) => (
            <div key={user.id} className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr] gap-4 px-6 py-4 text-sm">
              <div>
                <p className="font-medium text-[var(--on-background)]">{user.name}</p>
                <p className="text-[var(--on-surface-variant)]">{user.email}</p>
              </div>
              <div className="text-[var(--on-background)]">{user.role}</div>
              <div><Badge tone={user.status === "active" ? "success" : "neutral"}>{user.status}</Badge></div>
              <div>{user.emailVerified ? <Badge tone="primary">Verified</Badge> : <Badge tone="warning">Pending</Badge>}</div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}

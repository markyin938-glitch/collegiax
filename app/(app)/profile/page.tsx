// @ts-nocheck
export const dynamic = "force-dynamic";

import { getServerSession } from "@/lib/auth/session";
import { getProfileData } from "@/lib/server/app-data";
import { PageIntro, StatCard, SurfaceCard } from "@/components/app/ui";
import { ProfileForm } from "@/components/app/profile-form";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) return null;
  const profile = await getProfileData(session.user.id);
  if (!profile) return null;

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="User profile" title="Your campus identity" description="Profile details are editable here through the new UI and saved back into the existing user record." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Role" value={profile.user.role} />
        <StatCard label="Score" value={profile.score?.totalScore ?? profile.user.score} />
        <StatCard label="Clubs joined" value={profile.memberships.length} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ProfileForm
          initialProfile={{
            name: profile.user.name,
            email: profile.user.email,
            college: profile.user.college,
            department: profile.user.department,
            year: profile.user.year,
            rollNumber: profile.user.rollNumber,
            bio: profile.user.bio,
          }}
        />
        <SurfaceCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-semibold text-white">
              {profile.user.avatarInitials || profile.user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">{profile.user.name}</h2>
              <p className="text-sm text-[var(--on-surface-variant)]">{profile.user.email}</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-sm text-[var(--on-surface-variant)]">
            <p>{profile.user.bio || "Add a short bio to help collaborators and event organizers know more about you."}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="ui-panel p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Department</p><p className="mt-2 text-[var(--on-background)]">{profile.user.department || "Not set"}</p></div>
              <div className="ui-panel p-4"><p className="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Year</p><p className="mt-2 text-[var(--on-background)]">{profile.user.year || "Not set"}</p></div>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

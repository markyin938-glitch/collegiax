// @ts-nocheck
export const dynamic = "force-dynamic";

import { getServerSession } from "@/lib/auth/session";
import { getMessageOverview } from "@/lib/server/app-data";
import { EmptyState, PageIntro, SurfaceCard } from "@/components/app/ui";

export default async function MessagesPage() {
  const session = await getServerSession();
  if (!session) return null;
  const threads = await getMessageOverview(session.user.id);

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Messages" title="Conversation hub" description="The messaging route now shares the new UI shell while reading thread/message data if it exists." />
      {threads.length === 0 ? (
        <EmptyState title="No conversations yet" description="Chat threads will appear here once direct messages or collaboration discussions are created." />
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <SurfaceCard key={thread.id} className="p-6">
              <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">{thread.title || "Untitled thread"}</h2>
              <p className="mt-3 text-sm text-[var(--on-surface-variant)]">{thread.messages[0]?.body || "No messages yet."}</p>
            </SurfaceCard>
          ))}
        </div>
      )}
    </div>
  );
}

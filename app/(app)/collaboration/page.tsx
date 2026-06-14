import { EmptyState, PageIntro } from "@/components/app/ui";

export default function CollaborationPage() {
  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Collaboration" title="Cross-club coordination" description="This route now inherits the new campus UI while remaining ready for future collaboration workflows backed by the existing schema." />
      <EmptyState title="Collaboration workspace is ready" description="The visual layer is updated. As collaboration records are added, this screen can surface them without another UI overhaul." />
    </div>
  );
}

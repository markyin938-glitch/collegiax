import { EmptyState, PageIntro } from "@/components/app/ui";

export default function EventAnalysisPage() {
  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Event analysis" title="Insights workspace" description="The route is visually updated and positioned for richer event analytics without disrupting existing routing or shell behavior." />
      <EmptyState title="Analysis modules can plug in here" description="When deeper analytics are implemented, they can be layered into this new UI frame without changing the page structure again." />
    </div>
  );
}

// @ts-nocheck
import { AssistantConsole } from "@/components/app/assistant-console";
import { PageIntro } from "@/components/app/ui";

export default function AssistantPage() {
  return (
    <div className="space-y-8">
      <PageIntro eyebrow="AI campus assistant" title="Ask CollegiaX anything" description="The assistant UI is now aligned with the uploaded design direction and connected to a minimal backend contract for prompt-response interactions." />
      <AssistantConsole />
    </div>
  );
}

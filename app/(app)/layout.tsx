export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen" data-role={session.user.role}>
      <Sidebar user={session.user} />
      <div className="main-content flex flex-1 flex-col" style={{ marginLeft: 240 }}>
        <Topbar user={session.user} />
        <main className="page-bg-gradient relative flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

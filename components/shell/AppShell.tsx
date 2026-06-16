"use client";

import { Sidebar } from "@/components/shell/Sidebar";
import { MobileDock } from "@/components/shell/MobileDock";
import { Topbar } from "@/components/shell/Topbar";
import { useUIStore } from "@/stores/ui-store";

type ShellUser = {
  id: string;
  name: string;
  role: string;
  avatarInitials: string | null;
};

export function AppShell({ children, user }: { children: React.ReactNode; user: ShellUser }) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen" data-role={user.role}>
      <Sidebar user={user} />
      <div className={`flex min-h-screen flex-col transition-[margin] duration-300 ease-out ${sidebarCollapsed ? "md:ml-[104px]" : "md:ml-[292px]"}`}>
        <Topbar user={user} />
        <main className="flex-1 px-4 py-4 pb-24 sm:px-5 sm:py-5 sm:pb-24 lg:px-8 lg:py-7 lg:pb-7">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
      <MobileDock user={user} />
    </div>
  );
}

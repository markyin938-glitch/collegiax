"use client";

import type { CSSProperties } from "react";
import { Sidebar } from "@/components/shell/Sidebar";
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
  const shellStyle = {
    "--sidebar-offset": `${sidebarCollapsed ? 72 : 240}px`,
  } as CSSProperties;

  return (
    <div className="min-h-screen" data-role={user.role}>
      <Sidebar user={user} />
      <div
        className="flex min-h-screen flex-col transition-[margin] duration-300 ease-out md:ml-[var(--sidebar-offset)]"
        style={shellStyle}
      >
        <Topbar user={user} />
        <main className="page-bg-gradient relative flex-1 p-4 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

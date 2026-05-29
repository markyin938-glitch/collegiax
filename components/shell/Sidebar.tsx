"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { ROLE_NAVS } from "@/lib/auth/permissions";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Bookmark,
  Trophy,
  BarChart3,
  MessageSquare,
  Bot,
  User,
  PlusCircle,
  ListChecks,
  Handshake,
  LineChart,
  Shield,
  UserCog,
  Megaphone,
  X,
  Sparkles,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={16} />,
  CalendarDays: <CalendarDays size={16} />,
  Users: <Users size={16} />,
  Bookmark: <Bookmark size={16} />,
  Trophy: <Trophy size={16} />,
  BarChart3: <BarChart3 size={16} />,
  MessageSquare: <MessageSquare size={16} />,
  Bot: <Bot size={16} />,
  User: <User size={16} />,
  PlusCircle: <PlusCircle size={16} />,
  ListChecks: <ListChecks size={16} />,
  Handshake: <Handshake size={16} />,
  LineChart: <LineChart size={16} />,
  Shield: <Shield size={16} />,
  UserCog: <UserCog size={16} />,
  Megaphone: <Megaphone size={16} />,
};

export function Sidebar({ user }: { user: { id: string; name: string; role: string; avatarInitials: string | null } }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const navs = ROLE_NAVS[user.role] || ROLE_NAVS.student;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[99] bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className="sidebar fixed top-0 left-0 bottom-0 z-[100] flex w-[240px] flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--bg2)] transition-transform duration-300"
        style={{ transform: sidebarOpen ? "translateX(0)" : undefined }}
      >
        {/* Left accent line */}
        <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: "linear-gradient(180deg,var(--accent),var(--accent2),var(--accent3))", opacity: 0.6 }} />

        {/* Header */}
        <div className="relative border-b border-[var(--border)] px-[18px] pt-5 pb-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] text-sm text-white" style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))" }}>
              <Sparkles size={16} />
            </div>
            <span className="text-[17px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
              Collegia<span className="text-[var(--accent)]">X</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-[10px] bg-[var(--surface)] p-2">
            <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))" }}>
              {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold">{user.name}</div>
              <div className="text-[10px] text-[var(--accent)] opacity-80" style={{ fontFamily: "var(--font-jetbrains)" }}>
                {user.role}
              </div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-3 text-[var(--text2)] md:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3.5">
          {navs.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item relative mb-0.5 flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium transition ${
                  active
                    ? "text-[var(--text)]"
                    : "text-[var(--text2)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                }`}
                style={active ? { background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1))" } : undefined}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-r-sm bg-[var(--accent)]" />
                )}
                <span className="flex-shrink-0">{iconMap[item.icon]}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-2.5 py-3.5">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

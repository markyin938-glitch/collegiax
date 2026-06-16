"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { ROLE_NAVS } from "@/lib/auth/permissions";
import {
  BarChart3,
  Bookmark,
  Bot,
  CalendarDays,
  ChevronRight,
  Handshake,
  LineChart,
  ListChecks,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Shield,
  Sparkles,
  Trophy,
  User,
  UserCog,
  Users,
  X,
  MessageSquare,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const iconMap: Record<string, React.ReactNode> = {
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

const roleDisplayLabels: Record<string, Record<string, string>> = {
  clublead: {
    "/events": "Events",
    "/events/create": "New Event",
    "/events/manage": "Members",
    "/clubs": "Club",
    "/collaboration": "Discussions",
    "/event-analysis": "Resources",
    "/messages": "Messages",
    "/assistant": "Assistant",
    "/profile": "Club Settings",
  },
  admin: {
    "/events": "Events",
    "/clubs": "Clubs",
    "/admin": "Home",
    "/admin/users": "Users",
    "/admin/analytics": "Analytics",
    "/admin/announcements": "Moderation",
    "/messages": "Messages",
    "/assistant": "AI Insights",
    "/profile": "Profile",
  },
};

export function Sidebar({ user }: { user: { id: string; name: string; role: string; avatarInitials: string | null } }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const navs = ROLE_NAVS[user.role as keyof typeof ROLE_NAVS] || ROLE_NAVS.student;
  const isAdmin = user.role === "admin";
  const isClubLead = user.role === "clublead";
  const roleLabels = roleDisplayLabels[user.role] || {};

  return (
    <>
      {sidebarOpen ? (
        <div className="fixed inset-0 z-[99] bg-[rgba(24,28,30,0.42)] backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      ) : null}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-[100] flex w-[292px] max-w-[86vw] flex-col overflow-y-auto border-r transition-[transform,width] duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarCollapsed ? "md:w-[96px]" : "md:w-[292px]"} ${
          isAdmin
            ? "border-[#d1d9e0] bg-[#eef3f8]"
            : isClubLead
              ? "border-[#d1d9e0] bg-[#eef3f8]"
              : "border-[var(--outline-variant)] bg-[rgba(255,255,255,0.88)] shadow-[0_16px_44px_rgba(45,98,139,0.08)] backdrop-blur"
        } md:translate-x-0`}
      >
        <div className={`relative px-5 pb-5 pt-6 ${sidebarCollapsed ? "md:px-4" : ""} ${isAdmin || isClubLead ? "border-b border-[#d1d9e0]" : "border-b border-[var(--outline-variant)]"}`}>
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={`mb-5 flex items-center gap-3 transition hover:opacity-85 ${sidebarCollapsed ? "md:justify-center" : ""}`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${isAdmin ? "bg-[#4679a3]" : "bg-[var(--primary)]"} shadow-[0_12px_30px_rgba(42,96,137,0.22)]`}>
              {isAdmin ? <Shield size={18} /> : <Sparkles size={18} />}
            </div>
            <span className={`font-heading text-2xl font-bold text-[var(--on-background)] ${sidebarCollapsed ? "md:hidden" : ""}`}>
              Collegia<span className={isAdmin ? "text-[#2a6089]" : "text-[var(--primary)]"}>X</span>
            </span>
          </Link>

          <div className={`flex items-center gap-3 p-3 ${sidebarCollapsed ? "md:justify-center md:border-none md:bg-transparent md:p-0" : ""} ${isAdmin || isClubLead ? "rounded-xl" : "ui-panel"} ${isAdmin ? "bg-transparent" : isClubLead ? "bg-white/70 border border-[#d1d9e0]" : ""}`}>
            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${isAdmin ? "bg-[#4679a3]" : "bg-[var(--primary)]"}`}>
              {isAdmin ? <Shield size={16} /> : user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className={`min-w-0 ${sidebarCollapsed ? "md:hidden" : ""}`}>
              <div className="truncate text-sm font-semibold text-[var(--on-surface)]">{user.name}</div>
              <div className={`text-xs uppercase tracking-[0.18em] ${isAdmin ? "text-[#72787f]" : "text-[var(--primary)]"}`}>{user.role}</div>
            </div>
          </div>

          <button
            onClick={toggleSidebarCollapsed}
            className={`hidden h-10 w-10 items-center justify-center rounded-full border text-[var(--on-surface-variant)] transition md:flex ${
              sidebarCollapsed ? "md:mx-auto md:mt-3" : "md:absolute md:right-4 md:top-6"
            } ${isAdmin || isClubLead ? "border-[#d1d9e0] bg-white hover:border-[#2a6089] hover:text-[#2a6089]" : "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}
            title={sidebarCollapsed ? "Expand dashboard menu" : "Collapse dashboard menu"}
            aria-label={sidebarCollapsed ? "Expand dashboard menu" : "Collapse dashboard menu"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className={`absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-full border text-[var(--on-surface-variant)] transition md:hidden ${isAdmin || isClubLead ? "border-[#d1d9e0] bg-white hover:border-[#2a6089] hover:text-[#2a6089]" : "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}
            title="Close menu"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5">
          {isClubLead && !sidebarCollapsed ? (
            <div className="px-4 pb-3 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#72787f]">Administration</div>
          ) : null}
          {isAdmin && !sidebarCollapsed ? (
            <div className="px-4 pb-3 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#72787f]">System</div>
          ) : null}
          {navs.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const displayLabel = roleLabels[item.href] || item.label;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={displayLabel}
                className={`group relative mb-1.5 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? isAdmin || isClubLead
                      ? "text-[#001d32]"
                      : "bg-[color:rgba(42,96,137,0.12)] text-[var(--primary)]"
                    : isAdmin || isClubLead
                      ? "text-[#41474e] hover:bg-[#e5e8eb] hover:text-[#181c1e]"
                      : "text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]"
                } ${sidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
              >
                {active && (isAdmin || isClubLead) ? (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-[#326383]" />
                ) : null}
                <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${active ? isAdmin || isClubLead ? "bg-white text-[#2a6089]" : "bg-white text-[var(--primary)]" : isAdmin || isClubLead ? "bg-transparent text-[#475569]" : "bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)]"}`}>
                  {iconMap[item.icon]}
                </span>
                <span className={sidebarCollapsed ? "md:hidden" : ""}>{displayLabel}</span>
                {!sidebarCollapsed ? <ChevronRight className={`ml-auto h-4 w-4 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} /> : null}
              </Link>
            );
          })}
        </nav>

        <div className={`px-3 py-5 ${isAdmin || isClubLead ? "border-t border-[#d1d9e0]" : "border-t border-[var(--outline-variant)]"}`}>
          <LogoutButton compact={sidebarCollapsed} />
        </div>
      </aside>
    </>
  );
}

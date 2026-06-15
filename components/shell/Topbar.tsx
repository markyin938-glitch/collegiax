"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Plus, Search, Shield, Sparkles, Zap } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

export function Topbar({ user }: { user: { name: string; role: string } }) {
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const isAdmin = user.role === "admin";
  const isClubLead = user.role === "clublead";

  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean)[0] || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur ${isAdmin ? "border-[#12304a] bg-[#001d32]" : "border-[var(--outline-variant)] bg-[rgba(247,250,253,0.84)]"}`}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition md:hidden ${isAdmin ? "border-[#36556d] bg-[#0a2d46] text-white hover:border-[#9accfa]" : "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}
            title="Open menu"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-3 transition hover:opacity-85" title="Go to Dashboard">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-[0_12px_30px_rgba(42,96,137,0.18)] ${isAdmin ? "bg-[#4679a3]" : "bg-[var(--primary)]"}`}>
              {isAdmin ? <Shield size={16} /> : <Sparkles size={16} />}
            </div>
            <span className={`hidden font-heading text-xl font-bold sm:block ${isAdmin ? "text-white" : ""}`}>
              Collegia<span className={isAdmin ? "text-[#9accfa]" : "text-[var(--primary)]"}>X</span>
            </span>
          </Link>
          <div className={`hidden h-8 w-px sm:block ${isAdmin ? "bg-[#36556d]" : "bg-[var(--outline-variant)]"}`} />
          <div className="min-w-0">
            <h1 className={`truncate font-heading text-lg font-semibold ${isAdmin ? "text-white" : "text-[var(--on-background)]"}`}>{getPageTitle()}</h1>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <div className={`hidden items-center gap-2 rounded-full border px-4 py-2.5 text-sm md:flex ${isAdmin ? "border-[#36556d] bg-[#0a2d46] text-[#c1c7cf]" : "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface-variant)]"}`}>
            <Search className="h-4 w-4" />
            {isAdmin ? "Search system logs, users, or assets..." : isClubLead ? "Search members, events, or files..." : "Search campus"}
          </div>
          {isClubLead ? (
            <Link href="/events/create" className="hidden items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(42,96,137,0.18)] md:flex">
              <Plus className="h-4 w-4" />
              New Event
            </Link>
          ) : null}
          {isAdmin ? (
            <Link href="/assistant" className="hidden items-center gap-2 rounded-xl bg-[#2a6089] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(42,96,137,0.18)] md:flex">
              <Zap className="h-4 w-4" />
              AI Insights
            </Link>
          ) : null}
          <button
            className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition ${isAdmin ? "border-[#36556d] bg-[#0a2d46] text-white hover:border-[#9accfa]" : "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 bg-[var(--error)] ${isAdmin ? "border-[#0a2d46]" : "border-white"}`} />
          </button>
          <div className={`flex items-center gap-3 rounded-full border px-2 py-1.5 ${isAdmin ? "border-[#36556d] bg-[#0a2d46]" : "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"}`}>
            <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${isAdmin ? "bg-[#4679a3]" : "bg-[var(--primary)]"}`}>
              {isAdmin ? <Shield size={14} /> : user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden pr-2 sm:block">
              <p className={`text-sm font-semibold ${isAdmin ? "text-white" : "text-[var(--on-surface)]"}`}>{user.name}</p>
              <p className={`text-xs ${isAdmin ? "text-[#c1c7cf]" : "text-[var(--on-surface-variant)]"}`}>{isAdmin ? "admin@collegiax.edu" : isClubLead ? "Club workspace" : "Signed in"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

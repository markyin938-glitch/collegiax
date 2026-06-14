"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search, Sparkles } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

export function Topbar({ user }: { user: { name: string; role: string } }) {
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();

  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean)[0] || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[rgba(247,250,253,0.84)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] md:hidden"
            title="Open menu"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-3 transition hover:opacity-85" title="Go to Dashboard">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-[0_12px_30px_rgba(42,96,137,0.18)]">
              <Sparkles size={16} />
            </div>
            <span className="hidden font-heading text-xl font-bold sm:block">
              Collegia<span className="text-[var(--primary)]">X</span>
            </span>
          </Link>
          <div className="hidden h-8 w-px bg-[var(--outline-variant)] sm:block" />
          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-semibold text-[var(--on-background)]">{getPageTitle()}</h1>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface-variant)] md:flex">
            <Search className="h-4 w-4" />
            Search campus
          </div>
          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--error)]" />
          </button>
          <div className="flex items-center gap-3 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-2 py-1.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-white">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden pr-2 sm:block">
              <p className="text-sm font-semibold text-[var(--on-surface)]">{user.name}</p>
              <p className="text-xs text-[var(--on-surface-variant)]">Signed in</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

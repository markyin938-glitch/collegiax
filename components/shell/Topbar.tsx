"use client";

import { useUIStore } from "@/stores/ui-store";
import { useThemeStore } from "@/stores/theme-store";
import { Menu, Moon, Sun, Bell } from "lucide-react";

export function Topbar({ user }: { user: { name: string; role: string } }) {
  const { toggleSidebar } = useUIStore();
  const { theme, toggle } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 flex h-[58px] items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg2)] px-3 transition-colors sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--accent)] md:hidden"
          title="Open menu"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>
        <h1 className="truncate text-[16px] font-bold sm:text-[17px]" style={{ fontFamily: "var(--font-syne)" }}>
          Dashboard
        </h1>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          onClick={toggle}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--accent)]"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button
          className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--accent)]"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-[5px] right-[5px] h-[7px] w-[7px] rounded-full border-2 border-[var(--bg2)] bg-[var(--red)]" />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))" }}>
            {user.name.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

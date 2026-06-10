"use client";

import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { useThemeStore } from "@/stores/theme-store";
import { Menu, Moon, Sun, Bell, Sparkles } from "lucide-react";
import Link from "next/link";

export function Topbar({ user }: { user: { name: string; role: string } }) {
  const { toggleSidebar } = useUIStore();
  const { theme, toggle } = useThemeStore();
  const pathname = usePathname();

  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean)[0] || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="sticky top-0 z-50 flex h-[52px] items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--bg2)] px-3 transition-colors sm:h-[58px] sm:px-5">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-[8px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--accent)] md:hidden"
          title="Open menu"
          aria-label="Open menu"
        >
          <Menu size={15} />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition" title="Go to Dashboard">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] text-[12px] text-white sm:h-[32px] sm:w-[32px] sm:text-sm" style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))" }}>
            <Sparkles size={14} />
          </div>
          <span className="hidden text-[15px] font-extrabold sm:block sm:text-[17px]" style={{ fontFamily: "var(--font-syne)" }}>
            Collegia<span className="text-[var(--accent)]">X</span>
          </span>
        </Link>
        <span className="text-[var(--text3)]">/</span>
        <h1 className="truncate text-[14px] font-bold sm:text-[16px]" style={{ fontFamily: "var(--font-syne)" }}>
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          onClick={toggle}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--accent)] sm:h-[34px] sm:w-[34px]"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button
          className="relative flex h-[32px] w-[32px] items-center justify-center rounded-[8px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text)] transition hover:border-[var(--accent)] sm:h-[34px] sm:w-[34px]"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={14} />
          <span className="absolute top-[4px] right-[4px] h-[6px] w-[6px] rounded-full border-2 border-[var(--bg2)] bg-[var(--red)]" />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-[28px] w-[28px] flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white sm:h-[30px] sm:w-[30px] sm:text-[11px]" style={{ background: "linear-gradient(135deg,var(--accent),var(--accent2))" }}>
            {user.name.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

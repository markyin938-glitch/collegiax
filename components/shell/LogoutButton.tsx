"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className={`flex w-full items-center gap-2 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-4 py-3 text-sm font-medium text-[var(--on-surface-variant)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] ${
        compact ? "justify-center md:px-0" : ""
      }`}
      title="Logout"
      aria-label="Logout"
    >
      <LogOut size={16} />
      <span className={compact ? "md:hidden" : ""}>Logout</span>
    </button>
  );
}

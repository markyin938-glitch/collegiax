"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium text-[var(--text2)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  );
}

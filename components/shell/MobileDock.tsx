"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  CalendarDays,
  Home,
  ListChecks,
  Menu,
  PlusCircle,
  Shield,
  User,
  Users,
} from "lucide-react";
import Dock from "@/components/Dock";
import { useUIStore } from "@/stores/ui-store";

type ShellUser = {
  role: string;
};

const dockIconClass = "h-[18px] w-[18px]";

function DockGlyph({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center rounded-2xl transition ${
        active
          ? "bg-[rgba(91,141,216,0.2)] text-[var(--primary)]"
          : "text-[var(--on-surface-variant)]"
      }`}
    >
      {children}
    </span>
  );
}

export function MobileDock({ user }: { user: ShellUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setSidebarOpen } = useUIStore();

  const items = useMemo(() => {
    const dashboardItem = {
      label: "Dashboard",
      href: user.role === "admin" ? "/admin" : "/dashboard",
      icon: (
        <DockGlyph active={pathname === "/dashboard" || pathname === "/admin"}>
          <Home className={dockIconClass} />
        </DockGlyph>
      ),
    };

    const menuItem = {
      label: "Menu",
      onClick: () => setSidebarOpen(true),
      icon: (
        <DockGlyph active={false}>
          <Menu className={dockIconClass} />
        </DockGlyph>
      ),
    };

    if (user.role === "clublead") {
      return [
        dashboardItem,
        {
          label: "Events",
          href: "/events",
          icon: (
            <DockGlyph active={pathname.startsWith("/events") && !pathname.startsWith("/events/create") && !pathname.startsWith("/events/manage")}>
              <CalendarDays className={dockIconClass} />
            </DockGlyph>
          ),
        },
        {
          label: "Create",
          href: "/events/create",
          icon: (
            <DockGlyph active={pathname.startsWith("/events/create")}>
              <PlusCircle className={dockIconClass} />
            </DockGlyph>
          ),
        },
        {
          label: "Manage",
          href: "/events/manage",
          icon: (
            <DockGlyph active={pathname.startsWith("/events/manage")}>
              <ListChecks className={dockIconClass} />
            </DockGlyph>
          ),
        },
        menuItem,
      ];
    }

    if (user.role === "admin") {
      return [
        dashboardItem,
        {
          label: "Events",
          href: "/events",
          icon: (
            <DockGlyph active={pathname.startsWith("/events")}>
              <CalendarDays className={dockIconClass} />
            </DockGlyph>
          ),
        },
        {
          label: "Admin",
          href: "/admin",
          icon: (
            <DockGlyph active={pathname === "/admin" || pathname.startsWith("/admin/")}>
              <Shield className={dockIconClass} />
            </DockGlyph>
          ),
        },
        {
          label: "Assistant",
          href: "/assistant",
          icon: (
            <DockGlyph active={pathname.startsWith("/assistant")}>
              <Bot className={dockIconClass} />
            </DockGlyph>
          ),
        },
        menuItem,
      ];
    }

    return [
      dashboardItem,
      {
        label: "Events",
        href: "/events",
        icon: (
          <DockGlyph active={pathname.startsWith("/events")}>
            <CalendarDays className={dockIconClass} />
          </DockGlyph>
        ),
      },
      {
        label: "Clubs",
        href: "/clubs",
        icon: (
          <DockGlyph active={pathname.startsWith("/clubs")}>
            <Users className={dockIconClass} />
          </DockGlyph>
        ),
      },
      {
        label: "Profile",
        href: "/profile",
        icon: (
          <DockGlyph active={pathname.startsWith("/profile")}>
            <User className={dockIconClass} />
          </DockGlyph>
        ),
      },
      menuItem,
    ];
  }, [pathname, setSidebarOpen, user.role]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-3 md:hidden">
      <div className="relative mx-auto flex max-w-max justify-center">
        <Dock
          items={items.map((item) => ({
            label: item.label,
            icon: item.icon,
            onClick: () => {
              if ("onClick" in item && item.onClick) {
                item.onClick();
                return;
              }
              if ("href" in item && item.href) {
                router.push(item.href);
              }
            },
          }))}
          magnification={64}
          distance={120}
          panelHeight={64}
          dockHeight={180}
          baseItemSize={46}
        />
      </div>
    </div>
  );
}

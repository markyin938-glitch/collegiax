import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";

export const ROLE_NAVS: Record<string, { label: string; href: string; icon: string }[]> = {
  student: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Events", href: "/events", icon: "CalendarDays" },
    { label: "Clubs", href: "/clubs", icon: "Users" },
    { label: "Saved", href: "/saved", icon: "Bookmark" },
    { label: "Participation", href: "/participation", icon: "Trophy" },
    { label: "Leaderboard", href: "/leaderboard", icon: "BarChart3" },
    { label: "Messages", href: "/messages", icon: "MessageSquare" },
    { label: "Assistant", href: "/assistant", icon: "Bot" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  clublead: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Events", href: "/events", icon: "CalendarDays" },
    { label: "Create Event", href: "/events/create", icon: "PlusCircle" },
    { label: "Manage Events", href: "/events/manage", icon: "ListChecks" },
    { label: "Clubs", href: "/clubs", icon: "Users" },
    { label: "Collaboration", href: "/collaboration", icon: "Handshake" },
    { label: "Event Analysis", href: "/event-analysis", icon: "LineChart" },
    { label: "Messages", href: "/messages", icon: "MessageSquare" },
    { label: "Assistant", href: "/assistant", icon: "Bot" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Events", href: "/events", icon: "CalendarDays" },
    { label: "Clubs", href: "/clubs", icon: "Users" },
    { label: "Admin Panel", href: "/admin", icon: "Shield" },
    { label: "Users", href: "/admin/users", icon: "UserCog" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    { label: "Announcements", href: "/admin/announcements", icon: "Megaphone" },
    { label: "Messages", href: "/messages", icon: "MessageSquare" },
    { label: "Assistant", href: "/assistant", icon: "Bot" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
};

export function requireRole(userRole: string, ...allowed: string[]) {
  if (!allowed.includes(userRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export const CLUB_ROLES = [
  "Club Lead",
  "Co-Lead",
  "Event Coordinator",
  "Treasurer",
  "Marketing Head",
  "Core Member",
  "Volunteer",
] as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  "Club Lead": ["manage_members", "edit_club", "create_event", "manage_events", "send_announcements", "approve_collab"],
  "Co-Lead": ["manage_members", "edit_club", "create_event", "manage_events", "send_announcements"],
  "Event Coordinator": ["create_event", "manage_events"],
  "Treasurer": ["view_finances"],
  "Marketing Head": ["send_announcements", "edit_club"],
  "Core Member": ["create_event"],
  "Volunteer": [],
};

export function hasClubPermission(clubRole: string, permission: string) {
  return ROLE_PERMISSIONS[clubRole]?.includes(permission) ?? false;
}

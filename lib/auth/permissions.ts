import { NextResponse } from "next/server";

export const APP_ROLES = ["student", "clublead", "admin"] as const;

export type AppRole = (typeof APP_ROLES)[number];

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type RoutePattern = `/${string}`;

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function matchesRoutePattern(pattern: RoutePattern, pathname: string) {
  const normalizedPattern = normalizePath(pattern);
  const normalizedPath = normalizePath(pathname);

  if (normalizedPattern.endsWith("/**")) {
    const prefix = normalizedPattern.slice(0, -3);
    return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`);
  }

  const patternSegments = normalizedPattern.split("/").filter(Boolean);
  const pathSegments = normalizedPath.split("/").filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return false;
  }

  return patternSegments.every((segment, index) => {
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return pathSegments[index].length > 0;
    }
    return segment === pathSegments[index];
  });
}

export const ROLE_NAVS: Record<AppRole, NavItem[]> = {
  student: [
    { label: "Events", href: "/events", icon: "CalendarDays" },
    { label: "Clubs", href: "/clubs", icon: "Users" },
    { label: "Calendar", href: "/calendar", icon: "CalendarRange" },
    { label: "Saved", href: "/saved", icon: "Bookmark" },
    { label: "Participation", href: "/participation", icon: "Trophy" },
    { label: "Leaderboard", href: "/leaderboard", icon: "BarChart3" },
    { label: "Messages", href: "/messages", icon: "MessageSquare" },
    { label: "Assistant", href: "/assistant", icon: "Bot" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  clublead: [
    { label: "Events", href: "/events", icon: "CalendarDays" },
    { label: "Create Event", href: "/events/create", icon: "PlusCircle" },
    { label: "Manage Events", href: "/events/manage", icon: "ListChecks" },
    { label: "Clubs", href: "/clubs", icon: "Users" },
    { label: "Calendar", href: "/calendar", icon: "CalendarRange" },
    { label: "Collaboration", href: "/collaboration", icon: "Handshake" },
    { label: "Event Analysis", href: "/event-analysis", icon: "LineChart" },
    { label: "Messages", href: "/messages", icon: "MessageSquare" },
    { label: "Assistant", href: "/assistant", icon: "Bot" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
  admin: [
    { label: "Events", href: "/events", icon: "CalendarDays" },
    { label: "Clubs", href: "/clubs", icon: "Users" },
    { label: "Calendar", href: "/calendar", icon: "CalendarRange" },
    { label: "Admin Panel", href: "/admin", icon: "Shield" },
    { label: "Users", href: "/admin/users", icon: "UserCog" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    { label: "Announcements", href: "/admin/announcements", icon: "Megaphone" },
    { label: "Messages", href: "/messages", icon: "MessageSquare" },
    { label: "Assistant", href: "/assistant", icon: "Bot" },
    { label: "Profile", href: "/profile", icon: "User" },
  ],
};

export const ROLE_ROUTE_ACCESS: Record<AppRole, RoutePattern[]> = {
  student: [
    "/dashboard",
    "/events",
    "/events/[id]",
    "/clubs",
    "/clubs/[id]",
    "/calendar",
    "/saved",
    "/participation",
    "/leaderboard",
    "/messages",
    "/assistant",
    "/profile",
  ],
  clublead: [
    "/dashboard",
    "/events",
    "/events/[id]",
    "/events/create",
    "/events/manage",
    "/clubs",
    "/clubs/[id]",
    "/clubs/[id]/members",
    "/calendar",
    "/collaboration",
    "/event-analysis",
    "/messages",
    "/assistant",
    "/profile",
  ],
  admin: [
    "/admin",
    "/admin/**",
    "/events",
    "/events/[id]",
    "/clubs",
    "/clubs/[id]",
    "/clubs/[id]/members",
    "/calendar",
    "/messages",
    "/assistant",
    "/profile",
  ],
};

export function isAppRole(role: string): role is AppRole {
  return APP_ROLES.includes(role as AppRole);
}

export function getRoleHome(role: string) {
  return role === "admin" ? "/admin" : "/dashboard";
}

export function canAccessPath(role: string, pathname: string) {
  if (!isAppRole(role)) {
    return false;
  }

  return ROLE_ROUTE_ACCESS[role].some((pattern) => matchesRoutePattern(pattern, pathname));
}

export function getRoleRedirectPath(role: string, pathname: string) {
  return canAccessPath(role, pathname) ? null : getRoleHome(role);
}

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

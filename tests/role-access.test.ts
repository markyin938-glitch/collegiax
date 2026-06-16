import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { canAccessPath, getRoleHome, getRoleRedirectPath } from "../lib/auth/permissions";
import { signAccessToken } from "../lib/auth/jwt";

async function createAuthedRequest(pathname: string, role: "student" | "clublead" | "admin") {
  const token = await signAccessToken({
    userId: `${role}-1`,
    role,
    email: `${role}@collegiax.app`,
  });

  return new NextRequest(`http://localhost${pathname}`, {
    headers: {
      cookie: `access_token=${token}`,
    },
  });
}

test("canAccessPath allows event detail pages for all roles", () => {
  assert.equal(canAccessPath("student", "/events/evt_123"), true);
  assert.equal(canAccessPath("clublead", "/events/evt_123"), true);
  assert.equal(canAccessPath("admin", "/events/evt_123"), true);
});

test("canAccessPath denies student-only and clublead-only pages to other roles", () => {
  assert.equal(canAccessPath("clublead", "/saved"), false);
  assert.equal(canAccessPath("admin", "/saved"), false);
  assert.equal(canAccessPath("student", "/collaboration"), false);
  assert.equal(canAccessPath("admin", "/collaboration"), false);
});

test("canAccessPath protects club member management by role", () => {
  assert.equal(canAccessPath("student", "/clubs/club_123/members"), false);
  assert.equal(canAccessPath("clublead", "/clubs/club_123/members"), true);
  assert.equal(canAccessPath("admin", "/clubs/club_123/members"), true);
});

test("getRoleRedirectPath sends disallowed users to the correct home", () => {
  assert.equal(getRoleHome("student"), "/dashboard");
  assert.equal(getRoleHome("clublead"), "/dashboard");
  assert.equal(getRoleHome("admin"), "/admin");
  assert.equal(getRoleRedirectPath("student", "/event-analysis"), "/dashboard");
  assert.equal(getRoleRedirectPath("clublead", "/saved"), "/dashboard");
  assert.equal(getRoleRedirectPath("admin", "/dashboard"), "/admin");
  assert.equal(getRoleRedirectPath("admin", "/calendar"), null);
});

test("middleware redirects unauthenticated users to login", async () => {
  const response = await middleware(new NextRequest("http://localhost/event-analysis"));

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost/login?from=%2Fevent-analysis");
});

test("middleware redirects a student away from club lead screens", async () => {
  const response = await middleware(await createAuthedRequest("/event-analysis", "student"));

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost/dashboard");
});

test("middleware redirects a club lead away from student-only screens", async () => {
  const response = await middleware(await createAuthedRequest("/saved", "clublead"));

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost/dashboard");
});

test("middleware routes admin dashboard requests to admin home", async () => {
  const response = await middleware(await createAuthedRequest("/dashboard", "admin"));

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost/admin");
});

test("middleware allows admins to access calendar", async () => {
  const response = await middleware(await createAuthedRequest("/calendar", "admin"));

  assert.equal(response.status, 200);
});

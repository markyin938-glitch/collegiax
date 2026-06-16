import assert from "node:assert/strict";
import test from "node:test";
import { loginSchema } from "../lib/validation/auth";

test("loginSchema requires a role", () => {
  const parsed = loginSchema.safeParse({
    email: "student@collegiax.app",
    password: "student123",
  });

  assert.equal(parsed.success, false);
});

test("loginSchema accepts valid role-based login payloads", () => {
  const parsed = loginSchema.safeParse({
    email: "lead@collegiax.app",
    password: "lead1234",
    role: "clublead",
  });

  assert.equal(parsed.success, true);
});

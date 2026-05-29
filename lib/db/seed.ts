import { db } from "./client";
import { users, clubs, clubMembers, events } from "./schema";
import { hashPassword } from "@/lib/auth/password";
import { v4 as uuidv4 } from "uuid";

export async function seedDatabase() {
  try {
    const existing = await db.select().from(users).limit(1);
    if (existing.length > 0) {
      console.log("Database already seeded.");
      return;
    }

    const adminId = uuidv4();
    const clubLeadId = uuidv4();
    const studentId = uuidv4();

    await db.insert(users).values([
      {
        id: adminId,
        email: "admin@collegiax.app",
        passwordHash: await hashPassword("admin123"),
        name: "Admin User",
        role: "admin",
        avatarInitials: "AU",
        emailVerified: true,
      },
      {
        id: clubLeadId,
        email: "lead@collegiax.app",
        passwordHash: await hashPassword("lead123"),
        name: "Club Lead",
        role: "clublead",
        avatarInitials: "CL",
        emailVerified: true,
      },
      {
        id: studentId,
        email: "student@collegiax.app",
        passwordHash: await hashPassword("student123"),
        name: "Student User",
        role: "student",
        avatarInitials: "SU",
        emailVerified: true,
      },
    ]);

    const clubId = uuidv4();
    await db.insert(clubs).values({
      id: clubId,
      name: "CodeClub",
      slug: "codeclub",
      emoji: "💻",
      description: "The premier coding club on campus.",
      category: "tech",
      leadUserId: clubLeadId,
      memberCount: 1,
    });

    await db.insert(clubMembers).values({
      id: uuidv4(),
      clubId,
      userId: clubLeadId,
      clubRole: "Club Lead",
    });

    await db.insert(events).values({
      id: uuidv4(),
      clubId,
      createdBy: clubLeadId,
      title: "Hackathon 2026",
      slug: "hackathon-2026",
      description: "24-hour coding competition.",
      category: "tech",
      venue: "Main Hall",
      status: "approved",
    });

    console.log("Database seeded successfully.");
  } catch (e) {
    console.error("Seed error:", e);
  }
}

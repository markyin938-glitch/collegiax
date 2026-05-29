import { sqliteTable, text, integer, uniqueIndex, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["student", "clublead", "admin"] }).notNull(),
  rollNumber: text("roll_number"),
  department: text("department"),
  year: text("year"),
  college: text("college").notNull().default("ABC University"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  avatarInitials: text("avatar_initials"),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("active"),
  score: integer("score").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const emailVerifications = sqliteTable("email_verifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").unique(),
  otpCode: text("otp_code"),
  kind: text("kind", { enum: ["verify", "reset"] }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  usedAt: integer("used_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  userAgent: text("user_agent"),
  ip: text("ip"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  lastSeenAt: integer("last_seen_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  revokedAt: integer("revoked_at", { mode: "timestamp_ms" }),
});

export const clubs = sqliteTable("clubs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  emoji: text("emoji"),
  description: text("description"),
  category: text("category"),
  bannerUrl: text("banner_url"),
  leadUserId: text("lead_user_id").references(() => users.id, { onDelete: "set null" }),
  memberCount: integer("member_count").notNull().default(0),
  eventCount: integer("event_count").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const clubMembers = sqliteTable("club_members", {
  id: text("id").primaryKey(),
  clubId: text("club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clubRole: text("club_role").notNull().default("Volunteer"),
  status: text("status").notNull().default("active"),
  joinedAt: integer("joined_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}, (t) => [
  uniqueIndex("club_members_unique").on(t.clubId, t.userId),
]);

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  clubId: text("club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  createdBy: text("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  category: text("category", { enum: ["tech", "culture", "sports", "workshop", "social"] }),
  bannerUrl: text("banner_url"),
  venue: text("venue"),
  startAt: integer("start_at", { mode: "timestamp_ms" }),
  endAt: integer("end_at", { mode: "timestamp_ms" }),
  registrationDeadline: integer("registration_deadline", { mode: "timestamp_ms" }),
  capacity: integer("capacity").notNull().default(0),
  registeredCount: integer("registered_count").notNull().default(0),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  tags: text("tags"), // JSON array stored as text
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}, (t) => [
  index("idx_events_status_start").on(t.status, t.startAt),
  index("idx_events_club").on(t.clubId, t.status),
]);

export const eventRegistrations = sqliteTable("event_registrations", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("registered"),
  registeredAt: integer("registered_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  attendedAt: integer("attended_at", { mode: "timestamp_ms" }),
}, (t) => [
  uniqueIndex("event_registrations_unique").on(t.eventId, t.userId),
  index("idx_registrations_event").on(t.eventId, t.status),
  index("idx_registrations_user").on(t.userId),
]);

export const eventSaves = sqliteTable("event_saves", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  savedAt: integer("saved_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}, (t) => [
  uniqueIndex("event_saves_unique").on(t.eventId, t.userId),
]);

export const eventApprovals = sqliteTable("event_approvals", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  adminId: text("admin_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  action: text("action", { enum: ["approved", "rejected"] }).notNull(),
  reason: text("reason"),
  at: integer("at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clubId: text("club_id").references(() => clubs.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  priority: text("priority", { enum: ["normal", "urgent", "info"] }).notNull().default("normal"),
  audience: text("audience", { enum: ["all", "students", "clubleads"] }).notNull().default("all"),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const feedPosts = sqliteTable("feed_posts", {
  id: text("id").primaryKey(),
  clubId: text("club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  imageUrl: text("image_url"),
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const feedLikes = sqliteTable("feed_likes", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => feedPosts.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}, (t) => [
  uniqueIndex("feed_likes_unique").on(t.postId, t.userId),
]);

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["event_approved", "event_registered", "message", "collab_request"] }).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  linkUrl: text("link_url"),
  readAt: integer("read_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}, (t) => [
  index("idx_notifications_user").on(t.userId, t.readAt, t.createdAt),
]);

export const chatThreads = sqliteTable("chat_threads", {
  id: text("id").primaryKey(),
  kind: text("kind", { enum: ["dm", "group", "collab"] }).notNull(),
  title: text("title"),
  lastMessageAt: integer("last_message_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const chatParticipants = sqliteTable("chat_participants", {
  id: text("id").primaryKey(),
  threadId: text("thread_id").notNull().references(() => chatThreads.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: integer("joined_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  lastReadAt: integer("last_read_at", { mode: "timestamp_ms" }),
}, (t) => [
  uniqueIndex("chat_participants_unique").on(t.threadId, t.userId),
]);

export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  threadId: text("thread_id").notNull().references(() => chatThreads.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  attachmentUrl: text("attachment_url"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  editedAt: integer("edited_at", { mode: "timestamp_ms" }),
  deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
}, (t) => [
  index("idx_chat_messages_thread").on(t.threadId, t.createdAt),
]);

export const collaborations = sqliteTable("collaborations", {
  id: text("id").primaryKey(),
  fromClubId: text("from_club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  toClubId: text("to_club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["joint-event", "workshop", "resource", "sponsorship"] }).notNull(),
  proposedDate: integer("proposed_date", { mode: "timestamp_ms" }),
  status: text("status").notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  respondedAt: integer("responded_at", { mode: "timestamp_ms" }),
});

export const collabTasks = sqliteTable("collab_tasks", {
  id: text("id").primaryKey(),
  collaborationId: text("collaboration_id").notNull().references(() => collaborations.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  assigneeClubId: text("assignee_club_id").references(() => clubs.id, { onDelete: "set null" }),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
  createdBy: text("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp_ms" }),
});

export const collabFiles = sqliteTable("collab_files", {
  id: text("id").primaryKey(),
  collaborationId: text("collaboration_id").notNull().references(() => collaborations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sizeBytes: integer("size_bytes"),
  mimeType: text("mime_type"),
  url: text("url").notNull(),
  uploadedBy: text("uploaded_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  uploadedAt: integer("uploaded_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const collabTimeline = sqliteTable("collab_timeline", {
  id: text("id").primaryKey(),
  collaborationId: text("collaboration_id").notNull().references(() => collaborations.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  at: integer("at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const userActivityDaily = sqliteTable("user_activity_daily", {
  id: text("id").primaryKey(),
  day: text("day").notNull().unique(),
  logins: integer("logins").notNull().default(0),
  registrations: integer("registrations").notNull().default(0),
});

export const userScores = sqliteTable("user_scores", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  totalScore: integer("total_score").notNull().default(0),
  eventsAttended: integer("events_attended").notNull().default(0),
  certsEarned: integer("certs_earned").notNull().default(0),
  lastRecalcAt: integer("last_recalc_at", { mode: "timestamp_ms" }),
});

export const certificates = sqliteTable("certificates", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventId: text("event_id").references(() => events.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  issuedAt: integer("issued_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  downloadUrl: text("download_url"),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeName: text("badge_name").notNull(),
  icon: text("icon"),
  earnedAt: integer("earned_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  clubMemberships: many(clubMembers),
  createdEvents: many(events),
  eventRegistrations: many(eventRegistrations),
  eventSaves: many(eventSaves),
  notifications: many(notifications),
  chatMessages: many(chatMessages),
  chatParticipants: many(chatParticipants),
  achievements: many(achievements),
  certificates: many(certificates),
}));

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  lead: one(users, { fields: [clubs.leadUserId], references: [users.id] }),
  members: many(clubMembers),
  events: many(events),
  feedPosts: many(feedPosts),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  club: one(clubs, { fields: [events.clubId], references: [clubs.id] }),
  creator: one(users, { fields: [events.createdBy], references: [users.id] }),
  registrations: many(eventRegistrations),
  saves: many(eventSaves),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, { fields: [eventRegistrations.eventId], references: [events.id] }),
  user: one(users, { fields: [eventRegistrations.userId], references: [users.id] }),
}));

export const chatThreadsRelations = relations(chatThreads, ({ many }) => ({
  participants: many(chatParticipants),
  messages: many(chatMessages),
}));

export const chatParticipantsRelations = relations(chatParticipants, ({ one }) => ({
  thread: one(chatThreads, { fields: [chatParticipants.threadId], references: [chatThreads.id] }),
  user: one(users, { fields: [chatParticipants.userId], references: [users.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  thread: one(chatThreads, { fields: [chatMessages.threadId], references: [chatThreads.id] }),
  sender: one(users, { fields: [chatMessages.senderId], references: [users.id] }),
}));

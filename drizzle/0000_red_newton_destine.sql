CREATE TABLE `achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`badge_name` text NOT NULL,
	`icon` text,
	`earned_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`club_id` text,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`audience` text DEFAULT 'all' NOT NULL,
	`published_at` integer,
	`created_at` integer,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`event_id` text,
	`title` text NOT NULL,
	`issued_at` integer,
	`download_url` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`body` text NOT NULL,
	`attachment_url` text,
	`created_at` integer,
	`edited_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`thread_id`) REFERENCES `chat_threads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_chat_messages_thread` ON `chat_messages` (`thread_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `chat_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`user_id` text NOT NULL,
	`joined_at` integer,
	`last_read_at` integer,
	FOREIGN KEY (`thread_id`) REFERENCES `chat_threads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chat_participants_unique` ON `chat_participants` (`thread_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `chat_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`title` text,
	`last_message_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `club_members` (
	`id` text PRIMARY KEY NOT NULL,
	`club_id` text NOT NULL,
	`user_id` text NOT NULL,
	`club_role` text DEFAULT 'Volunteer' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`joined_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `club_members_unique` ON `club_members` (`club_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `clubs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`emoji` text,
	`description` text,
	`category` text,
	`banner_url` text,
	`lead_user_id` text,
	`member_count` integer DEFAULT 0 NOT NULL,
	`event_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`lead_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clubs_slug_unique` ON `clubs` (`slug`);--> statement-breakpoint
CREATE TABLE `collab_files` (
	`id` text PRIMARY KEY NOT NULL,
	`collaboration_id` text NOT NULL,
	`name` text NOT NULL,
	`size_bytes` integer,
	`mime_type` text,
	`url` text NOT NULL,
	`uploaded_by` text NOT NULL,
	`uploaded_at` integer,
	FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collab_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`collaboration_id` text NOT NULL,
	`text` text NOT NULL,
	`assignee_club_id` text,
	`done` integer DEFAULT false NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assignee_club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collab_timeline` (
	`id` text PRIMARY KEY NOT NULL,
	`collaboration_id` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`at` integer,
	FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collaborations` (
	`id` text PRIMARY KEY NOT NULL,
	`from_club_id` text NOT NULL,
	`to_club_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`proposed_date` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`responded_at` integer,
	FOREIGN KEY (`from_club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `email_verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text,
	`otp_code` text,
	`kind` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_verifications_token_unique` ON `email_verifications` (`token`);--> statement-breakpoint
CREATE TABLE `event_approvals` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`admin_id` text NOT NULL,
	`action` text NOT NULL,
	`reason` text,
	`at` integer,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event_registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'registered' NOT NULL,
	`registered_at` integer,
	`attended_at` integer,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_registrations_unique` ON `event_registrations` (`event_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `idx_registrations_event` ON `event_registrations` (`event_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_registrations_user` ON `event_registrations` (`user_id`);--> statement-breakpoint
CREATE TABLE `event_saves` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`saved_at` integer,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_saves_unique` ON `event_saves` (`event_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`club_id` text NOT NULL,
	`created_by` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`category` text,
	`banner_url` text,
	`venue` text,
	`start_at` integer,
	`end_at` integer,
	`registration_deadline` integer,
	`capacity` integer DEFAULT 0 NOT NULL,
	`registered_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`rejection_reason` text,
	`tags` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_events_status_start` ON `events` (`status`,`start_at`);--> statement-breakpoint
CREATE INDEX `idx_events_club` ON `events` (`club_id`,`status`);--> statement-breakpoint
CREATE TABLE `feed_likes` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`post_id`) REFERENCES `feed_posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feed_likes_unique` ON `feed_likes` (`post_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `feed_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`club_id` text NOT NULL,
	`author_id` text NOT NULL,
	`body` text NOT NULL,
	`image_url` text,
	`like_count` integer DEFAULT 0 NOT NULL,
	`comment_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`link_url` text,
	`read_at` integer,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_notifications_user` ON `notifications` (`user_id`,`read_at`,`created_at`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`user_agent` text,
	`ip` text,
	`created_at` integer,
	`last_seen_at` integer,
	`revoked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_activity_daily` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`logins` integer DEFAULT 0 NOT NULL,
	`registrations` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_activity_daily_day_unique` ON `user_activity_daily` (`day`);--> statement-breakpoint
CREATE TABLE `user_scores` (
	`user_id` text PRIMARY KEY NOT NULL,
	`total_score` integer DEFAULT 0 NOT NULL,
	`events_attended` integer DEFAULT 0 NOT NULL,
	`certs_earned` integer DEFAULT 0 NOT NULL,
	`last_recalc_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`roll_number` text,
	`department` text,
	`year` text,
	`college` text DEFAULT 'ABC University' NOT NULL,
	`bio` text,
	`avatar_url` text,
	`avatar_initials` text,
	`email_verified` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
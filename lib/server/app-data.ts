// @ts-nocheck
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  achievements,
  announcements,
  certificates,
  chatMessages,
  chatParticipants,
  chatThreads,
  clubMembers,
  clubs,
  collaborations,
  eventRegistrations,
  eventSaves,
  events,
  notifications,
  userScores,
  users,
} from "@/lib/db/schema";
import type { ServerSession } from "@/lib/auth/session";

function toMs(value: Date | number | null | undefined) {
  if (!value) return 0;
  return value instanceof Date ? value.getTime() : value;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

export async function getRoleDashboardData(session: ServerSession) {
  const [allEvents, allClubs, allRegistrations, allAnnouncements, allNotifications, scoreRows, memberships, collabRows] =
    await Promise.all([
      db.select().from(events),
      db.select().from(clubs),
      db.select().from(eventRegistrations),
      db.select().from(announcements),
      db.select().from(notifications),
      db.select().from(userScores).where(eq(userScores.userId, session.user.id)).limit(1),
      db.select().from(clubMembers).where(eq(clubMembers.userId, session.user.id)),
      db.select().from(collaborations),
    ]);

  const upcomingEvents = allEvents
    .filter((event) => event.status === "approved")
    .sort((a, b) => toMs(a.startAt) - toMs(b.startAt));
  const userRegistrations = allRegistrations.filter((registration) => registration.userId === session.user.id);
  const joinedClubIds = unique(memberships.map((membership) => membership.clubId));
  const score = scoreRows[0];

  if (session.user.role === "student") {
    return {
      kind: "student" as const,
      stats: [
        { label: "Upcoming events", value: upcomingEvents.length, hint: "Approved events on the calendar" },
        { label: "Registered", value: userRegistrations.length, hint: "Your current event registrations" },
        { label: "Clubs joined", value: joinedClubIds.length, hint: "Active campus communities" },
        { label: "Participation score", value: score?.totalScore ?? 0, hint: "Based on events and achievements" },
      ],
      spotlightEvents: upcomingEvents.slice(0, 4),
      announcements: allAnnouncements.sort((a, b) => toMs(b.publishedAt) - toMs(a.publishedAt)).slice(0, 4),
      notifications: allNotifications.filter((notification) => notification.userId === session.user.id).slice(0, 5),
    };
  }

  if (session.user.role === "clublead") {
    const ownedClubIds = unique(
      allClubs.filter((club) => club.leadUserId === session.user.id).map((club) => club.id).concat(joinedClubIds)
    );
    const managedEvents = allEvents.filter(
      (event) => event.createdBy === session.user.id || ownedClubIds.includes(event.clubId)
    );
    const managedEventIds = managedEvents.map((event) => event.id);
    const managedRegistrations = allRegistrations.filter((registration) => managedEventIds.includes(registration.eventId));
    const activeCollabs = collabRows.filter(
      (collab) => ownedClubIds.includes(collab.fromClubId) || ownedClubIds.includes(collab.toClubId)
    );

    return {
      kind: "clublead" as const,
      stats: [
        { label: "Managed events", value: managedEvents.length, hint: "Events owned by your club" },
        { label: "Registrations", value: managedRegistrations.length, hint: "Students signed up across events" },
        { label: "Clubs connected", value: ownedClubIds.length, hint: "Communities you manage or belong to" },
        { label: "Active collaborations", value: activeCollabs.length, hint: "Joint initiatives in progress" },
      ],
      spotlightEvents: managedEvents.sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt)).slice(0, 4),
      announcements: allAnnouncements.sort((a, b) => toMs(b.publishedAt) - toMs(a.publishedAt)).slice(0, 4),
      recentRegistrations: managedRegistrations
        .sort((a, b) => toMs(b.registeredAt) - toMs(a.registeredAt))
        .slice(0, 5),
    };
  }

  const pendingEvents = allEvents.filter((event) => event.status === "pending");
  return {
    kind: "admin" as const,
    stats: [
      { label: "Pending approvals", value: pendingEvents.length, hint: "Events waiting for review" },
      { label: "Campus users", value: (await db.select().from(users)).length, hint: "Students, leads, and admins" },
      { label: "Active clubs", value: allClubs.length, hint: "Campus communities on the platform" },
      { label: "Total registrations", value: allRegistrations.length, hint: "Participation across events" },
    ],
    spotlightEvents: pendingEvents.slice(0, 4),
    announcements: allAnnouncements.sort((a, b) => toMs(b.publishedAt) - toMs(a.publishedAt)).slice(0, 4),
  };
}

export async function getEventsFeed(userId?: string) {
  const [eventRows, clubRows, registrationRows, saveRows] = await Promise.all([
    db.select().from(events),
    db.select().from(clubs),
    userId ? db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId)) : Promise.resolve([]),
    userId ? db.select().from(eventSaves).where(eq(eventSaves.userId, userId)) : Promise.resolve([]),
  ]);

  const clubsById = new Map(clubRows.map((club) => [club.id, club]));
  const registeredIds = new Set(registrationRows.map((row) => row.eventId));
  const savedIds = new Set(saveRows.map((row) => row.eventId));

  return eventRows
    .sort((a, b) => toMs(a.startAt) - toMs(b.startAt))
    .map((event) => ({
      ...event,
      club: clubsById.get(event.clubId) ?? null,
      isRegistered: registeredIds.has(event.id),
      isSaved: savedIds.has(event.id),
      tagsList: event.tags ? (JSON.parse(event.tags) as string[]) : [],
    }));
}

export async function getEventDetail(eventId: string, userId?: string) {
  const [eventRows, clubRows, participantRows, saveRows] = await Promise.all([
    db.select().from(events).where(eq(events.id, eventId)).limit(1),
    db.select().from(clubs),
    db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId)),
    userId
      ? db.select().from(eventSaves).where(and(eq(eventSaves.userId, userId), eq(eventSaves.eventId, eventId))).limit(1)
      : Promise.resolve([]),
  ]);

  const event = eventRows[0];
  if (!event) return null;

  const club = clubRows.find((row) => row.id === event.clubId) ?? null;
  const participantIds = participantRows.map((row) => row.userId);
  const participantUsers = participantIds.length
    ? await db.select().from(users).where(inArray(users.id, participantIds))
    : [];

  return {
    ...event,
    club,
    isRegistered: userId ? participantRows.some((row) => row.userId === userId) : false,
    isSaved: saveRows.length > 0,
    participants: participantUsers,
    participantCount: participantRows.length,
    tagsList: event.tags ? (JSON.parse(event.tags) as string[]) : [],
  };
}

export async function getClubsDirectory() {
  const [clubRows, leadRows] = await Promise.all([db.select().from(clubs), db.select().from(users)]);
  const leadsById = new Map(leadRows.map((user) => [user.id, user]));
  return clubRows
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((club) => ({
      ...club,
      lead: club.leadUserId ? leadsById.get(club.leadUserId) ?? null : null,
    }));
}

export async function getClubDetail(clubId: string) {
  const clubRows = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1);
  const club = clubRows[0];
  if (!club) return null;
  const [leadRows, memberRows, eventRows, userRows] = await Promise.all([
    club.leadUserId ? db.select().from(users).where(eq(users.id, club.leadUserId)).limit(1) : Promise.resolve([]),
    db.select().from(clubMembers).where(eq(clubMembers.clubId, clubId)),
    db.select().from(events).where(eq(events.clubId, clubId)),
    db.select().from(users),
  ]);
  const usersById = new Map(userRows.map((user) => [user.id, user]));
  return {
    ...club,
    lead: leadRows[0] ?? null,
    members: memberRows.map((member) => ({
      ...member,
      user: usersById.get(member.userId) ?? null,
    })),
    events: eventRows.sort((a, b) => toMs(a.startAt) - toMs(b.startAt)),
  };
}

export async function getParticipationData(userId: string) {
  const [achievementRows, certificateRows, registrationRows, eventRows, scoreRows] = await Promise.all([
    db.select().from(achievements).where(eq(achievements.userId, userId)),
    db.select().from(certificates).where(eq(certificates.userId, userId)),
    db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId)),
    db.select().from(events),
    db.select().from(userScores).where(eq(userScores.userId, userId)).limit(1),
  ]);
  const eventsById = new Map(eventRows.map((event) => [event.id, event]));

  return {
    achievements: achievementRows.sort((a, b) => toMs(b.earnedAt) - toMs(a.earnedAt)),
    certificates: certificateRows
      .map((certificate) => ({
        ...certificate,
        event: certificate.eventId ? eventsById.get(certificate.eventId) ?? null : null,
      }))
      .sort((a, b) => toMs(b.issuedAt) - toMs(a.issuedAt)),
    registrations: registrationRows
      .map((registration) => ({
        ...registration,
        event: eventsById.get(registration.eventId) ?? null,
      }))
      .sort((a, b) => toMs(b.registeredAt) - toMs(a.registeredAt)),
    score: scoreRows[0] ?? null,
  };
}

export async function getProfileData(userId: string) {
  const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = userRows[0];
  if (!user) return null;
  const [scoreRows, membershipRows] = await Promise.all([
    db.select().from(userScores).where(eq(userScores.userId, userId)).limit(1),
    db.select().from(clubMembers).where(eq(clubMembers.userId, userId)),
  ]);
  return {
    user,
    score: scoreRows[0] ?? null,
    memberships: membershipRows,
  };
}

export async function getManageEventsData(userId: string) {
  const clubRows = await db.select().from(clubs);
  const ownedClubIds = clubRows.filter((club) => club.leadUserId === userId).map((club) => club.id);
  const eventRows = (await db.select().from(events)).filter(
    (event) => event.createdBy === userId || ownedClubIds.includes(event.clubId)
  );
  const registrations = eventRows.length
    ? await db.select().from(eventRegistrations).where(inArray(eventRegistrations.eventId, eventRows.map((event) => event.id)))
    : [];
  const attendeeRows = registrations.length
    ? await db.select().from(users).where(inArray(users.id, registrations.map((registration) => registration.userId)))
    : [];
  const attendeesById = new Map(attendeeRows.map((user) => [user.id, user]));

  return eventRows
    .sort((a, b) => toMs(a.startAt) - toMs(b.startAt))
    .map((event) => ({
      ...event,
      club: clubRows.find((club) => club.id === event.clubId) ?? null,
      participants: registrations
        .filter((registration) => registration.eventId === event.id)
        .map((registration) => ({
          ...registration,
          user: attendeesById.get(registration.userId) ?? null,
        })),
    }));
}

export async function getLeaderboardData() {
  const [userRows, scoreRows, achievementRows] = await Promise.all([
    db.select().from(users),
    db.select().from(userScores),
    db.select().from(achievements),
  ]);
  const scoresById = new Map(scoreRows.map((score) => [score.userId, score]));
  const achievementCounts = achievementRows.reduce<Record<string, number>>((acc, achievement) => {
    acc[achievement.userId] = (acc[achievement.userId] ?? 0) + 1;
    return acc;
  }, {});

  return userRows
    .map((user) => ({
      user,
      score: scoresById.get(user.id),
      achievements: achievementCounts[user.id] ?? 0,
    }))
    .sort((a, b) => (b.score?.totalScore ?? b.user.score ?? 0) - (a.score?.totalScore ?? a.user.score ?? 0));
}

export async function getAdminOverviewData() {
  const [userRows, clubRows, eventRows, registrationRows, announcementRows] = await Promise.all([
    db.select().from(users),
    db.select().from(clubs),
    db.select().from(events),
    db.select().from(eventRegistrations),
    db.select().from(announcements),
  ]);
  return {
    users: userRows,
    clubs: clubRows,
    events: eventRows,
    registrations: registrationRows,
    announcements: announcementRows.sort((a, b) => toMs(b.publishedAt) - toMs(a.publishedAt)),
  };
}

export async function getAnnouncementsWithAuthors() {
  const [announcementRows, userRows] = await Promise.all([db.select().from(announcements), db.select().from(users)]);
  const usersById = new Map(userRows.map((user) => [user.id, user]));
  return announcementRows
    .sort((a, b) => toMs(b.publishedAt) - toMs(a.publishedAt))
    .map((announcement) => ({
      ...announcement,
      author: usersById.get(announcement.authorId) ?? null,
    }));
}

export async function getMessageOverview(userId: string) {
  const participantRows = await db.select().from(chatParticipants).where(eq(chatParticipants.userId, userId));
  const threadIds = participantRows.map((row) => row.threadId);
  if (!threadIds.length) return [];
  const [threadRows, messageRows] = await Promise.all([
    db.select().from(chatThreads).where(inArray(chatThreads.id, threadIds)),
    db.select().from(chatMessages).where(inArray(chatMessages.threadId, threadIds)),
  ]);
  return threadRows.map((thread) => ({
    ...thread,
    messages: messageRows
      .filter((message) => message.threadId === thread.id)
      .sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt)),
  }));
}

"use client";

import { useMemo, useState } from "react";

type ClubOption = {
  id: string;
  name: string;
};

export function EventWizardForm({
  clubs,
  initialClubId,
}: {
  clubs: ClubOption[];
  initialClubId?: string;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "tech",
    venue: "",
    clubId: initialClubId ?? clubs[0]?.id ?? "",
    capacity: "100",
    startAt: "",
    endAt: "",
    registrationDeadline: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canSubmit = useMemo(
    () => Boolean(form.title.trim() && form.clubId && form.startAt && form.endAt),
    [form]
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to create event");
        return;
      }
      setSuccess("Event created successfully.");
      window.location.href = `/events/${data.event.id}`;
    } catch {
      setError("Unable to create event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <section className="ui-card space-y-6 p-6">
        <div>
          <p className="ui-eyebrow">Event creation</p>
          <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">Create a campus event</h2>
        </div>
        <div className="grid gap-4">
          <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
            Event title
            <input className="ui-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
            Description
            <textarea
              className="ui-input min-h-36 resize-none"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
              Club
              <select className="ui-input" value={form.clubId} onChange={(e) => setForm((f) => ({ ...f, clubId: e.target.value }))}>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
              Category
              <select className="ui-input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {["tech", "culture", "sports", "workshop", "social"].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
              Venue
              <input className="ui-input" value={form.venue} onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))} />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
              Capacity
              <input className="ui-input" type="number" min="0" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
              Start
              <input className="ui-input" type="datetime-local" value={form.startAt} onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))} />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
              End
              <input className="ui-input" type="datetime-local" value={form.endAt} onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))} />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)] md:col-span-2">
              Registration deadline
              <input className="ui-input" type="datetime-local" value={form.registrationDeadline} onChange={(e) => setForm((f) => ({ ...f, registrationDeadline: e.target.value }))} />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)] md:col-span-2">
              Tags
              <input className="ui-input" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="hackathon, ai, campus" />
            </label>
          </div>
        </div>
        {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
        {success ? <p className="text-sm text-[color:#1a7a54]">{success}</p> : null}
        <button type="submit" disabled={loading || !canSubmit} className="ui-button ui-button-primary">
          {loading ? "Creating..." : "Launch event"}
        </button>
      </section>
      <aside className="space-y-4">
        <div className="ui-card p-6">
          <p className="ui-eyebrow">Checklist</p>
          <h3 className="font-heading text-xl font-semibold text-[var(--on-background)]">Before you publish</h3>
          <ul className="mt-4 space-y-3 text-sm text-[var(--on-surface-variant)]">
            <li>Define a clear title and event purpose.</li>
            <li>Make sure the timing and venue are accurate.</li>
            <li>Add tags so students can discover the event faster.</li>
          </ul>
        </div>
      </aside>
    </form>
  );
}

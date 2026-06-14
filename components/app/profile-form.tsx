"use client";

import { useState } from "react";

type ProfileData = {
  name: string;
  email: string;
  college: string;
  department: string | null;
  year: string | null;
  rollNumber: string | null;
  bio: string | null;
};

export function ProfileForm({ initialProfile }: { initialProfile: ProfileData }) {
  const [form, setForm] = useState(initialProfile);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setError(data.error || "Unable to update profile");
        return;
      }
      setState("saved");
      setForm(data.profile);
    } catch {
      setState("error");
      setError("Unable to update profile");
    }
  }

  function updateField<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setState("idle");
  }

  return (
    <form onSubmit={onSubmit} className="ui-card space-y-6 p-6">
      <div>
        <p className="ui-eyebrow">Profile</p>
        <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">Personal details</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
          Full name
          <input className="ui-input" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
          Email
          <input className="ui-input" value={form.email} readOnly />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
          College
          <input className="ui-input" value={form.college} onChange={(e) => updateField("college", e.target.value)} />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
          Department
          <input className="ui-input" value={form.department ?? ""} onChange={(e) => updateField("department", e.target.value)} />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
          Year
          <input className="ui-input" value={form.year ?? ""} onChange={(e) => updateField("year", e.target.value)} />
        </label>
        <label className="space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
          Roll number
          <input className="ui-input" value={form.rollNumber ?? ""} onChange={(e) => updateField("rollNumber", e.target.value)} />
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
        Bio
        <textarea
          className="ui-input min-h-32 resize-none"
          value={form.bio ?? ""}
          onChange={(e) => updateField("bio", e.target.value)}
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          {state === "saved" ? <span className="text-[color:#1a7a54]">Profile updated.</span> : null}
          {state === "error" ? <span className="text-[var(--error)]">{error}</span> : null}
        </div>
        <button type="submit" disabled={state === "saving"} className="ui-button ui-button-primary">
          {state === "saving" ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

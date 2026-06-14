"use client";

import { useState } from "react";
import { Bookmark, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function EventActions({
  eventId,
  initialRegistered,
  initialSaved,
}: {
  eventId: string;
  initialRegistered: boolean;
  initialSaved: boolean;
}) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [saved, setSaved] = useState(initialSaved);
  const [loadingAction, setLoadingAction] = useState<"register" | "save" | null>(null);
  const [error, setError] = useState("");

  async function toggleRegister() {
    setError("");
    setLoadingAction("register");
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: registered ? "DELETE" : "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to update registration");
      } else {
        setRegistered(Boolean(data.registered));
      }
    } catch {
      setError("Unable to update registration");
    } finally {
      setLoadingAction(null);
    }
  }

  async function toggleSave() {
    setError("");
    setLoadingAction("save");
    try {
      const res = await fetch(`/api/events/${eventId}/save`, {
        method: saved ? "DELETE" : "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to update saved state");
      } else {
        setSaved(Boolean(data.saved));
      }
    } catch {
      setError("Unable to update saved state");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={toggleRegister}
          disabled={loadingAction !== null}
          className={cn(
            "ui-button flex-1 justify-center",
            registered ? "ui-button-secondary" : "ui-button-primary"
          )}
        >
          {loadingAction === "register" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {registered ? "Registered" : "Register"}
        </button>
        <button
          type="button"
          onClick={toggleSave}
          disabled={loadingAction !== null}
          className="ui-button ui-button-secondary flex-1 justify-center"
        >
          {loadingAction === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className="h-4 w-4" />}
          {saved ? "Saved" : "Save event"}
        </button>
      </div>
      {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
    </div>
  );
}

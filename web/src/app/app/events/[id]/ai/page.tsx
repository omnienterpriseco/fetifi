"use client";

import { useState } from "react";
import { useEvent } from "@/components/event-frame";
import { Button } from "@/components/ui";
import { optimizeBudget, readiness } from "@/lib/planner";
import { fileToDataUrl } from "@/lib/party-ai";
import { extractPalette } from "@/lib/palette";
import { useAppStore } from "@/lib/store";
import { nowIso, uid } from "@/lib/utils";

export default function AiPage() {
  const event = useEvent();
  const user = useAppStore((s) => s.currentUser);
  const attachAiJob = useAppStore((s) => s.attachAiJob);
  const addInspoPin = useAppStore((s) => s.addInspoPin);
  const refreshPlan = useAppStore((s) => s.refreshPlan);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (!event || !user) return null;
  const current = event;
  const profile = user;

  function generateFromInspo() {
    refreshPlan(current.id);
    attachAiJob(current.id, {
      id: uid(),
      eventId: current.id,
      jobType: "planner",
      status: "completed",
      promptPayload: { from: "inspo" },
      resultPayload: { theme: current.theme.themeName },
      createdAt: nowIso(),
    });
    setMessage("Built a party idea from your inspo. Open Print for matching invites and signs.");
  }

  function runBudget() {
    const result = optimizeBudget(current);
    attachAiJob(current.id, {
      id: uid(),
      eventId: current.id,
      jobType: "budget",
      status: "completed",
      promptPayload: { title: current.title },
      resultPayload: result,
      createdAt: nowIso(),
    });
    setMessage(
      result.over > 0
        ? `Estimates sit about $${Math.round(result.over)} over the ceiling.`
        : `Estimates sit about $${Math.round(-result.over)} under the ceiling.`,
    );
  }

  function runCheck() {
    const result = readiness(current);
    attachAiJob(current.id, {
      id: uid(),
      eventId: current.id,
      jobType: "check",
      status: "completed",
      promptPayload: { title: current.title },
      resultPayload: result,
      createdAt: nowIso(),
    });
    setMessage(`Readiness ${result.score}. ${result.flags[0] || "You are close."}`);
  }

  async function onImage(file: File) {
    setBusy(true);
    try {
      const [dataUrl, colors] = await Promise.all([fileToDataUrl(file), extractPalette(file)]);
      addInspoPin(current.id, {
        id: uid(),
        eventId: current.id,
        caption: file.name.replace(/\.[^.]+$/, "") || "Mood board",
        detail: "Read for color and used to generate the party idea.",
        dataUrl: dataUrl || undefined,
        colors,
        kind: "upload",
      });
      refreshPlan(current.id);
      attachAiJob(current.id, {
        id: uid(),
        eventId: current.id,
        jobType: "inspiration",
        status: "completed",
        promptPayload: { file: file.name },
        resultPayload: { colors },
        createdAt: nowIso(),
      });
      setMessage("Photo read. Theme, printables, and party idea updated.");
    } catch {
      setMessage("That photo could not be read. Try a JPG or PNG.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="text-3xl">AI planner</h2>
      <p className="mt-2 text-sm text-muted">
        Upload inspo or tap generate. Fetifi builds a party idea from your photos and theme, then writes printables to match.
      </p>
      {message ? <p className="mt-4 text-sm">{message}</p> : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button variant="dark" disabled={busy} onClick={generateFromInspo}>
          Generate party from inspo
        </Button>
        <Button variant="outline" onClick={runBudget}>
          Budget check
        </Button>
        <Button variant="outline" onClick={runCheck}>
          Readiness check
        </Button>
      </div>
      <label className="mt-8 block hairline rounded-3xl bg-white/50 p-6 text-sm">
        Drop a Pinterest screenshot or mood board
        <input
          className="mt-3 block w-full text-sm"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void onImage(file);
          }}
        />
      </label>
      <ul className="mt-8 space-y-3">
        {event.activities.map((activity) => (
          <li key={activity.id} className="hairline rounded-3xl bg-white/50 p-5">
            <p className="text-lg">{activity.title}</p>
            <p className="text-xs text-muted">
              {activity.ageRange} · {activity.durationMinutes} min
            </p>
            <ol className="mt-2 list-decimal pl-5 text-sm">
              {activity.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">{profile.fullName} · {profile.planTier}</p>
    </div>
  );
}

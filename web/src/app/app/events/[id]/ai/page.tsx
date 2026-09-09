"use client";

import { useState } from "react";
import { useEvent } from "@/components/event-frame";
import { Button } from "@/components/ui";
import { instantiateEvent, optimizeBudget, readiness } from "@/lib/planner";
import { useAppStore } from "@/lib/store";
import { nowIso, uid } from "@/lib/utils";
import { extractPalette } from "@/lib/palette";

export default function AiPage() {
  const event = useEvent();
  const user = useAppStore((s) => s.currentUser);
  const useAiPrompt = useAppStore((s) => s.useAiPrompt);
  const attachAiJob = useAppStore((s) => s.attachAiJob);
  const applyActivities = useAppStore((s) => s.applyActivities);
  const applyPalette = useAppStore((s) => s.applyPalette);
  const updateEvent = useAppStore((s) => s.updateEvent);
  const [message, setMessage] = useState("");

  if (!event || !user) return null;
  const current = event;
  const profile = user;

  const unlimited = profile.planTier !== "free" || current.kitUnlocked;
  const remaining = unlimited ? "unlimited" : `${Math.max(0, profile.aiPromptsLimit - profile.aiPromptsUsed)} left`;

  function run(jobType: "planner" | "activity" | "budget" | "check") {
    if (!unlimited && !useAiPrompt()) {
      setMessage("Free tier is out of AI prompts this month. Unlock a kit or go Pro.");
      return;
    }
    const job = {
      id: uid(),
      eventId: current.id,
      jobType,
      status: "completed" as const,
      promptPayload: { title: current.title },
      resultPayload: {},
      createdAt: nowIso(),
    };
    if (jobType === "planner") {
      const generated = instantiateEvent({
        prompt: `${current.title} ${current.description}`,
        ownerId: current.ownerId,
        ownerName: profile.fullName,
        ownerEmail: profile.email,
        budget: current.totalBudget,
        dateStart: current.dateStart,
        location: current.locationName,
      });
      updateEvent(current.id, {
        plannerNotes: generated.plannerNotes,
        qualityScore: readiness(current).score,
        activities: generated.activities,
      });
      job.resultPayload = { notes: generated.plannerNotes };
      setMessage("Planner refreshed gaps and quality notes.");
    }
    if (jobType === "activity") {
      const extra = [
        ...current.activities,
        {
          id: uid(),
          eventId: current.id,
          title: "Quiet corner reset",
          ageRange: "2–5",
          durationMinutes: 10,
          suppliesNeeded: ["Floor pillows", "Picture books"],
          steps: ["Park overstimulated kids with a grown-up.", "No photos, no pressure.", "Rejoin when they ask."],
        },
      ];
      applyActivities(current.id, extra);
      setMessage("Added an age-appropriate calm activity.");
    }
    if (jobType === "budget") {
      job.resultPayload = optimizeBudget(current);
      setMessage("Budget optimizer ran — see the Budget tab.");
    }
    if (jobType === "check") {
      job.resultPayload = readiness(current);
      setMessage(`Readiness ${readiness(current).score}.`);
    }
    attachAiJob(current.id, job);
  }

  async function onImage(file: File) {
    if (!unlimited && !useAiPrompt()) {
      setMessage("Out of AI prompts.");
      return;
    }
    const colors = await extractPalette(file);
    applyPalette(
      current.id,
      colors,
      `Palette pulled from ${file.name}: ${colors.join(", ")}`,
    );
    attachAiJob(current.id, {
      id: uid(),
      eventId: current.id,
      jobType: "inspiration",
      status: "completed",
      promptPayload: { file: file.name },
      resultPayload: { colors },
      createdAt: nowIso(),
    });
    setMessage("Theme colors updated from your mood board.");
  }

  return (
    <div>
      <h2 className="text-3xl">AI services</h2>
      <p className="mt-2 text-sm text-muted">Usage: {remaining}. Jobs are local until Edge Functions are attached.</p>
      {message ? <p className="mt-4 text-sm">{message}</p> : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button variant="dark" onClick={() => run("planner")}>
          Event planner
        </Button>
        <Button variant="outline" onClick={() => run("activity")}>
          Activity generator
        </Button>
        <Button variant="outline" onClick={() => run("budget")}>
          Budget optimizer
        </Button>
        <Button variant="outline" onClick={() => run("check")}>
          Readiness checker
        </Button>
      </div>
      <label className="mt-8 block hairline rounded-3xl bg-white/50 p-6 text-sm">
        Inspiration analyzer — drop a Pinterest screenshot or mood board
        <input
          className="mt-3 block w-full text-sm"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
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
    </div>
  );
}

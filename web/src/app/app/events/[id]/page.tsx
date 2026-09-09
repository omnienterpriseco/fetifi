"use client";

import Link from "next/link";
import { useEvent } from "@/components/event-frame";
import { Button } from "@/components/ui";
import { optimizeBudget, readiness } from "@/lib/planner";
import { formatWhen, money } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export default function EventOverviewPage() {
  const event = useEvent();
  const unlockKit = useAppStore((s) => s.unlockKit);
  if (!event) return null;
  const ready = readiness(event);
  const budget = optimizeBudget(event);
  const done = event.schedules.filter((s) => s.isCompleted).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        <article className="hairline rounded-3xl bg-white/50 p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Readiness</p>
          <p className="display mt-2 text-6xl">{ready.score}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {ready.flags.length
              ? ready.flags.map((flag) => <li key={flag}>{flag}</li>)
              : <li>You’re close. Lock vendors and send a reminder.</li>}
          </ul>
        </article>
        <article className="hairline rounded-3xl bg-white/50 p-6">
          <h2 className="text-2xl">Planner notes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {event.plannerNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <Button href={`/app/events/${event.id}/ai`} className="mt-5" variant="outline">
            Run AI planner
          </Button>
        </article>
      </section>
      <aside className="space-y-4">
        <div className="hairline rounded-3xl p-5" style={{ background: event.theme.secondaryColor }}>
          <p className="text-sm">{formatWhen(event.dateStart)}</p>
          <p className="text-sm">{event.locationName}</p>
          <p className="mt-3 text-sm">
            {money(event.totalBudget)} budget · {money(budget.spent)} estimated
          </p>
          <p className="mt-1 text-sm">
            Schedule {done}/{event.schedules.length} · Guests {event.invitations.length}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link className="text-sm underline" href={`/app/events/${event.id}/schedule`}>
              Timeline
            </Link>
            <span>·</span>
            <Link className="text-sm underline" href={`/invite/${event.id}`}>
              Public invite
            </Link>
          </div>
        </div>
        {!event.kitUnlocked ? (
          <div className="hairline rounded-3xl bg-white/50 p-5 text-sm">
            <p className="font-medium">Event kit</p>
            <p className="mt-1 text-muted">
              Unlock unlimited AI, printables polish, and extra collaborators for this
              workspace only.
            </p>
            <Button className="mt-4" variant="dark" onClick={() => unlockKit(event.id)}>
              Unlock kit (demo)
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted">Kit unlocked for this event.</p>
        )}
      </aside>
    </div>
  );
}

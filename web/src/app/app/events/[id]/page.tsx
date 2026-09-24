"use client";

import Link from "next/link";
import { useEvent } from "@/components/event-frame";
import { Button, inputClass } from "@/components/ui";
import { optimizeBudget, readiness } from "@/lib/planner";
import { formatWhen, money } from "@/lib/utils";
import { pricing } from "@/lib/pricing";
import { useAppStore } from "@/lib/store";

export default function EventOverviewPage() {
  const event = useEvent();
  const unlockKit = useAppStore((s) => s.unlockKit);
  const updateEvent = useAppStore((s) => s.updateEvent);
  const applyThemeOption = useAppStore((s) => s.applyThemeOption);
  const refreshPlan = useAppStore((s) => s.refreshPlan);
  if (!event) return null;
  const ready = readiness(event);
  const budget = optimizeBudget(event);
  const done = event.schedules.filter((s) => s.isCompleted).length;
  const themes = event.themeOptions || [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        <article className="hairline rounded-3xl bg-white/50 p-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Customize the party</p>
          <input
            className={inputClass}
            defaultValue={event.title}
            onBlur={(e) => updateEvent(event.id, { title: e.target.value })}
          />
          <input
            className={inputClass}
            defaultValue={event.locationName}
            onBlur={(e) => updateEvent(event.id, { locationName: e.target.value })}
          />
          <textarea
            className={`${inputClass} min-h-24`}
            defaultValue={event.description}
            onBlur={(e) => updateEvent(event.id, { description: e.target.value })}
          />
        </article>
        <article className="hairline rounded-3xl bg-white/50 p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Theme list</p>
          <ul className="mt-3 space-y-3">
            {themes.map((theme) => (
              <li key={theme.id} className="flex items-start justify-between gap-3">
                <div>
                  <p>{theme.name}</p>
                  <p className="text-sm text-muted">{theme.why}</p>
                </div>
                <Button variant="outline" onClick={() => applyThemeOption(event.id, theme)}>
                  {event.theme.themeName === theme.name ? "Selected" : "Use"}
                </Button>
              </li>
            ))}
          </ul>
          <Button className="mt-4" variant="dark" onClick={() => refreshPlan(event.id)}>
            Ask Fetifi to refresh the plan
          </Button>
        </article>
        <article className="hairline rounded-3xl bg-white/50 p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Readiness {ready.score}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {ready.flags.length
              ? ready.flags.map((flag) => <li key={flag}>{flag}</li>)
              : <li>You are close. Lock vendors and send a reminder.</li>}
          </ul>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            {event.plannerNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
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
            <Link className="text-sm underline" href={`/app/events/${event.id}/inspo`}>
              Inspo
            </Link>
            <span>·</span>
            <Link className="text-sm underline" href={`/app/events/${event.id}/printables`}>
              Printables
            </Link>
            <span>·</span>
            <Link className="text-sm underline" href={`/app/events/${event.id}/budget`}>
              Budget
            </Link>
          </div>
        </div>
        {!event.kitUnlocked ? (
          <div className="hairline rounded-3xl bg-white/50 p-5 text-sm">
            <p className="font-medium">Event kit</p>
            <p className="mt-1 text-muted">
              Unlock extra AI prompts for this workspace. Sale price {pricing.kit.price} (was {pricing.kit.was}).
            </p>
            <Button className="mt-4" variant="dark" onClick={() => unlockKit(event.id)}>
              Unlock kit {pricing.kit.price}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted">Kit unlocked for this event.</p>
        )}
      </aside>
    </div>
  );
}

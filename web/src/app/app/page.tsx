"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { formatWhen, money } from "@/lib/utils";

export default function DashboardPage() {
  const events = useAppStore((s) => s.events);
  const user = useAppStore((s) => s.currentUser);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {user?.planTier} · {user?.aiPromptsUsed}/{user?.aiPromptsLimit} AI prompts
          </p>
          <h1 className="mt-2 text-4xl">Your events</h1>
        </div>
        <div className="flex gap-2">
          <Button href="/join" variant="outline">
            Join with code
          </Button>
          <Button href="/app/new" variant="dark">
            New event
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="mt-12 hairline rounded-[2rem] bg-white/40 p-10 text-center">
          <p className="display text-3xl">The box is empty.</p>
          <p className="mt-2 text-muted">Drop in a sentence. We’ll build the rest.</p>
          <Button href="/app/new" className="mt-6" variant="dark">
            Start the wizard
          </Button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/app/events/${event.id}`}
                className="box-shadow hairline flex flex-col gap-3 rounded-[1.6rem] bg-white/50 p-5 md:flex-row md:items-center md:justify-between"
                style={{ borderLeft: `8px solid ${event.theme.primaryColor}` }}
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">
                    {event.theme.themeName} · {event.eventType}
                  </p>
                  <h2 className="text-2xl">{event.title}</h2>
                  <p className="text-sm text-muted">
                    {formatWhen(event.dateStart)} · {event.locationName}
                  </p>
                </div>
                <div className="text-sm text-muted">
                  {money(event.totalBudget)} ceiling · join {event.joinCode}
                  {event.kitUnlocked ? " · kit" : ""}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-10 text-center text-sm">
        <Link href="/app/account" className="text-muted underline">
          Account & deletion
        </Link>
      </p>
    </main>
  );
}

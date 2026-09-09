"use client";

import Link from "next/link";
import { PastelTagline } from "@/components/brand";
import { LandingConfetti } from "@/components/landing-confetti";
import { Button } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { formatWhen, money } from "@/lib/utils";

export default function DashboardPage() {
  const events = useAppStore((s) => s.events);
  const user = useAppStore((s) => s.currentUser);

  return (
    <div>
      <LandingConfetti />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {user?.planTier} · {user?.aiPromptsUsed}/{user?.aiPromptsLimit} AI prompts
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] md:text-6xl">
            <PastelTagline />
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Your events live here. Drop in a sentence and we fill the box.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button href="/join" variant="outline">
              Join with code
            </Button>
            <Button href="/app/new" variant="dark">
              New event
            </Button>
          </div>
        </section>

        {events.length === 0 ? (
          <div className="mx-auto mt-12 max-w-lg hairline rounded-[2rem] bg-paper-2/80 p-10 text-center">
            <p className="display text-3xl">The box is empty.</p>
            <p className="mt-2 text-muted">Start with something like “3rd birthday, jungle theme, $500.”</p>
            <Button href="/app/new" className="mt-6" variant="dark">
              Start the wizard
            </Button>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/app/events/${event.id}`}
                  className="box-shadow hairline flex flex-col gap-3 rounded-[1.6rem] bg-paper-2/80 p-5 md:flex-row md:items-center md:justify-between"
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
    </div>
  );
}

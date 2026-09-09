import { MarketingNav } from "@/components/nav";
import { LandingConfetti } from "@/components/landing-confetti";
import { PastelTagline } from "@/components/brand";
import { Button } from "@/components/ui";
import { brand } from "@/lib/brand";

const modules = [
  ["Wizard", "One prompt or a short walkthrough. A full workspace appears."],
  ["Themes", "Accent, type, and printables shift with the event."],
  ["Supplies", "Decor, food, gear: needed, borrowed, or on the way."],
  ["Run of show", "Prep, doors, peak, tear-down. Minute by minute."],
  ["Budget", "Ceilings, actuals, and a warning before you overspend."],
  ["Team", "Roles, tasks, and who owns the cake."],
  ["Printables", "Invites, banners, menus, activity sheets."],
  ["RSVP", "Guest list, plus-ones, dietary notes, join codes."],
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingConfetti />
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <section className="mx-auto max-w-2xl py-10 text-center lg:py-16">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            {brand.name} · Web + iPhone
          </p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-7xl">
            <PastelTagline />
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted">
            Type something like “3rd birthday, jungle theme, $500.” Walk into a
            themed workspace with a timeline, budget, supplies, guests, and printables
            already in it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/signup" variant="dark">
              Open an empty box
            </Button>
            <Button href="/pricing" variant="outline">
              See kits & Pro
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted">
            {brand.name} on the web and on iPhone: one event, everywhere.
          </p>
        </section>

        <section id="modules" className="py-10">
          <h2 className="text-3xl md:text-4xl">Everything that lives in the box</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map(([title, copy]) => (
              <article key={title} className="hairline rounded-3xl bg-paper-2/80 p-5">
                <h3 className="text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] px-8 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl">Same event. Phone and browser.</h2>
              <p className="mt-3 text-sm text-muted">
                Native iOS and this web app share one schema: owners, editors, viewers,
                entitlements, and the workspace itself.
              </p>
            </div>
            <div className="text-sm text-muted">
              <p>Apple / email sign-in · granular access · full account deletion</p>
              <p className="mt-2">Realtime collaboration is wired for Supabase when you connect it.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

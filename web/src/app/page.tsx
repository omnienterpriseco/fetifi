import { MarketingNav } from "@/components/nav";
import { BrandLockup } from "@/components/brand";
import { Button } from "@/components/ui";
import { brand } from "@/lib/brand";

const modules = [
  ["Wizard", "One prompt or a short walkthrough. A full workspace appears."],
  ["Themes", "Accent, type, and printables shift with the event."],
  ["Supplies", "Decor, food, gear — needed, borrowed, or on the way."],
  ["Run of show", "Prep, doors, peak, tear-down. Minute by minute."],
  ["Budget", "Ceilings, actuals, and a warning before you overspend."],
  ["Team", "Roles, tasks, and who owns the cake."],
  ["Printables", "Invites, banners, menus, activity sheets."],
  ["RSVP", "Guest list, plus-ones, dietary notes, join codes."],
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <section className="grid items-center gap-12 py-10 md:grid-cols-[1.1fr_0.9fr] md:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              {brand.name} · Web + iPhone
            </p>
            <h1 className="mt-4 max-w-xl text-5xl leading-[1.05] md:text-7xl">
              {brand.tagline}
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              Type something like “3rd birthday — jungle theme — $500.” Walk into a
              themed workspace with a timeline, budget, supplies, guests, and printables
              already in it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/signup" variant="dark">
                Open an empty box
              </Button>
              <Button href="/pricing" variant="outline">
                See kits & Pro
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted">
              {brand.name} on the web and on iPhone — one event, everywhere.
            </p>
          </div>
          <div className="relative flex justify-center">
            <img
              src={brand.icon}
              alt={`${brand.name} app icon`}
              className="h-auto w-full max-w-sm rounded-[2.4rem] shadow-[0_24px_60px_rgba(107,76,255,0.25)]"
            />
          </div>
        </section>

        <section id="modules" className="py-10">
          <h2 className="text-3xl md:text-4xl">Everything that lives in the box</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map(([title, copy]) => (
              <article key={title} className="hairline rounded-3xl bg-white/40 p-5">
                <h3 className="text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-black px-8 py-12 text-paper">
          <div className="mx-auto max-w-2xl">
            <BrandLockup />
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl text-paper">Same event. Phone and browser.</h2>
              <p className="mt-3 text-sm text-paper/70">
                Native iOS and this web app share one schema: owners, editors, viewers,
                entitlements, and the workspace itself.
              </p>
            </div>
            <div className="text-sm text-paper/80">
              <p>Apple / email sign-in · granular access · full account deletion</p>
              <p className="mt-2">Realtime collaboration is wired for Supabase when you connect it.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

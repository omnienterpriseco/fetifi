import { MarketingNav } from "@/components/nav";
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
              Web + iPhone · Cloud-first
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
          <div className="relative">
            <div className="box-shadow hairline rounded-[2rem] bg-paper-2 p-4">
              <div className="rounded-[1.4rem] bg-[#1f4d3a] px-5 py-4 text-[#f3e2b4]">
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                  Instant transformation
                </p>
                <p className="display mt-2 text-2xl">Leo’s jungle birthday</p>
                <p className="mt-1 text-sm opacity-80">Sat 2:00 PM · $500 ceiling</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Quality score 72 · 3 gaps to close",
                  "Run-of-show: 7 blocks from setup to strike",
                  "Join code ready for grandparents",
                ].map((line) => (
                  <li
                    key={line}
                    className="hairline rounded-2xl bg-white/50 px-4 py-3"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
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

        <section className="mt-8 grid gap-6 rounded-[2rem] bg-ink px-8 py-12 text-paper md:grid-cols-2">
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
        </section>
      </main>
    </div>
  );
}

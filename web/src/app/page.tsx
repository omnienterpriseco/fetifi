import { MarketingNav } from "@/components/nav";
import { LandingConfetti } from "@/components/landing-confetti";
import { PastelTagline } from "@/components/brand";
import { Button } from "@/components/ui";
import { MarketingFooter } from "@/components/footer";
import { brand } from "@/lib/brand";
import { pricing } from "@/lib/pricing";

const steps = [
  ["1", "Tell Fetifi the party", "Name, budget, date, vibe, and a few inspo photos."],
  ["2", "Pick a theme", "Get a ranked list of palettes and a shopping board you can edit."],
  ["3", "Run the day", "Guest list, checklist, printables, and a ceiling you will not blow past."],
];

const modules = [
  ["Plan", "Title, date, place, budget, theme list, supplies, and printables in one workspace."],
  ["Inspo", "Upload mood-board photos. Fetifi turns them into ideas you can actually buy or make."],
  ["Guest list", "Names, RSVP, plus-ones, dietary notes, and a join code for helpers."],
  ["Checklist", "The run of show: setup, doors, cake, strike. Tap when it is done."],
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingConfetti />
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-6 pb-16 md:px-10">
        <section className="mx-auto max-w-2xl py-10 text-center lg:py-16">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            {brand.name} · Web + iPhone
          </p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-7xl">
            <PastelTagline />
          </h1>
          <p className="mt-4 text-xl text-[#c9b6de]">{brand.slogan}</p>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted">
            {brand.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/signup" variant="dark">
              Start 3-day free trial
            </Button>
            <Button href="/pricing" variant="outline">
              See pricing
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted">
            No charge today. Free includes {pricing.free.detail.toLowerCase()}
          </p>
        </section>

        <section id="how" className="py-8">
          <h2 className="text-center text-3xl md:text-4xl">How a party gets planned</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([n, title, copy]) => (
              <article key={n} className="hairline rounded-3xl bg-paper-2/80 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Step {n}</p>
                <h3 className="mt-2 text-2xl">{title}</h3>
                <p className="mt-2 text-sm text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="modules" className="py-10">
          <h2 className="text-3xl md:text-4xl">Inside every workspace</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {modules.map(([title, copy]) => (
              <article key={title} className="hairline rounded-3xl bg-paper-2/80 p-5">
                <h3 className="text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[2rem] bg-paper-2/80 px-8 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl">Built to sell a finished party, not a blank doc</h2>
              <p className="mt-3 text-sm text-muted">
                Hosts start from a sentence, not a spreadsheet. Fetifi fills the box, then
                stays out of the way so they can change the budget, swap a theme, and print
                the invite.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted">
              <li>Web app plus native iPhone app</li>
              <li>Local demo you can click today. Cloud, auth, and Stripe are ready to wire.</li>
              <li>Event kit {pricing.kit.price} (was {pricing.kit.was}). Pro {pricing.pro.price} (was {pricing.pro.was}).</li>
            </ul>
          </div>
          <div className="mt-8">
            <Button href="/signup" variant="dark">
              Plan a party
            </Button>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

"use client";

import { MarketingNav } from "@/components/nav";
import { Button } from "@/components/ui";
import { pricing } from "@/lib/pricing";
import { useAppStore } from "@/lib/store";

const tiers = [
  {
    name: pricing.free.name,
    price: pricing.free.price,
    detail: pricing.free.detail,
    cta: "Stay on Free",
    action: "free" as const,
  },
  {
    name: pricing.kit.name,
    was: pricing.kit.was,
    price: pricing.kit.price,
    detail: pricing.kit.detail,
    cta: "Unlock a kit",
    action: "kit" as const,
  },
  {
    name: pricing.pro.name,
    was: pricing.pro.was,
    price: pricing.pro.price,
    detail: pricing.pro.detail,
    cta: "Go Pro",
    action: "pro" as const,
  },
];

export default function PricingPage() {
  const setPlan = useAppStore((s) => s.setPlan);
  const events = useAppStore((s) => s.events);
  const unlockKit = useAppStore((s) => s.unlockKit);
  const user = useAppStore((s) => s.currentUser);

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Sale</p>
        <h1 className="mt-3 text-5xl">Pay for the event, or for the practice.</h1>
        <p className="mt-4 max-w-xl text-muted">
          {pricing.saleNote} Stripe Checkout will take over here. For now, plans apply on
          this device so you can feel the entitlements. US/EU tax should use Stripe Tax
          with an active registration before going live.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.name} className="hairline flex flex-col rounded-[1.8rem] bg-white/40 p-6">
              {"was" in tier ? (
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Sale</p>
              ) : null}
              <h2 className="text-2xl">{tier.name}</h2>
              <p className="mt-2 display text-4xl">{tier.price}</p>
              {"was" in tier ? (
                <p className="mt-1 text-sm text-muted line-through">{tier.was}</p>
              ) : null}
              <p className="mt-3 flex-1 text-sm text-muted">{tier.detail}</p>
              <Button
                className="mt-6 w-full"
                variant={tier.action === "pro" ? "dark" : "outline"}
                onClick={() => {
                  if (tier.action === "kit") {
                    if (events[0]) unlockKit(events[0].id);
                    return;
                  }
                  setPlan(tier.action === "pro" ? "pro" : "free");
                }}
              >
                {tier.cta}
              </Button>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          Current plan: {user?.planTier ?? "signed out"}. Marketplace (Phase 3) is sketched
          in schema only.
        </p>
      </main>
    </div>
  );
}

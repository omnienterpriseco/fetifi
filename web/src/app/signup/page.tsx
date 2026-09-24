"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingNav } from "@/components/nav";
import { MarketingFooter } from "@/components/footer";
import { Button, Field, inputClass } from "@/components/ui";
import { brand } from "@/lib/brand";
import { FREE_AI_PROMPTS } from "@/lib/pricing";
import { useAppStore } from "@/lib/store";
import { colorVibes, partyFrequencies, plannerLevels } from "@/lib/taste";

export default function SignupPage() {
  const signIn = useAppStore((s) => s.signIn);
  const setTaste = useAppStore((s) => s.setTaste);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [palette, setPalette] = useState("neutrals");
  const [frequency, setFrequency] = useState<string>(partyFrequencies[0]);
  const [level, setLevel] = useState<string>(plannerLevels[0]);

  const canAccount =
    name.trim().length > 0 && email.includes("@") && email.includes(".");

  function onAccount(e: FormEvent) {
    e.preventDefault();
    if (!canAccount) return;
    signIn(email, name);
    setStep(1);
  }

  function finish() {
    setTaste({ paletteVibe: palette, partyFrequency: frequency, plannerLevel: level });
    router.push("/app/new");
  }

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-lg px-6 py-16">
        {step === 0 ? (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">3-day free trial</p>
            <h1 className="mt-2 text-4xl">Start planning with {brand.name}</h1>
            <p className="mt-2 text-sm text-muted">
              No charge today. Free includes one workspace and {FREE_AI_PROMPTS} AI prompts a month.
            </p>
            <form onSubmit={onAccount} className="mt-8 space-y-4">
              <Field label="Your name">
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex" required />
              </Field>
              <Field label="Email">
                <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="alex@email.com" required />
              </Field>
              <Button type="submit" variant="dark" className="w-full" disabled={!canAccount}>
                Continue
              </Button>
            </form>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <h1 className="text-4xl">Which palette feels like you?</h1>
            <p className="mt-2 text-sm text-muted">We use this when we rank themes for your parties.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {colorVibes.map((vibe) => (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => setPalette(vibe.id)}
                  className={`rounded-3xl p-3 text-left hairline ${palette === vibe.id ? "ring-2 ring-[var(--accent)]" : "bg-paper-2/80"}`}
                >
                  <div className="flex gap-1">
                    {vibe.swatches.map((hex) => (
                      <span key={hex} className="h-7 flex-1 rounded-md" style={{ background: hex }} />
                    ))}
                  </div>
                  <p className="mt-2 font-medium">{vibe.name}</p>
                  <p className="text-xs text-muted">{vibe.hint}</p>
                </button>
              ))}
            </div>
            <Button className="mt-6 w-full" variant="dark" onClick={() => setStep(2)}>
              Next
            </Button>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1 className="text-4xl">How often do you plan parties?</h1>
            <div className="mt-6 space-y-2">
              {partyFrequencies.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFrequency(option)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 hairline ${frequency === option ? "bg-white ring-2 ring-[var(--accent)]" : "bg-paper-2/80"}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <Button className="mt-6 w-full" variant="dark" onClick={() => setStep(3)}>
              Next
            </Button>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 className="text-4xl">Your planner level</h1>
            <div className="mt-6 space-y-2">
              {plannerLevels.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLevel(option)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 hairline ${level === option ? "bg-white ring-2 ring-[var(--accent)]" : "bg-paper-2/80"}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <Button className="mt-6 w-full" variant="dark" onClick={finish}>
              Start planning
            </Button>
          </>
        ) : null}
      </main>
      <MarketingFooter />
    </div>
  );
}

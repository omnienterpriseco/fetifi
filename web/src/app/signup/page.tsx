"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingNav } from "@/components/nav";
import { Button, Field, inputClass } from "@/components/ui";
import { FREE_AI_PROMPTS } from "@/lib/pricing";
import { useAppStore } from "@/lib/store";

export default function SignupPage() {
  const signIn = useAppStore((s) => s.signIn);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    signIn(email || "host@inbox.test", name || "Host");
    router.push("/app/new");
  }

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-4xl">Start with a blank box</h1>
        <p className="mt-2 text-sm text-muted">
          Free tier: one active event, {FREE_AI_PROMPTS} AI prompts a month. Upgrade per
          event or go Pro anytime.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Your name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex" />
          </Field>
          <Field label="Email">
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="alex@email.com" />
          </Field>
        <Button
          type="button"
          variant="dark"
          className="w-full"
          onClick={() => {
            signIn(email || "host@inbox.test", name || "Host");
            router.push("/app/new");
          }}
        >
          Create account
        </Button>
        </form>
      </main>
    </div>
  );
}

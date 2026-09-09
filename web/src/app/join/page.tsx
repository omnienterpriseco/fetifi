"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingNav } from "@/components/nav";
import { Button, Field, inputClass } from "@/components/ui";
import { useAppStore } from "@/lib/store";

export default function JoinPage() {
  const joinWithCode = useAppStore((s) => s.joinWithCode);
  const user = useAppStore((s) => s.currentUser);
  const signIn = useAppStore((s) => s.signIn);
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) signIn("guest@inbox.test", "Guest collaborator");
    const event = useAppStore.getState().joinWithCode(code);
    if (!event) {
      setError("No event uses that code on this device.");
      return;
    }
    router.push(`/app/events/${event.id}`);
  }

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-4xl">Join with a 6-character code</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Join code">
            <input
              className={`${inputClass} uppercase tracking-[0.3em]`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={8}
              placeholder="K7Q2LM"
            />
          </Field>
          {error ? <p className="text-sm text-accent-2">{error}</p> : null}
          <Button type="submit" variant="dark" className="w-full">
            Enter workspace
          </Button>
        </form>
      </main>
    </div>
  );
}

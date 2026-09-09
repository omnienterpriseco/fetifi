"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingNav } from "@/components/nav";
import { Button, Field, inputClass } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { brand } from "@/lib/brand";

export default function LoginPage() {
  const signIn = useAppStore((s) => s.signIn);
  const router = useRouter();
  const [email, setEmail] = useState("you@example.com");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    signIn(email);
    router.push("/app");
  }

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">
          Demo auth lives on this device. Connect Supabase Auth (Apple, Google, magic
          link) when you’re ready.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Email">
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </Field>
          <Field label="Password">
            <input className={inputClass} type="password" defaultValue="••••••••" />
          </Field>
          <Button
            type="button"
            variant="dark"
            className="w-full"
            onClick={() => {
              signIn(email);
              router.push("/app");
            }}
          >
            Continue
          </Button>
          <Button type="button" variant="outline" className="w-full">
            Sign in with Apple
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          New to {brand.name}?{" "}
          <a className="text-ink underline" href="/signup">
            Create an account
          </a>
        </p>
      </main>
    </div>
  );
}

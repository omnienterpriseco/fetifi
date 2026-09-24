"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingNav } from "@/components/nav";
import { MarketingFooter } from "@/components/footer";
import { Button, Field, inputClass } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { brand } from "@/lib/brand";

export default function LoginPage() {
  const signIn = useAppStore((s) => s.signIn);
  const router = useRouter();
  const [email, setEmail] = useState("");

  function go(e: FormEvent) {
    e.preventDefault();
    signIn(email || "you@example.com");
    router.push("/app");
  }

  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in with the email you used to start your trial.</p>
        <form onSubmit={go} className="mt-8 space-y-4">
          <Field label="Email">
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </Field>
          <Button type="submit" variant="dark" className="w-full">
            Continue
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          New to {brand.name}?{" "}
          <a className="text-ink underline" href="/signup">
            Start a 3-day free trial
          </a>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}

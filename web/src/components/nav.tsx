"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { BrandBar } from "./brand";
import { Button } from "./ui";

export function MarketingNav() {
  const user = useAppStore((s) => s.currentUser);
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="flex items-center">
        <BrandBar />
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
        <Link href="/#modules">Modules</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/join">Join an event</Link>
      </nav>
      <div className="flex items-center gap-2">
        {user ? (
          <Button href="/app" variant="dark">
            Open workspace
          </Button>
        ) : (
          <>
            <Button href="/login" variant="ghost">
              Sign in
            </Button>
            <Button href="/signup" variant="dark">
              Start free
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((s) => s.currentUser);
  const signOut = useAppStore((s) => s.signOut);

  return (
    <header className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3 md:px-6">
      <Link href="/app" className="flex items-center">
        <BrandBar compact />
      </Link>
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/pricing"
          className={pathname?.startsWith("/pricing") ? "text-ink" : "text-muted"}
        >
          Plans
        </Link>
        <span className="hidden text-muted sm:inline">{user?.fullName}</span>
        <button
          className="text-muted"
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

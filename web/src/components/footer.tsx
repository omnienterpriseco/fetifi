import Link from "next/link";
import { brand } from "@/lib/brand";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-10 text-sm text-muted md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>
          {brand.name}. {brand.slogan}
        </p>
        <nav className="flex flex-wrap gap-5">
          <Link href="/pricing">Pricing</Link>
          <Link href="/signup">Start trial</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/join">Join an event</Link>
        </nav>
      </div>
    </footer>
  );
}

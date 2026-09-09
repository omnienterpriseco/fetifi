"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";

const links = [
  ["", "Overview"],
  ["/schedule", "Schedule"],
  ["/supplies", "Supplies"],
  ["/budget", "Budget"],
  ["/guests", "Guests"],
  ["/team", "Team"],
  ["/printables", "Print"],
  ["/ai", "AI"],
];

export function EventFrame({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const event = useAppStore((s) => s.events.find((row) => row.id === params.id));

  if (!event) {
    return <p className="p-10 text-sm text-muted">That event isn’t in this box.</p>;
  }

  const base = `/app/events/${event.id}`;

  return (
    <div
      style={
        {
          "--accent": event.theme.primaryColor,
          "--accent-2": event.theme.accentColor,
          "--paper-2": event.theme.secondaryColor,
        } as React.CSSProperties
      }
    >
      <div
        className="px-6 py-8 text-[var(--paper)] md:px-10"
        style={{ background: event.theme.primaryColor }}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] opacity-80">
          {event.theme.themeName} · {event.joinCode}
        </p>
        <h1 className="mt-2 text-4xl text-[var(--paper)]">{event.title}</h1>
        <p className="mt-2 max-w-xl text-sm opacity-80">{event.theme.mood}</p>
      </div>
      <nav className="no-print sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-[var(--line)] bg-paper/90 px-3 py-2 backdrop-blur md:px-8">
        {links.map(([path, label]) => {
          const href = `${base}${path}`;
          const active = path === "" ? pathname === base : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
                active ? "bg-ink text-paper" : "text-muted hover:bg-black/5"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">{children}</div>
    </div>
  );
}

export function useEvent() {
  const params = useParams<{ id: string }>();
  return useAppStore((s) => s.events.find((row) => row.id === params.id));
}

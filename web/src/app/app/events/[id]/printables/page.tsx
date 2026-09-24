"use client";

import { useEvent } from "@/components/event-frame";
import { Button, inputClass } from "@/components/ui";
import { useAppStore } from "@/lib/store";

export default function PrintablesPage() {
  const event = useEvent();
  const updatePrintable = useAppStore((s) => s.updatePrintable);
  const refreshPlan = useAppStore((s) => s.refreshPlan);
  if (!event) return null;

  return (
    <div>
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl">Printables</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refreshPlan(event.id)}>
            Rebuild from theme
          </Button>
          <Button variant="dark" onClick={() => window.print()}>
            Print / PDF
          </Button>
        </div>
      </div>
      <div className="mt-8 grid gap-6">
        {event.printables.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.8rem] p-8"
            style={{
              background: event.theme.secondaryColor,
              color: event.theme.primaryColor,
              border: `2px solid ${event.theme.primaryColor}`,
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.25em]">{item.type}</p>
            <h3 className="mt-3 text-center text-3xl">{item.title}</h3>
            <textarea
              key={`${item.id}-${item.body.slice(0, 24)}`}
              className={`${inputClass} mt-4 min-h-40 bg-white/70 font-sans`}
              defaultValue={item.body}
              onBlur={(e) => updatePrintable(event.id, item.id, e.target.value)}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEvent } from "@/components/event-frame";
import { Button } from "@/components/ui";

export default function PrintablesPage() {
  const event = useEvent();
  if (!event) return null;

  return (
    <div>
      <div className="no-print flex items-center justify-between">
        <h2 className="text-3xl">Printables</h2>
        <Button variant="dark" onClick={() => window.print()}>
          Print / PDF
        </Button>
      </div>
      <div className="mt-8 grid gap-6">
        {event.printables.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.8rem] p-8 text-center"
            style={{
              background: event.theme.secondaryColor,
              color: event.theme.primaryColor,
              border: `2px solid ${event.theme.primaryColor}`,
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.25em]">{item.type}</p>
            <h3 className="mt-3 text-3xl">{item.title}</h3>
            <pre className="mt-4 font-sans text-sm whitespace-pre-wrap">{item.body}</pre>
          </article>
        ))}
      </div>
    </div>
  );
}

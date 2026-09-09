"use client";

import { useEvent } from "@/components/event-frame";
import { optimizeBudget } from "@/lib/planner";
import { money } from "@/lib/utils";

export default function BudgetPage() {
  const event = useEvent();
  if (!event) return null;
  const result = optimizeBudget(event);
  const pct = event.totalBudget
    ? Math.min(100, Math.round((result.spent / event.totalBudget) * 100))
    : 0;

  return (
    <div>
      <h2 className="text-3xl">Budget</h2>
      <p className="mt-2 text-muted">
        Ceiling {money(event.totalBudget)} · estimated {money(result.spent)} · {pct}%
      </p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: result.over > 0 ? "var(--accent-2)" : "var(--accent)",
          }}
        />
      </div>
      {result.over > 0 ? (
        <p className="mt-3 text-sm" style={{ color: "var(--accent-2)" }}>
          Over by {money(result.over)} if estimates hold.
        </p>
      ) : null}
      <ul className="mt-8 space-y-3">
        {event.budgets.map((row) => {
          const spent = event.supplies
            .filter((s) => s.category === row.category)
            .reduce((sum, s) => sum + s.estimatedCost, 0);
          return (
            <li key={row.id} className="hairline rounded-2xl bg-white/50 p-4">
              <div className="flex justify-between text-sm">
                <span>{row.category}</span>
                <span>
                  {money(spent)} / {money(row.allocatedAmount)}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{
                    width: `${Math.min(100, (spent / Math.max(row.allocatedAmount, 1)) * 100)}%`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 hairline rounded-3xl p-5" style={{ background: event.theme.secondaryColor }}>
        <h3 className="text-xl">Optimizer</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {result.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

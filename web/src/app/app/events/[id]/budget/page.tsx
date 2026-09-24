"use client";

import { useEvent } from "@/components/event-frame";
import { inputClass } from "@/components/ui";
import { optimizeBudget } from "@/lib/planner";
import { money } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export default function BudgetPage() {
  const event = useEvent();
  const setBudgetCeiling = useAppStore((s) => s.setBudgetCeiling);
  const setBudgetLine = useAppStore((s) => s.setBudgetLine);
  if (!event) return null;
  const result = optimizeBudget(event);
  const pct = event.totalBudget
    ? Math.min(100, Math.round((result.spent / event.totalBudget) * 100))
    : 0;

  return (
    <div>
      <h2 className="text-3xl">Budget</h2>
      <p className="mt-2 text-muted">Set the ceiling, then tweak each category. Estimates come from your supply list.</p>
      <label className="mt-4 flex items-center gap-2 text-sm">
        Ceiling $
        <input
          className={`${inputClass} max-w-40`}
          defaultValue={event.totalBudget}
          key={event.totalBudget}
          onBlur={(e) => setBudgetCeiling(event.id, Number(e.target.value) || 0)}
        />
      </label>
      <p className="mt-2 text-muted">
        Estimated {money(result.spent)} · {pct}% of ceiling
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
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span>{row.category}</span>
                <span>
                  supplies {money(spent)} / plan {money(row.allocatedAmount)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <label>
                  Plan $
                  <input
                    className="ml-2 w-24 rounded-xl hairline bg-transparent px-2 py-1"
                    defaultValue={row.allocatedAmount}
                    onBlur={(e) =>
                      setBudgetLine(event.id, row.id, { allocatedAmount: Number(e.target.value) || 0 })
                    }
                  />
                </label>
                <label>
                  Spent $
                  <input
                    className="ml-2 w-24 rounded-xl hairline bg-transparent px-2 py-1"
                    defaultValue={row.spentAmount}
                    onBlur={(e) =>
                      setBudgetLine(event.id, row.id, { spentAmount: Number(e.target.value) || 0 })
                    }
                  />
                </label>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 hairline rounded-3xl p-5" style={{ background: event.theme.secondaryColor }}>
        <h3 className="text-xl">Tips</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {result.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

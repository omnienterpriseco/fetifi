"use client";

import { FormEvent, useState } from "react";
import { useEvent } from "@/components/event-frame";
import { Button, inputClass } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import type { SupplyStatus } from "@/lib/types";
import { money } from "@/lib/utils";

const statuses: SupplyStatus[] = ["needed", "purchased", "borrowed", "delivered"];

export default function SuppliesPage() {
  const event = useEvent();
  const addSupply = useAppStore((s) => s.addSupply);
  const setSupplyStatus = useAppStore((s) => s.setSupplyStatus);
  const updateSupply = useAppStore((s) => s.updateSupply);
  const [name, setName] = useState("");

  if (!event) return null;

  function add(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !event) return;
    addSupply(event.id, name.trim());
    setName("");
  }

  const grouped = event.supplies.reduce<Record<string, typeof event.supplies>>((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-3xl">Supplies & estimates</h2>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Add an item" />
        <Button type="submit" variant="dark">
          Add
        </Button>
      </form>
      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h3 className="text-xl">{category}</h3>
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item.id} className="hairline flex flex-wrap items-center gap-3 rounded-2xl bg-white/50 px-4 py-3">
                  <div className="min-w-40 flex-1">
                    <p>{item.itemName}</p>
                    <p className="text-xs text-muted">qty {item.quantity}</p>
                  </div>
                  <input
                    className="w-24 rounded-xl hairline bg-transparent px-2 py-1 text-sm"
                    defaultValue={item.estimatedCost}
                    onBlur={(e) =>
                      updateSupply(event.id, item.id, {
                        estimatedCost: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <span className="text-xs text-muted">{money(item.estimatedCost)}</span>
                  <select
                    className="rounded-xl hairline bg-transparent px-2 py-1 text-sm"
                    value={item.status}
                    onChange={(e) =>
                      setSupplyStatus(event.id, item.id, e.target.value as SupplyStatus)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

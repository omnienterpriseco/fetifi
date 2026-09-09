"use client";

import { FormEvent, useState } from "react";
import { useEvent } from "@/components/event-frame";
import { Button, inputClass } from "@/components/ui";
import { useAppStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";

export default function SchedulePage() {
  const event = useEvent();
  const toggleSchedule = useAppStore((s) => s.toggleSchedule);
  const upsertSchedule = useAppStore((s) => s.upsertSchedule);
  const addComment = useAppStore((s) => s.addComment);
  const [title, setTitle] = useState("");

  if (!event) return null;

  function add(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !event) return;
    upsertSchedule(event.id, { title, startTime: event.dateStart });
    setTitle("");
  }

  return (
    <div>
      <h2 className="text-3xl">Run of show</h2>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a block" />
        <Button type="submit" variant="dark">
          Add
        </Button>
      </form>
      <ol className="mt-6 space-y-3">
        {event.schedules
          .slice()
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map((item) => (
            <li key={item.id} className="hairline rounded-3xl bg-white/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <button
                  className="text-left"
                  onClick={() => toggleSchedule(event.id, item.id)}
                >
                  <p className="text-xs text-muted">
                    {formatTime(item.startTime)}
                    {item.endTime ? ` – ${formatTime(item.endTime)}` : ""}
                  </p>
                  <p className={`text-lg ${item.isCompleted ? "line-through opacity-50" : ""}`}>
                    {item.title}
                  </p>
                  {item.notes ? <p className="mt-1 text-sm text-muted">{item.notes}</p> : null}
                </button>
                <span className="text-xs uppercase tracking-wider text-muted">
                  {item.isCompleted ? "done" : "open"}
                </span>
              </div>
              <div className="mt-3 space-y-1">
                {event.comments
                  .filter((c) => c.targetId === item.id)
                  .map((c) => (
                    <p key={c.id} className="text-xs text-muted">
                      {c.authorName}: {c.body}
                    </p>
                  ))}
                <button
                  className="text-xs underline"
                  onClick={() => {
                    const body = prompt("Comment on this block");
                    if (body) addComment(event.id, "schedule", item.id, body);
                  }}
                >
                  Comment
                </button>
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
}

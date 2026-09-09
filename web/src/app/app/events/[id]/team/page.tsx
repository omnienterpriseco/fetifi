"use client";

import { useEvent } from "@/components/event-frame";
import { useAppStore } from "@/lib/store";
import type { CollaboratorRole } from "@/lib/types";

export default function TeamPage() {
  const event = useEvent();
  const setCollaboratorRole = useAppStore((s) => s.setCollaboratorRole);
  const updateEvent = useAppStore((s) => s.updateEvent);
  if (!event) return null;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-3xl">Volunteers</h2>
        <ul className="mt-4 space-y-2">
          {event.volunteers.map((role) => (
            <li key={role.id} className="hairline rounded-2xl bg-white/50 p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="text-lg">{role.roleName}</p>
                  <p className="text-sm text-muted">{role.description}</p>
                </div>
                <select
                  className="h-9 rounded-xl hairline bg-transparent px-2 text-sm"
                  value={role.status}
                  onChange={(e) =>
                    updateEvent(event.id, {
                      volunteers: event.volunteers.map((row) =>
                        row.id === role.id
                          ? { ...row, status: e.target.value as typeof row.status }
                          : row,
                      ),
                    })
                  }
                >
                  <option value="invited">invited</option>
                  <option value="accepted">accepted</option>
                  <option value="declined">declined</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-3xl">Collaborators</h2>
        <p className="mt-1 text-sm text-muted">
          Share join code <span className="font-mono text-ink">{event.joinCode}</span>
        </p>
        <ul className="mt-4 space-y-2">
          {event.collaborators.map((person) => (
            <li key={person.id} className="hairline flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3">
              <div>
                <p>{person.name}</p>
                <p className="text-xs text-muted">{person.email}</p>
              </div>
              <select
                className="rounded-xl hairline bg-transparent px-2 py-1 text-sm"
                value={person.role}
                onChange={(e) =>
                  setCollaboratorRole(event.id, person.id, e.target.value as CollaboratorRole)
                }
              >
                <option value="owner">owner</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </select>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
